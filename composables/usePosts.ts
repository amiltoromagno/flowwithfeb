import type { Post, PostSummary, TimelineMonth } from '~/types/blog'

export type { Post, PostSummary, TimelineMonth }

export function usePosts() {
  const fetch = useRequestFetch()

  const fetchPosts = () =>
    useLazyAsyncData<PostSummary[]>('posts-all', () =>
      fetch('/api/posts')
    )

  const fetchPostsFrom = (beforeDate: string) =>
    useLazyAsyncData<PostSummary[]>(`posts-from-${beforeDate}`, () =>
      fetch('/api/posts', { query: { from: beforeDate } })
    )

  const fetchTimeline = () =>
    useLazyAsyncData<Pick<PostSummary, 'slug' | 'title' | 'publishedAt'>[]>('timeline', () =>
      fetch('/api/timeline')
    )

  const fetchPost = (slug: string) =>
    useLazyAsyncData<Post>(`post-${slug}`, () =>
      fetch(`/api/posts/${slug}`)
    )

  return { fetchPosts, fetchPostsFrom, fetchTimeline, fetchPost }
}

export function buildTimeline(
  posts: Pick<PostSummary, 'slug' | 'title' | 'publishedAt'>[]
): TimelineMonth[] {
  const now = new Date()

  const oldest = posts.length > 0
    ? new Date(posts[posts.length - 1].publishedAt)
    : now

  const months: TimelineMonth[] = []

  const cursor = new Date(now.getFullYear(), now.getMonth(), 1)
  const oldestMonth = new Date(oldest.getFullYear(), oldest.getMonth(), 1)

  while (cursor >= oldestMonth) {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()

    const monthPosts = posts.filter((p) => {
      const d = new Date(p.publishedAt)
      return d.getFullYear() === year && d.getMonth() === month
    })

    months.push({
      year,
      month,
      label: cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      hasPosts: monthPosts.length > 0,
      posts: monthPosts,
    })

    cursor.setMonth(cursor.getMonth() - 1)
  }

  return months
}

export function imageUrl(path: string | undefined): string | null {
  if (!path) return null
  return path
}
