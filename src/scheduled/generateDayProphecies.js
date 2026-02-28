import dayjs from 'dayjs'
import { drizzle } from 'drizzle-orm/d1'
import { shuffle } from 'lodash-es'
import { MockContext } from '@hoajs/context-storage'
import { Resvg } from '@cf-wasm/resvg/workerd'

import config from '#lib/config.js'
import { sendNotification } from '#lib/telegram.js'
import { getPoeResponse } from '#lib/poe.js'
import { createOneProphecy } from '#service/Prophecy/createOneProphecy.js'
import { getProphecies } from '#service/Prophecy/getProphecies.js'

export default async function generateDayProphecies (event, env, ctx) {
  const models = shuffle(config.models)
  const date = dayjs().format('YYYY-MM-DD')

  const mockCtx = {
    db: drizzle(env.DB),
    env
  }

  await MockContext(mockCtx, async () => {
    for (const model of models) {
      const modelId = model.id
      try {
        const { tag, content } = await getPoeResponse({
          modelId,
          prompt: config.prompt
        })

        const slug = `${date}-${modelId}`
        if (tag && content) {
          await createOneProphecy({
            slug,
            date,
            modelId,
            tag,
            content
          })
        }
      } catch (e) {
        console.error(e)
        await sendNotification(`generateDayProphecies error: ${JSON.stringify({ date, model, error: e.message }, null, 2)}`)
      }
    }

    const fontBuffers = await loadFontsFromR2(env)

    // Check missing images
    const last100Prophecies = await getProphecies({ page: 1, pageSize: 100 })
    for (const prophecy of last100Prophecies) {
      const key = `images/${prophecy.slug}.png`
      // Check if PNG exists
      const exist = await env.R2.head(key)
      if (exist) {
        continue
      }

      // Generate PNG
      const pngBuffer = await generateOgImage({
        env,
        tag: prophecy.tag,
        content: prophecy.content,
        date: prophecy.date,
        modelId: prophecy.modelId,
        fontBuffers
      })

      // Store PNG to R2
      await env.R2.put(key, pngBuffer, {
        httpMetadata: {
          contentType: 'image/png'
        }
      })
    }
  })
}

function charWidth (ch) {
  const FONT_SIZE = 24

  if (/[\u1100-\u115F\u2E80-\u9FFF\uA960-\uA97F\uAC00-\uD7FF\uF900-\uFAFF\uFE10-\uFE6F\uFF01-\uFF60\uFFE0-\uFFE6]/.test(ch)) {
    return FONT_SIZE * 1.0
  }
  return FONT_SIZE * 0.56
}

function estimateWidth (str) {
  let w = 0
  for (const ch of str) w += charWidth(ch)
  return w
}

function escapeXml (str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function splitExcerptByWidth (str, maxWidth) {
  let i = 0
  while (i < str.length && estimateWidth(str.slice(0, i + 1)) <= maxWidth) {
    i++
  }
  if (i >= str.length) return [str, '']
  const spaceIdx = str.lastIndexOf(' ', i)
  const breakAt = spaceIdx > i * 0.5 ? spaceIdx : i
  return [str.slice(0, breakAt), str.slice(breakAt).trimStart()]
}

async function loadFontsFromR2 (env) {
  const FONT_FILES = [
    'NotoSerif-Bold.ttf',
    'NotoSans-Regular.ttf',
    'JetBrainsMono-Regular.ttf'
  ]

  const buffers = await Promise.all(
    FONT_FILES.map(async (filename) => {
      const obj = await env.R2.get(`fonts/${filename}`)
      return await obj.arrayBuffer()
    })
  )
  const fontBuffers = buffers.filter(Boolean).map(buf => new Uint8Array(buf))
  return fontBuffers
}

export async function generateOgImage ({ env, tag, content, date, modelId, fontBuffers }) {
  const AVAILABLE_WIDTH = 1072
  const truncate = (str, max) => str.length > max ? str.slice(0, max) + '…' : str
  const titleLine = truncate(tag, 40)
  const excerpt = content.replace(/\n+/g, ' ').trim()

  const [excerptLine1, excerptRest1] = splitExcerptByWidth(excerpt, AVAILABLE_WIDTH)
  const [excerptLine2, excerptRest2] = excerptRest1
    ? splitExcerptByWidth(excerptRest1, AVAILABLE_WIDTH)
    : ['', '']
  const excerptLine3 = excerptRest2
    ? (() => {
        const ellipsisWidth = estimateWidth('…')
        const [line] = splitExcerptByWidth(excerptRest2, AVAILABLE_WIDTH - ellipsisWidth)
        return excerptRest2.length > line.length ? line + '…' : line
      })()
    : ''

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0d0d0f"/>
        <stop offset="100%" stop-color="#1c1018"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)"/>
    <!-- Orange accent bar left -->
    <rect x="0" y="0" width="6" height="630" fill="#FF6B35"/>
    <!-- Site name -->
    <text x="64" y="72" font-family="Noto Serif" font-size="26" fill="#FF6B35" letter-spacing="2" font-weight="bold">${config.brandName}</text>
    <!-- Date top-right -->
    <text x="1136" y="72" font-family="JetBrains Mono" font-size="18" fill="#55534f" text-anchor="end">${escapeXml(date)}</text>
    <!-- Divider -->
    <line x1="64" y1="92" x2="1136" y2="92" stroke="#FF6B35" stroke-width="1" opacity="0.15"/>
    <!-- Title -->
    <text x="64" y="280" font-family="Noto Serif" font-size="68" fill="#f0ede8" font-weight="bold"
      textLength="${Math.min(titleLine.length * 40, 1072)}" lengthAdjust="spacingAndGlyphs">${escapeXml(titleLine)}</text>
    <!-- Excerpt (3 lines) -->
    <text font-family="Noto Sans" font-size="24" fill="#8a8780">
      <tspan x="64" y="350">${escapeXml(excerptLine1)}</tspan>
      <tspan x="64" dy="36">${escapeXml(excerptLine2)}</tspan>
      <tspan x="64" dy="36">${escapeXml(excerptLine3)}</tspan>
    </text>
    <!-- Model badge background -->
    <rect x="64" y="548" width="${modelId ? modelId.length * 12 + 32 : 0}" height="38" rx="6" fill="#FF6B35" opacity="0.12"/>
    <!-- Model badge text -->
    <text x="80" y="573" font-family="JetBrains Mono" font-size="19" fill="#FF6B35">${escapeXml(modelId)}</text>
  </svg>`

  const resvg = new Resvg(svgString, {
    fitTo: {
      mode: 'width',
      value: 1200
    },
    font: {
      fontBuffers
    }
  })

  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  return pngBuffer
}
