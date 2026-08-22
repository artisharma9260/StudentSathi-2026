# StudentSathi — Backend API

**Node.js + Express + MongoDB** backend for StudentSathi, trimmed to three
domains: government document guides, government schemes, and scholarships.

## Features

- **Domain APIs**: Documents (static-lookup style), Schemes, Scholarships
- **Auth**: JWT bearer tokens gate the admin-only scheme write endpoints
  (`POST`/`PUT`/`DELETE /schemes`) — there's no login/register API surface
  in this build, so these are only usable with a manually issued token
- **Security**: Helmet, CORS whitelist, express-rate-limit, mongo-sanitize, xss-clean, hpp, bcrypt
- **Validation**: Zod schemas via a single `validate()` middleware
- **Observability**: Pino structured logs, morgan HTTP logs, `/health` probe
- **Docs**: Swagger UI at `/api/docs`
- **Ops**: Docker, docker-compose, Render `render.yaml`, seed script

## Quick start

```bash
cp .env.example .env
npm install
npm run seed        # optional — loads document/scheme/scholarship data + admin user
npm run dev
```

API base: `http://localhost:5000/api`
Docs:     `http://localhost:5000/api/docs`
Health:   `http://localhost:5000/health`

## Folder structure

```
backend/
├── server.js
└── src/
    ├── app.js
    ├── config/          # env, db, swagger
    ├── controllers/     # thin HTTP layer (documents, schemes, scholarships)
    ├── models/          # DocumentGuide, Scheme, Scholarship, User
    ├── routes/          # Express routers
    ├── middleware/      # auth (admin scheme writes), error, rate-limit
    ├── validators/      # Zod schemas (scheme create/update)
    ├── utils/           # ApiError, ApiResponse, asyncHandler, logger
    ├── seed/            # seed script + JSON fixtures
    └── docs/            # OpenAPI JSON
```

## Deploy

- **Render**: push repo — `render.yaml` is auto-detected.
- **Railway**: set env vars, use `npm start`.
- **Docker**: `docker compose up --build`.
