import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const file = formData[0]
  if (!file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'No filename' })
  }

  const ext = '.' + (file.filename.split('.').pop()?.toLowerCase() || '')
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  if (!allowedExts.includes(ext)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })
  }

  const name = `${randomUUID()}${ext}`

  const r2 = event.context?.cloudflare?.env?.IMAGES
  if (r2) {
    await r2.put(name, file.data, {
      httpMetadata: { contentType: file.type },
    })
    return { url: `/images/${name}` }
  }

  const fs = await import('node:fs/promises')
  const path = await import('node:path')
  const UPLOAD_DIR = path.resolve(process.cwd(), 'public/images')
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  await fs.writeFile(path.join(UPLOAD_DIR, name), file.data)
  return { url: `/images/${name}` }
})
