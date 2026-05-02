import { getAllTimelinePosts } from '~/server/utils/posts'

export default defineEventHandler(async (event) => {
  const db = event.context?._platform?.cloudflare?.env?.DB
  return getAllTimelinePosts(db)
})
