import { sqliteTable, integer, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core'

import config from '#lib/config.js'

export const Prophecy = sqliteTable(`${config.name}_prophecy`, {
  id: integer('id').primaryKey({ autoIncrement: true }),
  // date-modelId
  slug: text('slug').notNull(),
  date: text('date').notNull(),
  modelId: text('modelId').notNull(),
  tag: text('tag').notNull(),
  content: text('content').notNull(),
}, (table) => [
  uniqueIndex('prophecy_slug').on(table.slug),
  index('prophecy_date').on(table.date),
  index('prophecy_modelId').on(table.modelId),
  index('prophecy_tag').on(table.tag),
])
