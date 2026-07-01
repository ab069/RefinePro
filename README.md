# RefinePro — Refinery Process Monitoring

Oil & gas refinery process monitoring platform with unit tracking, efficiency analysis, upset detection, and real-time alerts.

## Quick Start

```bash
docker compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Features

- **Unit Monitoring** — Track atmospheric distillation, vacuum distillation, catalytic crackers, hydrocrackers, reformers, alkylation units, cokers, and hydrotreaters
- **Temperature & Pressure Analysis** — Real-time analysis against normal operating ranges
- **Efficiency Tracking** — AI-driven efficiency calculation (0-100%)
- **Upset Detection** — Automatic detection of process upsets from temperature/pressure trends
- **Real-Time Alerts** — WebSocket-powered alerts for temp exceeded, pressure drop, yield decline, efficiency degradation

## Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │────▶│  API     │────▶│ Postgres │
│  React   │◀────│ FastAPI  │◀────│          │
│  Vite    │  WS │  JWT     │     │          │
└──────────┘     └──────────┘     └──────────┘
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/units | List units |
| POST | /api/units | Create unit |
| PUT | /api/units/{id} | Update unit |
| DELETE | /api/units/{id} | Delete unit |
| GET | /api/units/stats | Unit statistics |
| GET | /api/alerts | List alerts |
| PATCH | /api/alerts/{id}/status | Update alert status |
| GET | /api/alerts/stats | Alert statistics |
| WS | /ws/process/{unit_id} | Real-time process analysis |

## Stack

- **Backend:** Python 3.12, FastAPI, SQLAlchemy (async), PostgreSQL, JWT, WebSockets
- **Frontend:** React 18, TypeScript, Vite, Zustand, Axios
- **Infrastructure:** Docker, Docker Compose, Nginx

## License

MIT
