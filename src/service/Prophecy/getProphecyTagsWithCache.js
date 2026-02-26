import { count } from 'drizzle-orm'
import { getContext } from '@hoajs/context-storage'

import cache from '#lib/cache.js'
import { Prophecy } from '#db/index.js'

export const getProphecyTagsWithCache = cache(async function getProphecyTagsWithCache () {
  const ctx = getContext()

  const rows = await ctx.db
    .select({
      tag: Prophecy.tag,
      count: count()
    })
    .from(Prophecy)
    .groupBy(Prophecy.tag)
    .orderBy(count())

  const total = rows.reduce((s, r) => s + Number(r.count), 0)

  return rows
    .map(r => ({
      name: r.tag,
      count: Number(r.count),
      percent: total > 0 ? Math.round(Number(r.count) / total * 1000) / 10 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})
