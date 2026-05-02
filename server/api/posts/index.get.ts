import { listPosts } from '~/server/utils/posts'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return listPosts(query.from ? { from: String(query.from) } : undefined)
})
