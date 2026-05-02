import { updatePost } from '~/server/utils/posts'
import type { Post } from '~/types/blog'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'slug is required' })
  }
  const body = await readBody<Partial<Post> & { slug: string }>(event)
  if (!body.slug) {
    throw createError({ statusCode: 400, statusMessage: 'slug is required' })
  }
  await updatePost(slug, body)
  return { success: true }
})
