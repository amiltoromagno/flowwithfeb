import { listPosts } from '~/server/utils/posts'

export default defineEventHandler(async (event) => {
  const db = event.context?.cloudflare?.env?.DB
  const query = getQuery(event)
  return listPosts(db, query.from ? { from: String(query.from) } : undefined)
})
