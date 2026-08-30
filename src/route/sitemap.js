import dayjs from 'dayjs'

import config from '#lib/config.js'
import { getProphecySlugsWithCache } from '#service/Prophecy/getProphecySlugsWithCache.js'

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/

export default function route (app) {
  // Sitemap index: lists one entry per month that has prophecies (plus the
  // current month, which also carries the homepage).
  app.get(
    '/sitemap.xml',
    async (ctx, next) => {
      const prophecies = await getProphecySlugsWithCache()
      const months = getMonths(prophecies)

      ctx.res.type = 'xml'
      ctx.res.body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${months.map((m) => `  <sitemap>
    <loc>${config.webHost}/sitemaps/${m}.xml</loc>
  </sitemap>`).join('\n')}
</sitemapindex>
`
    }
  )

  // Monthly sitemap: all prophecies published in YYYY-MM. The current month
  // also includes the homepage so it always has a stable home.
  app.get(
    '/sitemaps/:month.xml',
    async (ctx, next) => {
      const month = ctx.req.params.month
      if (!MONTH_REGEX.test(month)) {
        ctx.res.status = 404
        return
      }

      const prophecies = await getProphecySlugsWithCache()
      const monthProphecies = prophecies.filter((p) => p.date.startsWith(month))
      const isCurrentMonth = month === dayjs().format('YYYY-MM')

      const urls = [
        ...(isCurrentMonth ? [generateHomeLoc()] : []),
        ...monthProphecies.map(generateLoc)
      ]

      ctx.res.type = 'xml'
      ctx.res.body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
    }
  )
}

function getMonths (prophecies) {
  const currentMonth = dayjs().format('YYYY-MM')
  const set = new Set([currentMonth])
  for (const p of prophecies) {
    set.add(p.date.slice(0, 7))
  }
  return [...set].sort().reverse()
}

function generateHomeLoc () {
  return `  <url>
    <loc>${config.webHost}/</loc>
    <lastmod>${dayjs().startOf('day').toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`
}

function generateLoc (prophecy) {
  return `  <url>
    <loc>${config.webHost}/en/${prophecy.slug}</loc>
    <lastmod>${prophecy.date}T00:00:00Z</lastmod>
    <changefreq>never</changefreq>
    <priority>0.9</priority>
  </url>`
}
