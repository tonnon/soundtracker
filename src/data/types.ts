export type Category = 'cinema' | 'series' | 'games'

/** A real news item aggregated from an external source — not staff-written,
 * so it carries the origin domain and a link out instead of a body/author. */
export interface NewsItem {
  id: string
  title: string
  url: string
  image: string
  domain: string
  publishedAt: string
  category: Category
}
