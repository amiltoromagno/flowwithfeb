import { deletePost } from '~/server/utils/posts'

export default defineEventHandler(async (event) => {
  const db = event.context?._platform?.cloudflare?.env?.DB
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'slug is required' })
  }
  await deletePost(db, slug)
  return { success: true }
})
