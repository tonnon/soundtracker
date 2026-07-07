import type { Category, NewsItem } from '@/data/types'

// Same-origin proxy (api/news.ts on Vercel, mirrored for dev in vite.config.ts)
// instead of calling gnews.io directly — GNews doesn't reliably send CORS
// headers to the browser, and this also keeps the API key server-side only.
const NEWS_PROXY_ENDPOINT = '/api/news'

// Plain keyword queries, not quoted-phrase OR groups — GNews's free tier
// returns far fewer full articles for exact-phrase/boolean queries (as low as
// 0-1 results) than for a simple relevance-ranked keyword search, even when
// the phrase query matches more articles in total.
const CATEGORY_QUERY: Record<Category, string> = {
  cinema: 'film composer',
  series: 'series soundtrack',
  games: 'video game composer',
}

// GNews's free tier hard-caps at 10 articles per request no matter what `max`
// asks for, and rate-limits bursts of concurrent requests regardless of the
// 100/day quota — so the three sections are fetched one after another instead
// of with Promise.all, trading a slightly slower home load for not tripping it.
const CACHE_TTL_MS = 30 * 60 * 1000
const MAX_RESULTS = 10

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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface GnewsArticle {
  title: string
  description?: string | null
  url: string
  image: string | null
  publishedAt: string
  source: { name: string; url: string }
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

async function queryGnews(query: string, max: number): Promise<GnewsArticle[]> {
  const url = `${NEWS_PROXY_ENDPOINT}?q=${encodeURIComponent(query)}&max=${max}`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.errors?.[0] ?? body?.error ?? `News request failed (${res.status})`
    throw new Error(message)
  }
  const json = await res.json()
  return json.articles ?? []
}

/** Infers which beat a headline actually belongs to, for queries (search) that
 * span all three categories in a single GNews request. */
function classifyCategory(title: string): Category {
  const haystack = title.toLowerCase()
  if (/\bgame\b|video game/.test(haystack)) return 'games'
  if (/\bseries\b|tv show|season/.test(haystack)) return 'series'
  return 'cinema'
}

function dedupe(articles: GnewsArticle[]): GnewsArticle[] {
  // The same wire story sometimes gets indexed more than once (syndication,
  // re-crawls) — de-dupe by URL first, then by normalized title as a fallback
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

// A missing photo doesn't make a story less real — it just falls back to the
// ImageOff placeholder in NewsCard instead of being dropped from the feed.
function toNewsItems(articles: GnewsArticle[], category: Category | ((title: string) => Category)): NewsItem[] {
  return dedupe(articles).map((a) => {
    const resolvedCategory = typeof category === 'function' ? category(a.title) : category
    const item: NewsItem = {
      id: '',
      title: a.title.trim(),
      description: a.description?.trim() || undefined,
      url: a.url,
      image: a.image ?? '',
      domain: a.source.name,
      publishedAt: new Date(a.publishedAt).toISOString(),
      category: resolvedCategory,
    }
    return { ...item, id: encodeNewsId(item) }
  })
}

export async function fetchCategoryNews(category: Category, max = MAX_RESULTS): Promise<NewsItem[]> {
  const cacheKey = `news:${category}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const articles = await queryGnews(CATEGORY_QUERY[category], max)
  const items = toNewsItems(articles, category)
  writeCache(cacheKey, items)
  return items
}

export async function fetchAllCategories(): Promise<Record<Category, NewsItem[]>> {
  // Sequential, not Promise.all, with a gap between actual network calls —
  // see the note above CACHE_TTL_MS. Cache hits skip the gap since they don't
  // touch the network.
  const result = {} as Record<Category, NewsItem[]>
  const categories: Category[] = ['cinema', 'series', 'games']

  for (const category of categories) {
    const wasCached = readCache(`news:${category}`) !== null
    result[category] = await fetchCategoryNews(category)
    if (!wasCached) await delay(2000)
  }

  return result
}

export async function searchNews(term: string, max = MAX_RESULTS): Promise<NewsItem[]> {
  const trimmed = term.trim()
  if (!trimmed) return []

  const cacheKey = `news:search:${trimmed.toLowerCase()}`
  const cached = readCache(cacheKey)
  if (cached) return cached

  const query = `soundtrack composer ${trimmed}`
  const articles = await queryGnews(query, max)
  const items = toNewsItems(articles, classifyCategory)
  writeCache(cacheKey, items)
  return items
}
