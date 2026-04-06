import { Router } from 'express';
import { db } from '../db/index.js';
import { messages, users } from '../db/schema/index.js';
import { eq, desc, lt, and } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';

export const messagesRouter = Router();
messagesRouter.use(requireAuth);

// Get paginated messages for a channel
messagesRouter.get('/channel/:channelId', (req, res) => {
  const { channelId } = req.params;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
  const before = req.query.before as string | undefined;

  const query = before
    ? db.select().from(messages)
        .where(and(eq(messages.channelId, channelId), lt(messages.createdAt, before)))
    : db.select().from(messages).where(eq(messages.channelId, channelId));

  const msgs = query.orderBy(desc(messages.createdAt)).limit(limit).all().reverse();
  res.json({ messages: msgs, hasMore: msgs.length === limit });
});

// Delete message (own message or admin)
messagesRouter.delete('/:id', (req, res) => {
  const user = (req as any).user;
  const msg = db.select().from(messages).where(eq(messages.id, req.params.id)).get();
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  if (msg.userId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Cannot delete another user\'s message' });
  }
  db.update(messages)
    .set({ deletedAt: new Date().toISOString(), content: null })
    .where(eq(messages.id, req.params.id))
    .run();
  res.status(204).send();
});
