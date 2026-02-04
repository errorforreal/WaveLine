WaveLine is a backend system that lets clients create, manage, and observe WebSocket connections without directly connecting to the target servers.
It acts as a control plane between the browser and external WebSocket services.

Instead of:

Browser ─────▶ Target WS


WaveLine enables:

Browser ─▶ WaveLine Backend ─▶ Target WebSocket


This allows full visibility, tracking, retries, history, and lifecycle management.


## Core Idea

WaveLine splits real-time communication into two layers:

Control Plane	Browser ↔ WaveLine (user commands, UI updates)

Data Plane	WaveLine ↔ Target WebSocket (actual external connection)

The browser never talks directly to external WebSocket servers.



##  MongoDB as the Control Plane State

Every WebSocket connection request is stored as a Connection Document.

It represents:

“User X asked to connect to Y — this is what happened.”

Example:

{
  "userId": "123",
  "targetUrl": "wss://stream.binance.com/ws",
  "status": "connecting",
  "createdAt": "2026-01-29",
}


This allows:

Live status updates

History tracking

Debugging

Retry logic

UI synchronization




## Connection Lifecycle

Each request flows through states:

REQUESTED → CONNECTING → CONNECTED → DISCONNECTED → (RETRY or FAILED)




## The backend:

Receives a connection request

Stores it in MongoDB

Attempts the WebSocket connection

Updates the document based on what happens

Pushes live updates to the UI via WS




## Engineering Decisions
1.  Backend as a WebSocket Broker

The backend manages two independent WebSocket channels:

UI ↔ Backend

Backend ↔ Target WS

This allows:

Multiple UI clients

One backend connection

Controlled fan-out

This is how:

Crypto dashboards

Trading terminals

Multiplayer servers
are built.

2.  MongoDB as a State Machine

Mongo is not just a database here — it acts as a distributed state machine for:

Connection status

Failures

Retries

History

This mirrors how real systems use:

Redis

DynamoDB

Postgres
as coordination layers.

3.  Separation of Concerns

The backend is split into:

controllers → request handling

models → Mongo schemas

modules/connection → WebSocket lifecycle logic

middleware → auth & guards

This prevents real-time logic from being mixed with HTTP logic.
