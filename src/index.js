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
  if (ctx.req.pathname.startsWith('/styles/')) {
    return ctx.env.ASSETS.fetch(ctx.req)
  }
  await next()

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
