WaveLine is a real-time WebSocket proxy and lifecycle observability tool.
It allows users to initiate WebSocket connections to external servers, monitor message flow, and track connection state transitions with persistent history.

## What It Does :

WaveLine allows a user to:

- Connect to any WebSocket endpoint

- View real-time incoming and outgoing messages

- Track connection lifecycle states (REQUESTED → CONNECTING → CONNECTED → DISCONNECTED / FAILED)

- Persist connection history in MongoDB

- Revisit past connections and inspect message logs

- It acts as a WebSocket control plane + monitoring layer.


## Architecture Overview

WaveLine uses a layered architecture separating:

### UI WebSocket Channel

- Maintains persistent UI ↔ backend communication

- Streams live events and messages to frontend

### Target WebSocket Client

- Connects to user-specified external WebSocket endpoints

- Handles message forwarding and lifecycle events

### Connection Lifecycle Engine

- Tracks state transitions

- Stores event history in database

- Maintains in-memory socket references

### Persistence Layer

MongoDB (Atlas)

Stores:

- Connections

- Lifecycle events


## Connection Lifecycle Model

Each connection request is stored with structured lifecycle events:

REQUESTED 
CONNECTING
CONNECTED
DISCONNECTED / FAILED

Each state transition is persisted with:

- Timestamp

- Metadata (error reason, close initiator, etc.)

This allows:

- Historical auditing

- Post-mortem debugging

- Replayable connection logs


## Use Cases

- Testing third-party WebSocket APIs

- Monitoring real-time message streams

- Debugging WS-based integrations

- Educational exploration of WS lifecycle handling

## Limitations

- In-memory session maps (not horizontally scalable)

- No distributed state store (e.g., Redis)

- Single-instance deployment model




