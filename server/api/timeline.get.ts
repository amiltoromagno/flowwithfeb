import { getAllTimelinePosts } from '~/server/utils/posts'

export default defineEventHandler(async (event) => {
  const db = event.context?.cloudflare?.env?.DB
  return getAllTimelinePosts(db)
})
