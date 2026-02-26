import dayjs from 'dayjs'
import { getContext } from '@hoajs/context-storage'
import { gt } from 'drizzle-orm'

import cache from '#lib/cache.js'
import { Prophecy } from '#db/index.js'

export const getModelIdsWithCache = cache(async function getModelIdsWithCache () {
  const ctx = getContext()

  return ctx.db
    .selectDistinct({ modelId: Prophecy.modelId })
    .from(Prophecy)
    .where(gt(Prophecy.date, dayjs().subtract(180, 'day').format('YYYY-MM-DD')))
    .then(rows => rows.map(row => row.modelId))
})
