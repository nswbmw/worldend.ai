import dayjs from 'dayjs'
import { getContext } from '@hoajs/context-storage'
import { gte, desc } from 'drizzle-orm'

import cache from '#lib/cache.js'
import { Prophecy } from '#db/index.js'

export const getProphecySlugsWithCache = cache(async function getProphecySlugsWithCache () {
  const ctx = getContext()

  return ctx.db
    .select({
      slug: Prophecy.slug,
      date: Prophecy.date
    })
    .from(Prophecy)
    .where(gte(Prophecy.date, dayjs().subtract(1, 'year').format('YYYY-MM-DD')))
    .orderBy(desc(Prophecy.id))
})
