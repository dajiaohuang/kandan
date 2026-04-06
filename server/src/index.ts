import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/auth.js';
import { channelsRouter } from './routes/channels.js';
import { messagesRouter } from './routes/messages.js';
import { usersRouter } from './routes/users.js';
import { registerSocketHandlers } from './socket/handlers.js';

const app = express();
const httpServer = createServer(app);

// Socket.io
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:4300',
    credentials: true,
  },
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4300',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Attach io to requests
app.use((req: any, _res, next) => { req.io = io; next(); });

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/channels', channelsRouter);
app.use('/api/v1/messages', messagesRouter);
app.use('/api/v1/users', usersRouter);

// Health check
app.get('/health', (_req, res) => res.json({ ok: true, version: '0.1.0' }));

// Socket.io handlers
registerSocketHandlers(io);

const PORT = process.env.PORT || 3200;
httpServer.listen(PORT, () => {
  console.log(`Kandan Core API running on port ${PORT}`);
});

export { app, io };
