# TinyMeet

TinyMeet is a simple peer-to-peer video calling application built with React, Express, Socket.IO, PeerJS, and WebRTC. It lets two users connect directly from their browsers for a video call without user accounts or a database.

## Live Demo

**Live link:** https://tinymeet.rijandhakal.com.np/

## Features

- Create a new meeting instantly
- Join an existing meeting with a room ID
- One-to-one peer-to-peer video calling
- Real-time signaling with Socket.IO
- WebRTC-based media streaming
- Toggle camera on and off during a call
- Mute and unmute microphone during a call
- End the call and leave the room
- Simple, responsive UI
- No user accounts required
- No database required

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- PeerJS
- WebRTC
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO

## Project Structure

- `frontend/` - React app and UI
- `backend/` - Socket.IO signaling server

## Getting Started

### Frontend

```bash
cd frontend
bun install
bun run dev
```

### Backend

```bash
cd backend
bun install
bun run src/index.ts
```
