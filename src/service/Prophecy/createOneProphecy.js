import { getContext } from '@hoajs/context-storage'

import { Prophecy } from '#db/index.js'
import { getModelIdsWithCache } from '#service/Prophecy/getModelIdsWithCache.js'
import { getOneProphecyWithCache } from '#service/Prophecy/getOneProphecyWithCache.js'
import { getProphecySlugsWithCache } from '#service/Prophecy/getProphecySlugsWithCache.js'
import { getProphecyTagsWithCache } from '#service/Prophecy/getProphecyTagsWithCache.js'
import { getStatsWithCache } from '#service/Prophecy/getStatsWithCache.js'

export async function createOneProphecy ({ slug, date, modelId, tag, content }) {
  const ctx = getContext()

  await ctx.db
    .insert(Prophecy)
    .values({
      slug,
      date,
      modelId,
      tag,
      content
    })
    .onConflictDoNothing()

  await Promise.all([
    getModelIdsWithCache.clear(),
    getOneProphecyWithCache.clear({ slug }),
    getProphecySlugsWithCache.clear(),
    getProphecyTagsWithCache.clear(),
    getStatsWithCache.clear()
  ])
}
