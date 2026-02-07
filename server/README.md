# Backend (Express)

Minimal Express backend for the Career & Education Advisor App.

## Setup

Open a terminal, then:

```bash
cd server
npm install
npm start
```

Server runs on `http://localhost:4000` by default.

## Endpoints

- `GET /api/health` - health check
- `GET /api/recommendations` - sample recommendations
- `POST /api/contact` - echo posted JSON

## Running with client

Open two terminals:

Terminal A (client):

```bash
# from project root
npm run dev:client
```

Terminal B (server):

```bash
cd server
npm start
```
