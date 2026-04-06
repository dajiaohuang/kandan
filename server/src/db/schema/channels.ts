import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users.js';

export const channels = sqliteTable('channels', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdByUserId: text('created_by_user_id')
    .notNull()
    .references(() => users.id),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type Channel = typeof channels.$inferSelect;
export type NewChannel = typeof channels.$inferInsert;
