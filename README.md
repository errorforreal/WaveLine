
- The browser never talks directly to the target server
- The backend manages all WebSocket connections
- The UI receives live updates via a dedicated WebSocket channel

This design avoids polling, keeps state consistent, and scales cleanly.

---

## Tech Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express
- WebSockets: `ws`
- Database: MongoDB (Mongoose)
- Authentication: Token-based (JWT-ready)

---

## Connection Flow

1. UI loads and opens a WebSocket to the backend (`/ui-ws`)
2. User clicks **Connect**
3. Backend opens a WebSocket to the target server
4. UI binds itself to the new connection
5. Messages flow in real time (no polling)
6. Disconnect cleanly tears down the connection

---

## Message Handling

- Outgoing messages are sent via HTTP
- Incoming messages are pushed to the UI via WebSocket
- Messages are persisted with:
  - direction (INCOMING / OUTGOING)
  - status (SENT / RECEIVED / FAILED)
  - timestamp

---

## Why WaveLine

Most WebSocket tools:
- mix UI logic with connection logic
- rely on polling
- lose messages during connect/disconnect
- are hard to reason about internally

WaveLine is built with:
- explicit connection state
- clear separation of concerns
- predictable lifecycle handling
- backend-controlled WebSocket routing

This makes it ideal for learning, debugging, and extending.

---

## Current Status

WaveLine is an MVP under active development.

Planned improvements:
- JSON viewer with expand/collapse
- Saved connections
- Multiple concurrent connections
- Protocol plugins (SSE, Socket.IO, MQTT)
- Authentication on UI WebSocket
- Reconnect & retry strategies

---
