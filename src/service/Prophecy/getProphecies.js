import { getContext } from '@hoajs/context-storage'
import { eq, and, desc } from 'drizzle-orm'

import { Prophecy } from '#db/index.js'

export async function getProphecies ({ date, modelId, tag, page, pageSize }) {
  const ctx = getContext()

  const query = ctx.db
    .select()
    .from(Prophecy)
    .orderBy(desc(Prophecy.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const conditions = []
  if (date) {
    conditions.push(eq(Prophecy.date, date))
  }
  if (modelId) {
    conditions.push(eq(Prophecy.modelId, modelId))
  }
  if (tag) {
    conditions.push(eq(Prophecy.tag, tag))
  }
  if (conditions.length > 0) {
    query.where(and(...conditions))
  }

  return query
}
