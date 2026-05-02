import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/images')

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const file = formData[0]
  if (!file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'No filename' })
  }

  const ext = path.extname(file.filename).toLowerCase()
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  if (!allowedExts.includes(ext)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported file type' })
  }

  const name = `${randomUUID()}${ext}`
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  await fs.writeFile(path.join(UPLOAD_DIR, name), file.data)

  return { url: `/images/${name}` }
})
