# StudentSathi

A guidance platform for Indian students, focused on four things:

- **Government document help** — step-by-step guides for Aadhaar, PAN,
  Passport, Ration Card, Income Certificate and more.
- **Government scheme help** — browse, filter and understand central & state
  schemes, with official apply links.
- **Scholarship help** — government, private and international scholarships
  with eligibility, amounts and deadlines.
- **Women's safety help** — helplines, complaint portals, safety apps and
  key rights.

## Stack

- **Frontend:** React (JSX) + Vite, Tailwind CSS, shadcn/ui, React Router,
  TanStack Query, Framer Motion
- **Backend:** Node.js + Express, MongoDB (Mongoose), JWT-gated admin write
  endpoints for schemes, Zod-validated config

## Project structure

```
.
├── src/               # Frontend (React + Vite)
│   ├── pages/          # Documents, DocumentGuide, Schemes, Scholarships, WomenSafety, Landing
│   ├── components/      # Reusable UI + feature components
│   ├── hooks/            # React Query hooks (schemes/scholarships), saved-schemes
│   ├── data/               # Static fallback data (used if API is unreachable)
│   └── lib/                  # Axios client, utils
└── backend/            # Backend (Express + MongoDB)
    └── src/
        ├── routes/       # documents, schemes, scholarships
        ├── controllers/    # Route handlers
        ├── models/           # DocumentGuide, Scheme, Scholarship, User
        ├── middleware/         # Auth (for admin scheme writes), rate limiting, error handling
        └── seed/                # Seed data for documents/schemes/scholarships
```

## Getting started

### Frontend

```bash
npm install
cp .env.example .env      # set VITE_API_BASE_URL to your backend URL
npm run dev                # http://localhost:8080
npm run build               # production build → dist/
npm run lint
```

### Backend

```bash
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI, JWT secrets, etc.
npm run dev                 # or: node server.js
npm run seed                 # loads document/scheme/scholarship data into MongoDB
```

The frontend gracefully falls back to sample data in `src/data/` (with an
on-page notice) if the backend API is unreachable, so it can also be run
standalone for UI development. Documents and Women Safety are fully static
(no backend calls); Schemes and Scholarships hit `/api/schemes` and
`/api/scholarships`.

## Notes

This build has been trimmed down from the original StudentSathi platform to
just the four features above — jobs, news, learning resources, citizen
services, skills, academic tools, emergency contacts, AI assistant,
certificates, download center, student passport/bookmarks-with-login, and
the admin dashboard UI have all been removed. See `MIGRATION_NOTES.md` for
earlier history (TypeScript → JSX conversion, production hardening) that
predates this trim.
