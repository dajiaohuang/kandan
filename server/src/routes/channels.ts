import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';
import { channels, messages } from '../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const channelsRouter = Router();
channelsRouter.use(requireAuth);

// List all channels
channelsRouter.get('/', (_req, res) => {
  const all = db.select().from(channels)
    .where(eq(channels.isArchived, false))
    .all();
  res.json(all);
});

// Get channel + recent messages
channelsRouter.get('/:id', (req, res) => {
  const channel = db.select().from(channels).where(eq(channels.id, req.params.id)).get();
  if (!channel) return res.status(404).json({ error: 'Channel not found' });
  const recent = db.select().from(messages)
    .where(eq(messages.channelId, req.params.id))
    .orderBy(desc(messages.createdAt))
    .limit(50)
    .all()
    .reverse();
  res.json({ ...channel, messages: recent });
});

// Create channel (admin only)
channelsRouter.post('/', requireAdmin, (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const now = new Date().toISOString();
  try {
    const [channel] = db.insert(channels).values({
      id: uuidv4(), name, description: description || null,
      createdByUserId: (req as any).user.id,
      isDefault: false, isArchived: false,
      createdAt: now, updatedAt: now,
    }).returning().all();
    res.status(201).json(channel);
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) return res.status(409).json({ error: 'Channel name taken' });
    res.status(500).json({ error: err.message });
  }
});

// Archive channel (admin only)
channelsRouter.delete('/:id', requireAdmin, (req, res) => {
  db.update(channels)
    .set({ isArchived: true, updatedAt: new Date().toISOString() })
    .where(eq(channels.id, req.params.id))
    .run();
  res.status(204).send();
});
