import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users.js';
import { channels } from './channels.js';

export const messageTypeEnum = ['message', 'connect', 'disconnect', 'me', 'system'] as const;

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  channelId: text('channel_id')
    .notNull()
    .references(() => channels.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  type: text('type', { enum: messageTypeEnum }).notNull().default('message'),
  content: text('content'),
  // For /me commands the content is the emote text
  createdAt: text('created_at').notNull(),
  editedAt: text('edited_at'),
  deletedAt: text('deleted_at'),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
