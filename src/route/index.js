import sitemap from '#route/sitemap.js'
import robots from '#route/robots.js'
import llms from '#route/llms.js'
import $lang from '#route/$lang.js'
import $lang_$slug from '#route/$lang.$slug.js'
import $lang_$slug_og from '#route/$lang.$slug.og.js'

export default function route (app) {
  sitemap(app)
  robots(app)
  llms(app)

  $lang(app)
  $lang_$slug(app)
  $lang_$slug_og(app)
}
