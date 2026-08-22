# TypeScript → JSX Migration Notes

This project was converted from TypeScript/TSX to plain JavaScript/JSX.

## What changed

- All `.ts` / `.tsx` files under `src/` were converted to `.js` / `.jsx`.
  Conversion was done with an AST-based tool (Babel parser + recast) that
  strips TypeScript-only syntax (interfaces, type aliases, generics,
  type-only imports/exports, `as`/`satisfies`/non-null assertions) while
  preserving formatting, comments, and JSX exactly as written.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.paths.json`
  were removed — no longer needed.
- `vite.config.ts` → `vite.config.js`, `tailwind.config.ts` → `tailwind.config.js`.
- `components.json` updated (`"tsx": false`) so future shadcn/ui components
  get added as `.jsx`.
- `package.json`: removed `typescript`, `typescript-eslint`, `@types/*`
  dev dependencies; renamed the package.
- `eslint.config.js` rewritten for plain JS + JSX (added `eslint-plugin-react`
  so `no-unused-vars` correctly recognizes JSX usage).
- `index.html` now points to `/src/main.jsx`.

## Verified

- `npm install && npx vite build` completes cleanly (2,938 modules, no errors).
- `npx eslint src` — 0 errors (a handful of pre-existing, harmless
  `react-refresh/only-export-components` warnings from shadcn/ui files
  that mix component + constant exports, which is normal for that library).
- All backend files (`backend/src/**/*.js`) pass `node --check` — the
  backend was already plain JS and required no conversion.

## Live data wiring

- `Schemes.jsx` and `Scholarships.jsx` now fetch real data from the backend
  API (`/api/schemes`, `/api/scholarships`) via React Query hooks
  (`useSchemes`, `useScholarships`), and gracefully fall back to the
  static sample data in `src/data/` (with an on-page notice) if the API
  is unreachable — e.g. during local frontend-only development.
- The scholarship seed data (`backend/src/seed/data/scholarships.json`)
  was expanded from 3 to 14 real, currently-active Indian scholarship
  programs (INSPIRE, NSP Post/Pre-Matric, CSSS, NMMS, PM YASASVI, AICTE
  GATE Scholarship, Begum Hazrat Mahal, Reliance Foundation, Tata Trusts,
  HDFC Parivartan ECSS, L'Oréal India For Young Women in Science,
  K.C. Mahindra, Sitaram Jindal Foundation), with corrected amounts,
  eligibility and official links. The outdated KVPY entry was removed/
  corrected — KVPY was discontinued in 2022 and merged into INSPIRE.
- To load this into MongoDB: `cd backend && npm install && npm run seed`
  (check `backend/package.json` for the exact seed script name).

## Running it

```bash
# Frontend
npm install
npm run dev        # http://localhost:8080
npm run build      # production build to dist/

# Backend
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT secrets, etc.
npm run dev            # or: node server.js
```

Set `VITE_API_BASE_URL` in a frontend `.env` (e.g. `http://localhost:5000/api`)
so the live-data pages connect to your backend instead of falling back to
sample data.

---

## Round 2: Production hardening + cleanup

### Removed
- `src/pages/Index.jsx` — dead Vite/OnSpace scaffold placeholder page
  ("Welcome to Your Blank App"), never routed, zero value.
- `src/pages/Dashboard.jsx` — orphaned/superseded page, not referenced by
  any route, nav link, or other component. Its functionality (saved
  schemes, personalized recs) is already covered by `/passport`
  (StudentPassport) plus the Schemes/Scholarships pages.
- 36 unused npm packages from the frontend `package.json` (verified with
  `depcheck` + manual grep confirmation, zero false-positive removals):
  `@google/generative-ai`, `@hookform/resolvers`, 8 unused `@radix-ui/*`
  packages, `@react-three/*` (three.js stack), `@reduxjs/toolkit` +
  `react-redux`, `@stripe/*`, `@supabase/supabase-js`,
  `@tanstack/react-query-devtools`, `chart.js`, `crypto-js`, `hls.js`,
  `jspdf`, `leaflet` + `react-leaflet`, `qrcode`, `react-calendar`,
  `react-dropzone`, `react-helmet-async`, `react-hook-form`, `three`,
  `uuid`, `web-vitals`, `xlsx`, `zod`, `zustand`, and the unused
  `@tailwindcss/typography` dev dependency. These were leftovers from an
  app template/scaffold and were never imported anywhere in `src/`.
  (`postcss`/`autoprefixer` were flagged too but are false positives —
  used by `postcss.config.js` — and were kept.)
- Scaffold `README.md` (referenced the old "OnSpace" platform) replaced
  with a real project README.

### Fixed / wired in (not deleted — these were real, complete features
that were simply never connected)
- `src/pages/Jobs.jsx` and `src/pages/News.jsx` were fully built, backed
  by real data files (`src/data/jobs.js`, `src/data/news.js`), but had no
  route and no nav link. Added `/jobs` and `/news` routes in `App.jsx` and
  nav entries in `Navbar.jsx`.

### Added
- **Route-level code splitting**: all 22 page components are now
  `React.lazy()`-loaded behind a `<Suspense>` boundary in `App.jsx`,
  instead of one eagerly-bundled ~1.1MB chunk. Combined with
  `manualChunks` in `vite.config.js` (splitting `vendor-react`,
  `vendor-motion`, `vendor-charts`, `vendor-query`), the main entry chunk
  dropped to ~165KB (gzip ~50KB), with each page/vendor lib as its own
  cacheable, on-demand chunk.
- **`ErrorBoundary`** (`src/components/features/ErrorBoundary.jsx`) now
  wraps the router — a crash in one page no longer white-screens the
  whole app; shows a recovery UI instead.
- **Backend ESLint config** (`backend/eslint.config.cjs`) — the backend
  had *no* lint config at all; running `eslint` on it previously produced
  314 `no-undef` errors (`require`/`module` not recognized as Node
  globals). Added a proper Node/CommonJS flat config; backend now lints
  clean (0 errors, 5 trivial warnings).
- **`SMTP_*` variables** added to `backend/.env.example` — they were
  validated by `config/index.js` (`zod` schema) but missing from the
  example file, which would have confused anyone setting up `.env` from
  scratch for the email-based flows (password reset, notifications).

### Verified again after all changes
- `npm install && npx vite build` — clean, 2,944 modules, no errors.
- `npx eslint src` (frontend) — 0 errors, 6 pre-existing harmless warnings.
- `npx eslint src --ext .js` (backend) — 0 errors, 5 trivial warnings.
- `node --check` on every backend file — all pass.
- `npx depcheck` (both frontend and backend) — no remaining unused deps
  beyond verified false positives.

### Deliberately left alone
- Backend security middleware (helmet, CORS allowlist, rate limiting,
  mongo-sanitize, xss-clean, hpp, compression) — already solid, no
  changes needed.
- Backend config validation (`zod`-based, fails fast in production,
  dev-only fallback secrets) — already solid.
- Extending live-API wiring to Jobs/News/Learning/Documents/Citizen
  Services/Women Safety (currently static `src/data/*.js`) — not done in
  this pass; flag if you want these wired to the backend the same way
  Schemes/Scholarships were.

---

## Round 3: Dependency install fix (`npm install` was broken on a fresh clone)

Running `npm install` in `backend/` on a clean machine failed with an
`ERESOLVE` peer-dependency conflict: `multer-storage-cloudinary@4.0.0`
only supports `cloudinary@^1.x`, but the project depended on
`cloudinary@^2.5.1`.

Root cause: **`multer-storage-cloudinary` was never actually used** — it
was imported by `middleware/upload.js`, but that middleware wasn't wired
into any route or controller anywhere in the codebase (confirmed with a
full grep). A separate, unused `services/uploadService.js` already
existed with the *correct* modern approach (direct `cloudinary.uploader
.upload_stream`), also not wired in. This whole file-upload feature had
been scaffolded twice, inconsistently, and never connected.

**Fix:**
- Rewrote `middleware/upload.js` to use `multer.memoryStorage()` instead
  of the abandoned `CloudinaryStorage` adapter — pairs with
  `uploadService.uploadBuffer()` for the actual Cloudinary upload. Added
  a doc comment showing how to wire it into a route when needed (e.g. a
  profile-photo or document-upload endpoint).
- Removed `multer-storage-cloudinary` from `package.json` entirely.
- `npm install` now completes cleanly with no ERESOLVE error.

While fixing the install, also cleared what `npm install`/`npm audit`
flagged:
- **`nodemailer` `^6.9.16` → `^9.0.5`** — the old version had 8 known
  advisories (SMTP command injection, SSRF, TLS validation issues, etc.);
  verified the `createTransport(...)` API used in `emailService.js` is
  unchanged across the bump.
- **`node-cron` `^3.0.3` → `^4.6.0`** — fixes a moderate `uuid` advisory
  pulled in transitively, and v4 is a zero-dependency rewrite; verified
  `cron.schedule(pattern, fn, { timezone })` / `.stop()` — the only API
  surface used in `cron/index.js` — still works identically. This raises
  the minimum Node version; `engines.node` bumped to `>=20.0.0`
  accordingly.
- **`multer` `^1.4.5-lts.2` → `^2.2.0`** — 1.x has multiple known CVEs
  patched in 2.x (npm flagged this as deprecated on install). Verified
  `.single()/.array()/.fields()` still resolve correctly after the bump.
- `npm audit`: **3 vulnerabilities (2 moderate, 1 high) → 0**.

Left `xss-clean` alone — it's unmaintained but still compatible with the
Express 4.x used here, and swapping core security middleware without
dedicated test coverage is a riskier trade than the current exposure
warrants. Worth revisiting if this backend is upgraded to Express 5.

**Verified again:** fresh `rm -rf node_modules package-lock.json && npm
install` completes cleanly, `npm audit` → 0 vulnerabilities, all backend
files pass `node --check`, `eslint` → 0 errors, and a runtime smoke test
(`require`-ing `app.js`, `cron`, and `emailService`) loads without error.
