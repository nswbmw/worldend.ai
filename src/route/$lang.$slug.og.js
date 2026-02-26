export default function route (app) {
  app.get(
    '/:lang/:slug/og',
    async (ctx, next) => {
      const params = ctx.req.params
      const slug = params.slug

      // Read PNG from R2
      const imagePath = `images/${slug}.png`
      const obj = await ctx.env.R2.get(imagePath)

      if (obj) {
        const pngBuffer = await obj.arrayBuffer()
        ctx.res.headers = {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000'
        }
        ctx.res.body = pngBuffer
      } else {
        // Image not found
        ctx.res.status = 404
        ctx.res.headers = {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=60'
        }
        ctx.res.body = 'Image not found'
      }
    }
  )
}
