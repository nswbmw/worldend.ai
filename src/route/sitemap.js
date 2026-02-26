import dayjs from 'dayjs'

import config from '#lib/config.js'
import { getProphecySlugsWithCache } from '#service/Prophecy/getProphecySlugsWithCache.js'

export default function route (app) {
  app.get(
    '/sitemap.xml',
    async (ctx, next) => {
      const date = dayjs().format('YYYY-MM-DD')

      const prophecies = await getProphecySlugsWithCache()

      ctx.res.type = 'application/xml'
      ctx.res.body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${config.webHost}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  ${prophecies.map(generateLoc).join('\n')}

</urlset>`
    }
  )
}

function generateLoc (prophecy) {
  return `<url>
    <loc>${config.webHost}/en/${prophecy.slug}</loc>
    <lastmod>${prophecy.date}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.9</priority>
  </url>`
}
