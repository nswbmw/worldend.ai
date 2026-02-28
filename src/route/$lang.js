import dayjs from 'dayjs'
import { nanaValidator } from '@hoajs/nana'
import pAll from 'p-all'

import config from '#lib/config.js'
import n from '#lib/nana.js'
import { translateWithCache } from '#lib/translate.js'
import { getModelIdsWithCache } from '#service/Prophecy/getModelIdsWithCache.js'
import { getProphecies } from '#service/Prophecy/getProphecies.js'
import { searchPropheciesByKeyword } from '#service/Prophecy/searchPropheciesByKeyword.js'
import { getStatsWithCache } from '#service/Prophecy/getStatsWithCache.js'
import { getProphecyTagsWithCache } from '#service/Prophecy/getProphecyTagsWithCache.js'
import propheciesTemplate from '#views/components/prophecies.js'
import { renderLayout } from '#views/render.js'
import layoutMetaTemplate from '#views/components/layout-meta.js'

export default function route (app) {
  app.get(
    '/:lang',
    nanaValidator({
      params: n.object({
        lang: n.pipe(
          n.required(),
          n.string(),
          n.enum(config.langs)
        ),
      }),
      query: n.object({
        keyword: n.pipe(
          n.optional(),
          n.string(),
          n.trim()
        ),
        date: n.pipe(
          n.optional(),
          n.string(),
          n.pattern(/^20[0-9]{2}-[0-9]{2}-[0-9]{2}$/)
        ),
        modelId: n.pipe(
          n.optional(),
          n.string()
        ),
        tag: n.pipe(
          n.optional(),
          n.string()
        ),
        page: n.pipe(
          n.default(1),
          n.toInteger(),
          n.range([1, 100])
        ),
        pageSize: n.pipe(
          n.default(10),
          n.toInteger(),
          n.range([10, 100])
        ),
        type: n.pipe(
          n.default('html'),
          n.string(),
          n.enum(['html', 'json', 'rss'])
        )
      })
    }),
    async (ctx, next) => {
      const params = ctx.req.params
      const query = ctx.req.query
      const lang = params.lang
      const keyword = query.keyword
      const date = query.date
      const modelId = query.modelId
      const tag = query.tag
      const page = Math.max(1, parseInt(query.page) || 1)
      const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize) || 10))
      const type = query.type

      let prophecies = []

      if (keyword) {
        prophecies = await searchPropheciesByKeyword({
          keyword,
          page,
          pageSize
        })
      } else {
        prophecies = await getProphecies({
          date,
          modelId,
          tag,
          page,
          pageSize
        })
      }

      prophecies = await pAll(prophecies.map(prophecy => async () => {
        if (lang !== 'en') {
          const [translatedTag, translatedContent] = await Promise.all([
            translateWithCache({
              ctx,
              sourceLang: 'auto',
              targetLang: lang,
              text: prophecy.tag
            }),
            translateWithCache({
              ctx,
              sourceLang: 'auto',
              targetLang: lang,
              text: prophecy.content
            })
          ])
          prophecy.tag = translatedTag
          prophecy.content = translatedContent
        }

        prophecy.url = `${config.webHost}/${lang}/${prophecy.slug}`
        prophecy.image = `${prophecy.url}/og`

        return prophecy
      }), { concurrency: 20 })

      if (type === 'html') {
        const [stats, modelIds, prophecyRanking] = await Promise.all([
          getStatsWithCache(),
          getModelIdsWithCache(),
          getProphecyTagsWithCache()
        ])
        const qs = new URLSearchParams()
        if (keyword) qs.set('keyword', keyword)
        if (date) qs.set('date', date)
        if (modelId) qs.set('modelId', modelId)
        if (tag) qs.set('tag', tag)
        const canonical = `${config.webHost}/${lang}${qs.toString() ? `?${qs.toString()}` : ''}`
        const description = keyword
          ? `Search results for ${keyword}`
          : config.description
        const head = {
          canonical,
          title: keyword ? `${keyword} - ${config.brandName}` : config.brandName,
          description,
        }
        const initJson = JSON.stringify({
          lang,
          keyword: keyword || null,
          prophecies: prophecies.map(p => ({
            ...p,
            content: p.content.replaceAll('\n', '<br>')
          })),
          page,
          pageSize,
          hasMore: prophecies.length === pageSize,
          modelId: modelId || null,
          tag: tag || null,
          models: modelIds,
          stats,
          prophecyRanking
        })
        ctx.res.type = 'html'
        ctx.res.body = renderLayout(
          ctx,
          { lang, title: '', head, initJson },
          {
            content: propheciesTemplate,
            headMeta: layoutMetaTemplate
          }
        )
      } else if (type === 'rss') {
        ctx.res.type = 'xml'
        ctx.res.body = generateRss(prophecies)
      } else {
        ctx.res.body = prophecies
      }
    }
  )
}

function generateRss (prophecies) {
  const updated = `${dayjs().format('YYYY-MM-DD')} 00:00:00`

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <id>${config.webHost}/rss</id>
    <title>${config.brandName}</title>
    <updated>${updated}</updated>
    <link rel="alternate" href="${config.webHost}"/>
    <subtitle>${config.description}</subtitle>
    <icon>${config.webHost}/favicon.ico</icon>
    <rights>All rights reserved ${dayjs().format('YYYY')}, ${config.domain}</rights>
    ${prophecies.map(prophecy => `
      <entry>
          <title type="html"><![CDATA[${prophecy.date} / ${prophecy.modelId} / ${prophecy.tag}]]></title>
          <id>${prophecy.slug}</id>
          <link href="${prophecy.url}"/>
          <updated>${prophecy.date}</updated>
          <content type="html"><![CDATA[${prophecy.content}]]></content>
          <author>
              <name>${prophecy.modelId}</name>
          </author>
      </entry>
    `).join('\n')}
</feed>`
}
