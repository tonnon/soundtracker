export type Category = 'cinema' | 'series' | 'games'

export interface Author {
  id: string
  name: string
  role: string
  avatarSeed: string
}

export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string[]
  category: Category
  tags: string[]
  author: Author
  publishedAt: string
  readingTimeMin: number
  coverImage: string
  featured?: boolean
}
