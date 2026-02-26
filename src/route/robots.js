import config from '#lib/config.js'

export default function route (app) {
  app.get(
    '/robots.txt',
    async (ctx, next) => {
      ctx.res.body = `User-agent: *
Allow: /

Sitemap: ${config.webHost}/sitemap.xml`
    }
  )
}
