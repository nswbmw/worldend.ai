import config from '#lib/config.js'
import { sha1 } from '#lib/crypto.js'

// https://cloud.google.com/translate/docs/languages
const NL_PLACEHOLDER = '[#]'

function encodeNewlines (text) {
  return text.replaceAll('\n', NL_PLACEHOLDER)
}

function decodeNewlines (text) {
  return text.replaceAll(NL_PLACEHOLDER, '\n')
}

export async function translate ({ text, sourceLang, targetLang }) {
  text = encodeNewlines(text.trim())
  const res = await fetch('https://translation.googleapis.com/language/translate/v2?key=' + config.google.key, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang === 'auto' ? undefined : sourceLang,
      target: targetLang,
      format: 'text'
    })
  })
  /*
  Success:
  {
    data: {
      translations: [ { translatedText: 'haha', detectedSourceLanguage: 'en' } ]
    }
  }

  Error:
  {
    error: {
      code: 400,
      message: 'Invalid Value',
      errors: [
        { message: 'Invalid Value', domain: 'global', reason: 'invalid' }
      ],
      details: [
        {
          '@type': 'type.googleapis.com/google.rpc.BadRequest',
          fieldViolations: [ { field: 'target', description: 'Target language: zh-aa' } ]
        }
      ]
    }
  }
   */
  const json = await res.json()
  // console.dir(json, { depth: 10 })

  if (json.error) {
    throw new Error(JSON.stringify(json.error))
  }

  const raw = json?.data?.translations[0].translatedText
  return decodeNewlines(raw)
}

export async function translateWithCache ({ ctx, sourceLang, targetLang, text }) {
  text = text.trim()
  const sourceChecksum = await sha1(text)
  const key = `translate:${sourceLang}:${targetLang}:${sourceChecksum}`
  const cached = await ctx.env.KV.get(key)
  if (cached) {
    return cached
  }

  const translatedText = await translate({
    text,
    sourceLang,
    targetLang
  })

  ctx.executionCtx.waitUntil(ctx.env.KV.put(key, translatedText, {
    expirationTtl: config.google.translateTTL
  }))

  return translatedText
}
