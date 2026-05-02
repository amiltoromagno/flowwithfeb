import { getAllTimelinePosts } from '~/server/utils/posts'

export default defineEventHandler(async () => {
  return getAllTimelinePosts()
})
