# Kandan Core

Modern revival of [Kandan](https://github.com/kandanapp/kandan) — a self-hosted open-source team chat app. Built on Angular 21 + Express/Node/TypeScript with real-time messaging via Socket.io.

> **Status:** Early development. Backend scaffolded, Angular client coming next.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21 + TailwindCSS |
| Backend | Express 5 + TypeScript |
| Database | SQLite via Drizzle ORM |
| Real-time | Socket.io |
| Auth | JWT + bcrypt |

## Features (planned)

- Real-time messaging via WebSockets
- Multiple channels
- User authentication (register/login/JWT)
- Admin controls (user approval, suspension, channel management)
- File attachments
- `/me` emote commands
- Typing indicators
- Message history with pagination
- Dark/light mode

## Getting Started

```bash
git clone git@github.com:DamageLabs/kandan-core.git
cd kandan-core

# Server
cd server
cp ../.env.example .env   # edit as needed
npm install
npm run dev               # http://localhost:3200
```

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Register new user |
| `/api/v1/auth/login` | POST | Login, returns JWT |
| `/api/v1/auth/me` | GET | Current user |
| `/api/v1/channels` | GET | List channels |
| `/api/v1/channels/:id` | GET | Channel + recent messages |
| `/api/v1/channels` | POST | Create channel (admin) |
| `/api/v1/messages/channel/:id` | GET | Paginated message history |
| `/api/v1/users` | GET | List users (admin) |

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `channel:join` | client → server | Join a channel room |
| `channel:leave` | client → server | Leave a channel room |
| `message:send` | client → server | Send a message |
| `message:new` | server → client | New message broadcast |
| `typing:start` | client → server | User started typing |
| `typing:stop` | client → server | User stopped typing |
| `user:connected` | server → client | User joined channel |
| `user:disconnected` | server → client | User left channel |

## License

MIT
