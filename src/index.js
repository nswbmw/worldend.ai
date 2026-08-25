import { Hoa } from 'hoa'
import { tinyRouter } from '@hoajs/tiny-router'
import { cors } from '@hoajs/cors'
import { bodyParser } from '@hoajs/bodyparser'
import { contextStorage } from '@hoajs/context-storage'
import { mustache } from '@hoajs/mustache'
import { drizzle } from 'drizzle-orm/d1'

import { sendNotification } from '#lib/telegram.js'
import route from '#route/index.js'

const app = new Hoa()

app.extend(tinyRouter())
app.extend(mustache())

app.use(cors())
app.use(bodyParser())
app.use(contextStorage())

app.use(async (ctx, next) => {
  ctx.db = drizzle(ctx.env.DB)

  // Rewrite to en
  if (ctx.req.pathname === '/') {
    ctx.req.pathname = '/en'
  }
  if (
    ctx.req.pathname.startsWith('/styles/') ||
    ctx.req.pathname === '/favicon.svg' ||
    ctx.req.pathname === '/logo.jpg' ||
    ctx.req.pathname === '/og.png'
  ) {
    return ctx.env.ASSETS.fetch(ctx.req)
  }
  await next()

  // Apply security headers to all responses
  ctx.res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; base-uri 'self'; frame-ancestors 'self'"
  })

  if (!ctx.res.status || (ctx.res.status >= 500)) {
    ctx.executionCtx.waitUntil(sendNotification(`Unexpectedly Error. Request: ${JSON.stringify({
      url: ctx.req.pathname,
      headers: ctx.req.headers,
      body: ctx.req.body
    }, null, 2)}, Response: ${JSON.stringify(ctx.res.body, null, 2)}`))
    ctx.res.body = {
      code: 500,
      message: 'Internal Server Error'
    }
  }
})

route(app)

export default app
