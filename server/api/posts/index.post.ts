import { createPost } from '~/server/utils/posts'
import type { Post } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const db = event.context?.cloudflare?.env?.DB
  const body = await readBody<Post>(event)
  if (!body?.slug || !body?.title) {
    throw createError({ statusCode: 400, statusMessage: 'slug and title are required' })
  }
  await createPost(db, body)
  return { success: true }
})
