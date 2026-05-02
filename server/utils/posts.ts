import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import type { Post, PostSummary } from '~/types/blog'

const POSTS_DIR = path.resolve(process.cwd(), 'content/posts')

function fromSlug(slug: string): string {
  return path.join(POSTS_DIR, `${slug}.md`)
}

function toSlug(filepath: string): string {
  return path.basename(filepath, '.md')
}

function parsePostFile(raw: string, filepath: string): Post {
  const { data, content } = matter(raw)
  return {
    slug: toSlug(filepath),
    title: data.title || '',
    publishedAt: data.publishedAt || new Date().toISOString(),
    coverImage: data.coverImage || undefined,
    coverAlt: data.coverAlt || undefined,
    coverCaption: data.coverCaption || undefined,
    excerpt: data.excerpt || undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
    body: content.trim(),
  }
}

function toSummary(post: Post): PostSummary {
  const { body, ...summary } = post
  return summary
}

export async function listPosts(query?: { from?: string }): Promise<PostSummary[]> {
  let files: string[]
  try {
    files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }

  const posts: Post[] = []
  for (const file of files) {
    const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8')
    posts.push(parsePostFile(raw, file))
  }

  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  if (query?.from) {
    const [year, month] = query.from.split('-')
    const fromDate = new Date(Number(year), Number(month) - 1, 1)
    return posts
      .filter((p) => new Date(p.publishedAt) >= fromDate)
      .map(toSummary)
  }

  return posts.map(toSummary)
}

export async function getPost(slug: string): Promise<Post | null> {
  const filepath = fromSlug(slug)
  try {
    const raw = await fs.readFile(filepath, 'utf-8')
    return parsePostFile(raw, filepath)
  } catch {
    return null
  }
}

export async function createPost(post: Post): Promise<void> {
  const filepath = fromSlug(post.slug)
  const frontmatter: Record<string, unknown> = {
    title: post.title,
    publishedAt: post.publishedAt,
    tags: post.tags,
  }
  if (post.coverImage) frontmatter.coverImage = post.coverImage
  if (post.coverAlt) frontmatter.coverAlt = post.coverAlt
  if (post.coverCaption) frontmatter.coverCaption = post.coverCaption
  if (post.excerpt) frontmatter.excerpt = post.excerpt

  const content = matter.stringify(post.body, frontmatter)
  await fs.mkdir(POSTS_DIR, { recursive: true })
  await fs.writeFile(filepath, content, 'utf-8')
}

export async function updatePost(slug: string, post: Partial<Post> & { slug: string }): Promise<void> {
  const existing = await fs.readFile(fromSlug(slug), 'utf-8')
  const { data: oldData } = matter(existing)

  const merged: Record<string, unknown> = {
    title: post.title ?? oldData.title,
    publishedAt: post.publishedAt ?? oldData.publishedAt,
    tags: post.tags ?? oldData.tags,
  }
  if (post.coverImage !== undefined) merged.coverImage = post.coverImage
  else if (oldData.coverImage) merged.coverImage = oldData.coverImage
  if (post.coverAlt !== undefined) merged.coverAlt = post.coverAlt
  else if (oldData.coverAlt) merged.coverAlt = oldData.coverAlt
  if (post.coverCaption !== undefined) merged.coverCaption = post.coverCaption
  else if (oldData.coverCaption) merged.coverCaption = oldData.coverCaption
  if (post.excerpt !== undefined) merged.excerpt = post.excerpt
  else if (oldData.excerpt) merged.excerpt = oldData.excerpt

  const content = matter.stringify(post.body ?? matter(existing).content, merged)

  if (slug !== post.slug) {
    await fs.unlink(fromSlug(slug))
    await fs.writeFile(fromSlug(post.slug), content, 'utf-8')
  } else {
    await fs.writeFile(fromSlug(slug), content, 'utf-8')
  }
}

export async function deletePost(slug: string): Promise<void> {
  await fs.unlink(fromSlug(slug))
}

export async function getAllTimelinePosts(): Promise<Pick<Post, 'slug' | 'title' | 'publishedAt'>[]> {
  let files: string[]
  try {
    files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }

  const posts: Pick<Post, 'slug' | 'title' | 'publishedAt'>[] = []
  for (const file of files) {
    const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8')
    const { data } = matter(raw)
    posts.push({
      slug: toSlug(file),
      title: data.title || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
    })
  }

  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return posts
}
