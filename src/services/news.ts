import type { Category, NewsItem } from '@/data/types'

const GDELT_ENDPOINT = 'https://api.gdeltproject.org/api/v2/doc/doc'

// sourcelang:english keeps the feed in one language — without it GDELT mixes
// in matches from non-English outlets (translated titles, foreign domains).
const CATEGORY_QUERY: Record<Category, string> = {
  cinema: '(film score OR movie soundtrack) composer sourcelang:english',
  series: '(tv series score OR series soundtrack) composer sourcelang:english',
  games: '(video game soundtrack OR game score) composer sourcelang:english',
}

// One combined query for the home page instead of three parallel ones — GDELT
// is a free, keyless API that rate-limits per IP, and firing three requests at
// once for a single page view is enough to trip that limit for a real visitor.
const COMBINED_QUERY =
  '(film score OR movie soundtrack OR tv series score OR series soundtrack OR video game soundtrack OR game score) composer sourcelang:english'

const CACHE_TTL_MS = 10 * 60 * 1000

interface CacheEntry {
  expiresAt: number
  items: NewsItem[]
}

function readCache(key: string): NewsItem[] | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    if (entry.expiresAt < Date.now()) return null
    return entry.items
  } catch {
    return null
  }
}

function writeCache(key: string, items: NewsItem[]): void {
  try {
    const entry: CacheEntry = { expiresAt: Date.now() + CACHE_TTL_MS, items }
    sessionStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // sessionStorage unavailable or full — caching is a nice-to-have, not required.
  }
}

interface GdeltArticle {
  url: string
  title: string
  seendate: string
  socialimage?: string
  domain: string
  language?: string
}

function parseSeenDate(seendate: string): string {
  // GDELT format: YYYYMMDDTHHMMSSZ
  const iso = `${seendate.slice(0, 4)}-${seendate.slice(4, 6)}-${seendate.slice(6, 8)}T${seendate.slice(9, 11)}:${seendate.slice(11, 13)}:${seendate.slice(13, 15)}Z`
  return new Date(iso).toISOString()
}

/** The route param for a news item is the item itself, base64url-encoded — there's
 * no backend to look items up by id, so the id has to be self-contained. */
export function encodeNewsId(item: NewsItem): string {
  const json = JSON.stringify(item)
  const base64 = btoa(unescape(encodeURIComponent(json)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeNewsId(id: string): NewsItem | null {
  try {
    const base64 = id.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(base64)))
    const item = JSON.parse(json) as NewsItem
    if (!item.url || !item.title) return null
    return item
  } catch {
    return null
  }
}

async function queryGdelt(query: string, maxrecords: number): Promise<GdeltArticle[]> {
  const url = `${GDELT_ENDPOINT}?query=${encodeURIComponent(query)}&mode=artlist&format=json&maxrecords=${maxrecords}&sort=hybridrel`
  // GDELT can hang for 20-30s under load instead of failing fast, which leaves
  // the skeleton on screen far longer than a real error would — an explicit
  // timeout surfaces the error state at a reasonable point instead.
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) }).catch(() => {
    throw new Error('GDELT took too long to respond — try again in a few seconds')
  })
  if (!res.ok) throw new Error(`GDELT request failed (${res.status})`)
  const text = await res.text()
  try {
    const json = JSON.parse(text)
    return json.articles ?? []
  } catch {
    // GDELT returns a plain-text rate-limit notice (not JSON) when throttled.
    throw new Error('GDELT rate limit — try again in a few seconds')
  }
}

/** Infers which beat a headline actually belongs to, for queries (combined feed,
 * search) that span all three categories in a single GDELT request. */
function classifyCategory(title: string): Category {
  const haystack = title.toLowerCase()
  if (/\bgame\b|video game/.test(haystack)) return 'games'
  if (/\bseries\b|tv show|season/.test(haystack)) return 'series'
  return 'cinema'
}

function dedupe(articles: GdeltArticle[]): GdeltArticle[] {
  // GDELT often indexes the same story more than once — syndication, mirrors,
  // or just crawling it again — so the same headline can appear twice in one
  // response. De-dupe by URL first, then by normalized title as a fallback
  // for the same story republished at a different URL.
  const seenUrls = new Set<string>()
  const seenTitles = new Set<string>()
  return articles.filter((a) => {
    const normalizedTitle = a.title.trim().toLowerCase()
    if (seenUrls.has(a.url) || seenTitles.has(normalizedTitle)) return false
    seenUrls.add(a.url)
    seenTitles.add(normalizedTitle)
    return true
  })
}

function toNewsItems(articles: GdeltArticle[], category: Category | ((title: string) => Category)): NewsItem[] {
  return dedupe(articles)
    // Belt-and-suspenders alongside the sourcelang:english query filter, which
    // isn't always exact — drop anything GDELT itself doesn't tag as English.
    .filter((a) => a.socialimage && (!a.language || a.language === 'English'))
    .map((a) => {
      const resolvedCategory = typeof category === 'function' ? category(a.title) : category
      const item: NewsItem = {
        id: '',
        title: a.title.trim(),
        url: a.url,
        image: a.socialimage!,
        domain: a.domain,
        publishedAt: parseSeenDate(a.seendate),
        category: resolvedCategory,
      }
      return { ...item, id: encodeNewsId(item) }
    })
}

export async function fetchCategoryNews(category: Category, maxrecords = 40): Promise<NewsItem[]> {
  const cacheKey = `news:${category}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const articles = await queryGdelt(CATEGORY_QUERY[category], maxrecords)
  const items = toNewsItems(articles, category)
  writeCache(cacheKey, items)
  return items
}

export async function fetchAllCategories(): Promise<Record<Category, NewsItem[]>> {
  const cacheKey = 'news:all'
  const cached = readCache(cacheKey)
  const items = cached ?? (await fetchCombined())

  return {
    cinema: items.filter((item) => item.category === 'cinema'),
    series: items.filter((item) => item.category === 'series'),
    games: items.filter((item) => item.category === 'games'),
  }

  async function fetchCombined(): Promise<NewsItem[]> {
    const articles = await queryGdelt(COMBINED_QUERY, 90)
    const mapped = toNewsItems(articles, classifyCategory)
    writeCache(cacheKey, mapped)
    return mapped
  }
}

export async function searchNews(term: string, maxrecords = 30): Promise<NewsItem[]> {
  const trimmed = term.trim()
  if (!trimmed) return []

  const cacheKey = `news:search:${trimmed.toLowerCase()}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const query = `(film score OR movie soundtrack OR tv series score OR video game soundtrack) ${trimmed} sourcelang:english`
  const articles = await queryGdelt(query, maxrecords)
  const items = toNewsItems(articles, classifyCategory)
  writeCache(cacheKey, items)
  return items
}
