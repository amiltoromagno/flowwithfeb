import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)

  const config = useRuntimeConfig()
  const hash = config.blogPasswordHash

  if (!password || !hash) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  }

  const isValid = await bcrypt.compare(password, hash)

  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Incorrect password' })
  }

  await setUserSession(event, {
    user: { authenticated: true },
    loggedInAt: new Date().toISOString(),
  })

  return { success: true }
})
