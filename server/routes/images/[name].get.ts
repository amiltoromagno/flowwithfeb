export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  if (!name) throw createError({ statusCode: 404 })

  // Cloudflare R2
  const r2 = event.context?.cloudflare?.env?.IMAGES
  if (r2) {
    const object = await r2.get(name)
    if (!object) throw createError({ statusCode: 404 })
    const headers: Record<string, string> = {
      'Content-Type': object.httpMetadata?.contentType || 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    }
    if (object.httpMetadata?.cacheControl) {
      headers['Cache-Control'] = object.httpMetadata.cacheControl
    }
    return new Response(object.body, { headers })
  }

  // Dev fallback: serve from public/images/
  const fs = await import('node:fs')
  const path = await import('node:path')
  const filepath = path.resolve(process.cwd(), 'public/images', name)
  if (!fs.existsSync(filepath)) throw createError({ statusCode: 404 })
  return sendStream(event, fs.createReadStream(filepath))
})
