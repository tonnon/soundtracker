import { ARTICLES } from '@/data/articles'
import type { Article, Category } from '@/data/types'

function byDateDesc(a: Article, b: Article): number {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
}

function byDateAsc(a: Article, b: Article): number {
  return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
}

const ALL_ARTICLES_DESC = [...ARTICLES].sort(byDateDesc)

const CUE_NUMBERS = new Map(
  [...ARTICLES].sort(byDateAsc).map((article, index) => [article.slug, index + 1]),
)

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

export function getAllArticles(): Article[] {
  return ALL_ARTICLES_DESC
}

export function getCueNumber(slug: string): number {
  return CUE_NUMBERS.get(slug) ?? 0
}

export function getFeatured(): Article[] {
  return ALL_ARTICLES_DESC.filter((article) => article.featured)
}

export function getHeroArticle(): Article | undefined {
  return getFeatured()[0] ?? ALL_ARTICLES_DESC[0]
}

export function getLatest(options: { limit?: number; excludeSlug?: string } = {}): Article[] {
  const { limit = 6, excludeSlug } = options
  const pool = excludeSlug
    ? ALL_ARTICLES_DESC.filter((article) => article.slug !== excludeSlug)
    : ALL_ARTICLES_DESC
  return pool.slice(0, limit)
}

export function getByCategory(
  category: Category,
  options: { limit?: number; offset?: number } = {},
): Article[] {
  const { limit, offset = 0 } = options
  const filtered = ALL_ARTICLES_DESC.filter((article) => article.category === category)
  return limit === undefined ? filtered.slice(offset) : filtered.slice(offset, offset + limit)
}

export function countByCategory(category: Category): number {
  return ALL_ARTICLES_DESC.filter((article) => article.category === category).length
}

export function getBySlug(slug: string): Article | undefined {
  return ALL_ARTICLES_DESC.find((article) => article.slug === slug)
}

export function searchArticles(query: string): Article[] {
  const term = normalize(query.trim())
  if (!term) return []

  return ALL_ARTICLES_DESC.map((article) => {
    const titleMatch = normalize(article.title).includes(term)
    const restMatch = normalize([article.excerpt, ...article.tags].join(' ')).includes(term)
    const score = titleMatch ? 2 : restMatch ? 1 : 0
    return { article, score }
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.article)
}

export function getRelated(article: Article, limit = 3): Article[] {
  return ALL_ARTICLES_DESC.filter(
    (candidate) => candidate.category === article.category && candidate.slug !== article.slug,
  ).slice(0, limit)
}
