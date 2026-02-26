import { getContext } from '@hoajs/context-storage'
import { eq } from 'drizzle-orm'

import cache from '#lib/cache.js'
import { Prophecy } from '#db/index.js'

export const getOneProphecyWithCache = cache(async function getOneProphecyWithCache ({ slug }) {
  const ctx = getContext()

  return ctx.db
    .select()
    .from(Prophecy)
    .where(eq(Prophecy.slug, slug))
    .then(rows => rows[0])
})
