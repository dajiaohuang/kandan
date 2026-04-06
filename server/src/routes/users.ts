import { Router } from 'express';
import { db } from '../db/index.js';
import { users } from '../db/schema/index.js';
import { eq, ne } from 'drizzle-orm';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const usersRouter = Router();
usersRouter.use(requireAuth);

// List all users (admin only)
usersRouter.get('/', requireAdmin, (_req, res) => {
  const all = db.select({
    id: users.id, email: users.email, username: users.username,
    displayName: users.displayName, role: users.role,
    registrationStatus: users.registrationStatus,
    avatarUrl: users.avatarUrl, createdAt: users.createdAt, lastSeenAt: users.lastSeenAt,
  }).from(users).all();
  res.json(all);
});

// Get user profile
usersRouter.get('/:id', (req, res) => {
  const user = db.select({
    id: users.id, username: users.username, displayName: users.displayName,
    avatarUrl: users.avatarUrl, createdAt: users.createdAt, lastSeenAt: users.lastSeenAt,
  }).from(users).where(eq(users.id, req.params.id as string)).get();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update registration status (admin only)
usersRouter.patch('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!['active', 'waiting_approval', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  db.update(users)
    .set({ registrationStatus: status, updatedAt: new Date().toISOString() })
    .where(eq(users.id, req.params.id as string))
    .run();
  res.json({ ok: true });
});
