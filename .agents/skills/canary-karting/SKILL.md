---
name: canary-karting
description: Use for any task related to the Canary Karting project — frontend (React/Vite), backend (Express/TypeScript/SQLite), Telegram bot, OneSignal, or deployment. Covers architecture, commands, data flow, and gotchas.
---

# Canary Karting

React 19 SPA (Vite 7, HashRouter, JS/JSX) + Express 4 backend (TypeScript, better-sqlite3).

## Quick commands

### Frontend
```bash
npm run dev          # Vite dev server (--host for LAN)
npm run build        # production build
npm run lint         # ESLint (JS/JSX flat config)
npm run deploy:main  # gh-pages to rikihanks/canary-karting
npm run deploy:app   # gh-pages to canarykarting/canary-karting-app
```

### Backend (`backend/`)
```bash
npm run dev      # tsx watch (hot reload)
npm run build    # tsc to dist/
npm run start    # node dist/index.js (production)
```

Backend requires `ENABLE_V3=true` in `.env`. No auth on write endpoints.

## Architecture

| Layer | Tech | Location |
|---|---|---|
| Frontend | React 19, Vite 7, JS (no TS) | `src/pages/`, `src/components/` |
| Backend | Express 4, TypeScript, better-sqlite3 | `backend/src/` |
| Data pipeline | V3 backend only (SQLite) | `backend/src/routes/` + `backend/src/db.ts` |
| Config / Login / News | Google Sheets + Apps Script | `src/services/data.js` (Sheets fetchers) |
| Auth pilot | Email+code via Apps Script | `AuthContext` |
| Auth admin | Firebase Google OAuth + `admins.json` whitelist | `AdminGuard` |
| PWA | Service worker `public/sw.js`, OneSignal, FCM | `public/` |
| Deployment | `scripts/deploy.js` — patches base path, builds, gh-pages | — |
| Telegram bot | `telegraf`, inline keyboards, callback queries | `backend/src/services/telegram.ts` |
| Cron | `setInterval` each 60min — checks calendar for ≤7d races | `backend/src/cron/raceCheck.ts` |

## Backend structure (`backend/src/`)

| File | Purpose |
|---|---|
| `index.ts` | Entry point, starts Express on port 3001 |
| `app.ts` | App setup, middleware, DB init, Telegram bot, cron start |
| `config.ts` | Typed env vars |
| `db.ts` | SQLite init + migrations |
| `types.ts` | Shared TypeScript interfaces |
| `routes/data.ts` | `GET /api/v3/data` (all pilots, results, teams, calendar) |
| `routes/results.ts` | `POST /api/v3/results` (add/update/delete) |
| `routes/manage.ts` | `POST /api/v3/manage/:table` (generic CRUD) |
| `routes/schema.ts` | `GET/POST` schema management |
| `services/telegram.ts` | Telegram bot: race activation, inline keyboards, callbacks |
| `services/onesignal.ts` | OneSignal push notifications |
| `cron/raceCheck.ts` | Every 60min: upcoming races → Telegram prompts → activate/notify |

## Key conventions

- CSS is inline `<style>` in JSX files — do NOT extract to `.css` files
- All routes lazy-loaded via `React.lazy()` + `Suspense`
- Feature flags from Google Sheets CSV (ConfigContext, refreshes every 60s)
- `USE_V3` in `backendService.js` gates V3 API (`true` for localhost/rikihanks/canarykarting)
- Point system: P1=25, P2=18, P3=15, P4=12, P5=10, P6=8, P7=6, P8=4, P9=2, P10=1, pole=+1, fastest lap=+1
- localStorage keys: `sorteo_auto_save`, `sorteo_saves`, `ck_votes`, `ck_reveals`, `user`, `leaderboard_cache`, `dotd_results_cache`, `races_calendar_cache`
- No tests exist in the project
- `admins.json` fetched from GitHub raw (not local)
- Dynamic `import()` used to avoid circular deps (e.g., `data.js` ↔ `backendService.js`)

## Telegram bot flow

1. Cron runs every 60min → checks `calendar` for races with `activa='0'` and `terminada!='1'` within next 7 days
2. Sends Telegram message: "Activar? ✅ / ⏭"
3. If ✅ → sets `activa='1'`, then asks "Notificar pilotos? 📢 / 🔇"
4. If 📢 → sends OneSignal push to `'All'` segment (or test player ID if `ONESIGNAL_TEST_PLAYER_ID` set)
5. Race already prompted skipped via `race_notifications` table

## .env variables

```
PORT=3001
ENABLE_V3=true
ONESIGNAL_APP_ID=
ONESIGNAL_API_KEY=
ONESIGNAL_TEST_PLAYER_ID=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```
