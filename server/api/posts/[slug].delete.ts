import { deletePost } from '~/server/utils/posts'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'slug is required' })
  }
  await deletePost(slug)
  return { success: true }
})
