import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users.js';
import { channels } from './channels.js';
import { messages } from './messages.js';

export const attachments = sqliteTable('attachments', {
  id: text('id').primaryKey(),
  messageId: text('message_id').references(() => messages.id, { onDelete: 'cascade' }),
  channelId: text('channel_id')
    .notNull()
    .references(() => channels.id, { onDelete: 'cascade' }),
  uploadedByUserId: text('uploaded_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  url: text('url').notNull(),
  createdAt: text('created_at').notNull(),
});

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
