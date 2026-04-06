import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';
import { users } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { signToken, requireAuth } from '../middleware/auth.js';
import type { JwtPayload } from '../middleware/auth.js';

export const authRouter = Router();

// Register
authRouter.post('/register', async (req, res) => {
  const { email, username, displayName, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'email, username, and password are required' });
  }

  try {
    const existing = db.select().from(users)
      .where(eq(users.email, email)).get();
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();
    const isFirstUser = db.select().from(users).all().length === 0;

    const [user] = db.insert(users).values({
      id: uuidv4(),
      email,
      username,
      displayName: displayName || username,
      passwordHash,
      role: isFirstUser ? 'admin' : 'member',
      registrationStatus: 'active',
      createdAt: now,
      updatedAt: now,
    }).returning().all();

    const payload: JwtPayload = {
      id: user.id, email: user.email, username: user.username,
      displayName: user.displayName, role: user.role,
    };
    const token = signToken(payload);
    res.status(201).json({ token, user: payload });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  try {
    const user = db.select().from(users).where(eq(users.email, email)).get();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.registrationStatus === 'suspended')
      return res.status(403).json({ error: 'Account suspended' });
    if (user.registrationStatus === 'waiting_approval')
      return res.status(403).json({ error: 'Account pending approval' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Update last seen
    db.update(users).set({ lastSeenAt: new Date().toISOString() }).where(eq(users.id, user.id)).run();

    const payload: JwtPayload = {
      id: user.id, email: user.email, username: user.username,
      displayName: user.displayName, role: user.role, avatarUrl: user.avatarUrl || undefined,
    };
    res.json({ token: signToken(payload), user: payload });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Me
authRouter.get('/me', requireAuth, (req, res) => {
  res.json((req as any).user);
});
