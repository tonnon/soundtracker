export type Category = 'cinema' | 'series' | 'games'

/** A real news item aggregated from an external source — not staff-written,
 * so it carries the origin domain and a link out instead of a body/author.
 * `description` is a short summary from the source, not the full article. */
export interface NewsItem {
  id: string
  title: string
  description?: string
  url: string
  image: string
  domain: string
  publishedAt: string
  category: Category
}
