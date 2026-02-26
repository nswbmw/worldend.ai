import { getContext } from '@hoajs/context-storage'
import { or, like, desc } from 'drizzle-orm'

import { Prophecy } from '#db/index.js'

export async function searchPropheciesByKeyword ({ keyword, page, pageSize }) {
  const ctx = getContext()

  return ctx.db
    .select()
    .from(Prophecy)
    .where(or(
      like(Prophecy.tag, `%${keyword}%`),
      like(Prophecy.content, `%${keyword}%`)
    ))
    .orderBy(desc(Prophecy.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
}
