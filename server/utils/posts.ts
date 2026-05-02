import type { Post, PostSummary } from '~/types/blog'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D1Binding = any

interface PostRow {
  slug: string
  title: string
  published_at: string
  cover_image: string | null
  cover_alt: string | null
  cover_caption: string | null
  excerpt: string | null
  tags: string
  body: string
}

function rowToPost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    publishedAt: row.published_at,
    coverImage: row.cover_image || undefined,
    coverAlt: row.cover_alt || undefined,
    coverCaption: row.cover_caption || undefined,
    excerpt: row.excerpt || undefined,
    tags: JSON.parse(row.tags || '[]'),
    body: row.body,
  }
}

function toSummary(post: Post): PostSummary {
  const { body, ...summary } = post
  return summary
}

// ─── Filesystem helpers (only loaded in dev fallback) ───

let _fsModule: { fs: any; path: any; postsDir: string } | null = null

async function getFsModule() {
  if (_fsModule) return _fsModule
  const [fsM, pathM, matterM] = await Promise.all([
    import('node:fs/promises'),
    import('node:path'),
    import('gray-matter'),
  ])
  const fs = fsM.default
  const path = pathM.default
  const matter = matterM.default
  const postsDir = path.resolve(process.cwd(), 'content/posts')
  _fsModule = { fs, path, postsDir, matter }
  return _fsModule
}

// ─── Exported API ───

export async function listPosts(db: D1Binding | undefined, query?: { from?: string }): Promise<PostSummary[]> {
  if (db) {
    let sql = 'SELECT * FROM posts ORDER BY published_at DESC'
    const params: any[] = []
    if (query?.from) {
      sql = 'SELECT * FROM posts WHERE published_at >= ? ORDER BY published_at DESC'
      const [year, month] = query.from.split('-')
      params.push(new Date(Number(year), Number(month) - 1, 1).toISOString())
    }
    const { results } = await db.prepare(sql).bind(...params).all<PostRow>()
    return results.map(rowToPost).map(toSummary)
  }

  const { fs, path, postsDir, matter } = await getFsModule()
  let files: string[]
  try {
    files = (await fs.readdir(postsDir)).filter((f: string) => f.endsWith('.md'))
  } catch {
    return []
  }

  const posts: Post[] = []
  for (const file of files) {
    const raw = await fs.readFile(path.join(postsDir, file), 'utf-8')
    const { data, content } = matter(raw)
    posts.push({
      slug: path.basename(file, '.md'),
      title: data.title || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
      coverImage: data.coverImage || undefined,
      coverAlt: data.coverAlt || undefined,
      coverCaption: data.coverCaption || undefined,
      excerpt: data.excerpt || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      body: (content as string).trim(),
    })
  }

  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  if (query?.from) {
    const [year, month] = query.from.split('-')
    const fromDate = new Date(Number(year), Number(month) - 1, 1)
    return posts.filter((p) => new Date(p.publishedAt) >= fromDate).map(toSummary)
  }

  return posts.map(toSummary)
}

export async function getPost(db: D1Binding | undefined, slug: string): Promise<Post | null> {
  if (db) {
    const { results } = await db.prepare('SELECT * FROM posts WHERE slug = ?').bind(slug).all<PostRow>()
    if (results.length === 0) return null
    return rowToPost(results[0])
  }

  const { fs, path, postsDir, matter } = await getFsModule()
  const filepath = path.join(postsDir, `${slug}.md`)
  try {
    const raw = await fs.readFile(filepath, 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug,
      title: data.title || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
      coverImage: data.coverImage || undefined,
      coverAlt: data.coverAlt || undefined,
      coverCaption: data.coverCaption || undefined,
      excerpt: data.excerpt || undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      body: (content as string).trim(),
    }
  } catch {
    return null
  }
}

export async function createPost(db: D1Binding | undefined, post: Post): Promise<void> {
  if (db) {
    await db.prepare(
      `INSERT INTO posts (slug, title, published_at, cover_image, cover_alt, cover_caption, excerpt, tags, body)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      post.slug,
      post.title,
      post.publishedAt,
      post.coverImage ?? null,
      post.coverAlt ?? null,
      post.coverCaption ?? null,
      post.excerpt ?? null,
      JSON.stringify(post.tags),
      post.body,
    ).run()
    return
  }

  const { fs, path, postsDir, matter } = await getFsModule()
  const filepath = path.join(postsDir, `${post.slug}.md`)
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
  await fs.mkdir(postsDir, { recursive: true })
  await fs.writeFile(filepath, content, 'utf-8')
}

export async function updatePost(db: D1Binding | undefined, slug: string, update: Partial<Post> & { slug: string }): Promise<void> {
  if (db) {
    await db.prepare(
      `UPDATE posts SET slug = ?, title = ?, published_at = ?, cover_image = ?, cover_alt = ?, cover_caption = ?, excerpt = ?, tags = ?, body = ?
       WHERE slug = ?`
    ).bind(
      update.slug,
      update.title ?? '',
      update.publishedAt ?? new Date().toISOString(),
      update.coverImage ?? null,
      update.coverAlt ?? null,
      update.coverCaption ?? null,
      update.excerpt ?? null,
      JSON.stringify(update.tags ?? []),
      update.body ?? '',
      slug,
    ).run()
    return
  }

  const { fs, path, postsDir, matter } = await getFsModule()
  const oldFilepath = path.join(postsDir, `${slug}.md`)
  const existing = await fs.readFile(oldFilepath, 'utf-8')
  const { data: oldData } = matter(existing)

  const merged: Record<string, unknown> = {
    title: update.title ?? oldData.title,
    publishedAt: update.publishedAt ?? oldData.publishedAt,
    tags: update.tags ?? oldData.tags,
  }
  if (update.coverImage !== undefined) merged.coverImage = update.coverImage
  else if (oldData.coverImage) merged.coverImage = oldData.coverImage
  if (update.coverAlt !== undefined) merged.coverAlt = update.coverAlt
  else if (oldData.coverAlt) merged.coverAlt = oldData.coverAlt
  if (update.coverCaption !== undefined) merged.coverCaption = update.coverCaption
  else if (oldData.coverCaption) merged.coverCaption = oldData.coverCaption
  if (update.excerpt !== undefined) merged.excerpt = update.excerpt
  else if (oldData.excerpt) merged.excerpt = oldData.excerpt

  const newContent = matter.stringify(update.body ?? matter(existing).content, merged)

  if (slug !== update.slug) {
    await fs.unlink(oldFilepath)
    await fs.writeFile(path.join(postsDir, `${update.slug}.md`), newContent, 'utf-8')
  } else {
    await fs.writeFile(oldFilepath, newContent, 'utf-8')
  }
}

export async function deletePost(db: D1Binding | undefined, slug: string): Promise<void> {
  if (db) {
    await db.prepare('DELETE FROM posts WHERE slug = ?').bind(slug).run()
    return
  }

  const { fs, path, postsDir } = await getFsModule()
  await fs.unlink(path.join(postsDir, `${slug}.md`))
}

export async function getAllTimelinePosts(db: D1Binding | undefined): Promise<Pick<Post, 'slug' | 'title' | 'publishedAt'>[]> {
  if (db) {
    const { results } = await db.prepare('SELECT slug, title, published_at FROM posts ORDER BY published_at DESC').all<PostRow>()
    return results.map((r) => ({
      slug: r.slug,
      title: r.title,
      publishedAt: r.published_at,
    }))
  }

  const { fs, path, postsDir, matter } = await getFsModule()
  let files: string[]
  try {
    files = (await fs.readdir(postsDir)).filter((f: string) => f.endsWith('.md'))
  } catch {
    return []
  }

  const posts: Pick<Post, 'slug' | 'title' | 'publishedAt'>[] = []
  for (const file of files) {
    const raw = await fs.readFile(path.join(postsDir, file), 'utf-8')
    const { data } = matter(raw)
    posts.push({
      slug: path.basename(file, '.md'),
      title: data.title || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
    })
  }

  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return posts
}
