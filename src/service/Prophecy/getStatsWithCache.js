import { getContext } from '@hoajs/context-storage'
import { count, countDistinct } from 'drizzle-orm'

import cache from '#lib/cache.js'
import { Prophecy } from '#db/index.js'

export const getStatsWithCache = cache(async function getStatsWithCache () {
  const ctx = getContext()

  const stats = await ctx.db
    .select({
      prophecyCount: count(),
      dateCount: countDistinct(Prophecy.date),
      tagCount: countDistinct(Prophecy.tag),
      modelCount: countDistinct(Prophecy.modelId)
    })
    .from(Prophecy)

  return {
    prophecyCount: Number(stats[0]?.prophecyCount ?? 0),
    dateCount: Number(stats[0]?.dateCount ?? 0),
    tagCount: Number(stats[0]?.tagCount ?? 0),
    modelCount: Number(stats[0]?.modelCount ?? 0)
  }
})
