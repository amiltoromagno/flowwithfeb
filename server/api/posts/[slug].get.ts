import { getPost } from '~/server/utils/posts'

export default defineEventHandler(async (event) => {
  const db = event.context?._platform?.cloudflare?.env?.DB
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'slug is required' })
  }
  const post = await getPost(db, slug)
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }
  return post
})
