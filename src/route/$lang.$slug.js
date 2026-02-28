import { nanaValidator } from '@hoajs/nana'

import config from '#lib/config.js'
import n from '#lib/nana.js'
import { translateWithCache } from '#lib/translate.js'
import { getModelIdsWithCache } from '#service/Prophecy/getModelIdsWithCache.js'
import { getOneProphecyWithCache } from '#service/Prophecy/getOneProphecyWithCache.js'
import { getStatsWithCache } from '#service/Prophecy/getStatsWithCache.js'
import { getProphecyTagsWithCache } from '#service/Prophecy/getProphecyTagsWithCache.js'
import { renderLayout, renderNotFound } from '#views/render.js'
import prophecyTemplate from '#views/components/prophecy.js'
import slugMetaTemplate from '#views/components/slug-meta.js'

export default function route (app) {
  app.get(
    '/:lang/:slug',
    nanaValidator({
      params: n.object({
        lang: n.pipe(
          n.required(),
          n.string(),
          n.enum(config.langs)
        ),
        slug: n.pipe(
          n.required(),
          n.string()
        )
      }),
      query: n.object({
        type: n.pipe(
          n.default('html'),
          n.string(),
          n.enum(['html', 'json'])
        )
      })
    }),
    async (ctx, next) => {
      const params = ctx.req.params
      const query = ctx.req.query
      const lang = params.lang
      const slug = params.slug
      const type = query.type

      const prophecy = await getOneProphecyWithCache({ slug })
      if (!prophecy) {
        if (type === 'html') {
          ctx.res.type = 'text/html'
          ctx.res.body = renderNotFound(ctx)
        } else {
          ctx.res.body = null
        }
        return
      }

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

      if (type === 'html') {
        const [stats, modelIds, prophecyRanking] = await Promise.all([
          getStatsWithCache(),
          getModelIdsWithCache(),
          getProphecyTagsWithCache()
        ])
        const description = String(prophecy.content || '').replace(/\s+/g, ' ').trim().slice(0, 160)
        const jsonLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: prophecy.tag,
          datePublished: prophecy.date,
          dateModified: prophecy.date,
          mainEntityOfPage: prophecy.url,
          author: { '@type': 'Organization', name: prophecy.modelId },
          publisher: { '@type': 'Organization', name: config.brandName }
        }, null, 2)
        const head = {
          canonical: prophecy.url,
          title: `${prophecy.tag} - ${config.brandName}`,
          description,
          jsonLd
        }
        const initJson = JSON.stringify({
          lang,
          prophecy: {
            ...prophecy,
            content: prophecy.content.replaceAll('\n', '<br>')
          },
          models: modelIds,
          stats,
          prophecyRanking
        })
        ctx.res.type = 'html'
        ctx.res.body = renderLayout(
          ctx,
          { lang, head, prophecy, title: `${prophecy.tag} - `, initJson },
          { headMeta: slugMetaTemplate, content: prophecyTemplate }
        )
      } else {
        ctx.res.body = prophecy
      }
    }
  )
}
