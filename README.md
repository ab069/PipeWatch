# PipeWatch — Pipeline Monitoring & Leak Detection

Oil & gas pipeline monitoring and leak detection platform with pressure/flow analysis, integrity scoring, and real-time alerts.

## Quick Start

```bash
docker compose up -d
```

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Features

- **Pressure Monitoring** — Real-time pressure drop detection with severity classification
- **Flow Analysis** — Flow rate anomaly detection against expected values
- **Leak Detection** — Automated leak identification using pressure/flow heuristics
- **Pump Station Tracking** — Monitor pump station discharge and suction pressures
- **Integrity Scoring** — 0–100 integrity score based on pressure stability, flow consistency, and age
- **Real-Time Alerts** — WebSocket-based live alert feed for critical events
- **Pipeline Management** — Full CRUD for pipelines with status tracking

## Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│ Backend  │────▶│ Postgres │
│ :80      │     │ :8000    │     │ :5432    │
└──────────┘     └──────────┘     └──────────┘
       │               │
       └──── WebSocket ┘
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/pipelines | List pipelines |
| POST | /api/pipelines | Create pipeline |
| GET | /api/pipelines/{id} | Get pipeline |
| DELETE | /api/pipelines/{id} | Delete pipeline |
| GET | /api/pipelines/stats | Pipeline statistics |
| GET | /api/alerts | List alerts |
| PATCH | /api/alerts/{id}/status | Update alert status |
| GET | /api/alerts/stats | Alert statistics |
| WS | /ws/{user_id} | WebSocket for real-time data |
| GET | /api/health | Health check |

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, asyncpg, WebSockets
- **Frontend**: React 18, TypeScript, Zustand, Recharts, Axios
- **Database**: PostgreSQL 16
- **Deployment**: Docker Compose (Nginx, Uvicorn)

## Project Structure

```
PipeWatch/
├── backend/
│   ├── app/
│   │   ├── core/        # Config, security, database
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   ├── agents/      # Leak detector AI agent
│   │   └── api/         # REST & WebSocket routes
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── store/       # Zustand stores
│   │   ├── hooks/       # Custom hooks
│   │   ├── components/  # Reusable components
│   │   └── pages/       # Page components
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | postgresql+asyncpg://pipewatch:pipewatch_secret@localhost:5432/pipewatch | Database connection |
| SECRET_KEY | pipewatch-secret-key-change-in-production | JWT secret |
| ALGORITHM | HS256 | JWT algorithm |
| ACCESS_TOKEN_EXPIRE_MINUTES | 1440 | Token expiry |

## License

MIT
