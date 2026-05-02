export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (path.startsWith('/api/debug')) {
    return
  }

  if (path.startsWith('/login') || path.startsWith('/api/login') || path.startsWith('/api/logout')) {
    return
  }

  try {
    const session = await getUserSession(event)
    if (!session?.user?.authenticated) {
      if (path.startsWith('/api/')) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
      }
      return sendRedirect(event, '/login')
    }
  } catch (err: any) {
    if (err.statusCode) throw err
    if (path.startsWith('/api/')) {
      throw createError({ statusCode: 500, statusMessage: 'Session error: ' + (err.message || 'unknown') })
    }
    return sendRedirect(event, '/login')
  }
})
