import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const registrationStatusEnum = ['active', 'waiting_approval', 'suspended'] as const;
export const roleEnum = ['admin', 'member'] as const;

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: roleEnum }).notNull().default('member'),
  registrationStatus: text('registration_status', { enum: registrationStatusEnum })
    .notNull()
    .default('active'),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  lastSeenAt: text('last_seen_at'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
