export interface Post {
  slug: string
  title: string
  publishedAt: string
  coverImage?: string
  coverAlt?: string
  coverCaption?: string
  excerpt?: string
  tags: string[]
  body: string
}

export interface PostSummary {
  slug: string
  title: string
  publishedAt: string
  coverImage?: string
  coverAlt?: string
  coverCaption?: string
  excerpt?: string
  tags: string[]
}

export interface TimelineMonth {
  year: number
  month: number
  label: string
  hasPosts: boolean
  posts: Pick<PostSummary, 'slug' | 'title' | 'publishedAt'>[]
}
