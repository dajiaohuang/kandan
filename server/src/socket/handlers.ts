import type { Server, Socket } from 'socket.io';
import { verifyToken } from '../middleware/auth.js';
import { db } from '../db/index.js';
import { messages, channels } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export function registerSocketHandlers(io: Server) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const user = verifyToken(token);
      (socket as any).user = user;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`[socket] ${user.username} connected`);

    // Join a channel room
    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel:${channelId}`);
      socket.to(`channel:${channelId}`).emit('user:connected', {
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
      });
    });

    // Leave a channel room
    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
      socket.to(`channel:${channelId}`).emit('user:disconnected', {
        userId: user.id,
        username: user.username,
      });
    });

    // Send a message
    socket.on('message:send', async (data: { channelId: string; content: string; type?: string }) => {
      try {
        const { channelId, content, type = 'message' } = data;
        const id = uuidv4();
        const now = new Date().toISOString();

        const [msg] = db.insert(messages).values({
          id,
          channelId,
          userId: user.id,
          type: type as any,
          content,
          createdAt: now,
        }).returning().all();

        io.to(`channel:${channelId}`).emit('message:new', {
          ...msg,
          user: { id: user.id, username: user.username, displayName: user.displayName, avatarUrl: user.avatarUrl },
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing:start', (channelId: string) => {
      socket.to(`channel:${channelId}`).emit('typing:start', {
        userId: user.id, username: user.username,
      });
    });
    socket.on('typing:stop', (channelId: string) => {
      socket.to(`channel:${channelId}`).emit('typing:stop', { userId: user.id });
    });

    socket.on('disconnect', () => {
      console.log(`[socket] ${user.username} disconnected`);
    });
  });
}
