export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Allow login and logout routes through
  if (path.startsWith('/login') || path.startsWith('/api/login') || path.startsWith('/api/logout')) {
    return
  }

  const session = await getUserSession(event)

  if (!session?.user?.authenticated) {
    // For API routes, return 401 instead of redirect
    if (path.startsWith('/api/')) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    return sendRedirect(event, '/login')
  }
})
