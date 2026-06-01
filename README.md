# Averlyn Vaccine Tracker

A static website tracking our daughter **Averlyn**'s (born 2025-12-03) vaccination progress against Taiwan's recommended schedule (公費 + 自費).

> Live: [tankfinal.github.io/averlyn-vaccine](https://tankfinal.github.io/averlyn-vaccine/)

## About

Started as a static HTML page on GitHub Pages, briefly grew a FastAPI + Supabase backend so it could be edited from any device, and is now back to a pure static site (2026-06). The 36 vaccine records — including which were already done and when — are baked into `src/data/` at build time. No backend, no login, no database calls from the browser.

### Features

- View all 36 vaccines in a timeline grouped by date
- Filter by: all / done / upcoming / overdue
- Stats bar showing completion progress and next vaccine countdown
- "Last updated" date in the header

## Architecture

```
+-----------+        +------------------+        +-------------------+
|  Browser  | -----> |   Vercel (CDN)   | -----> |   Static Assets   |
|  (React)  |        |   SPA Hosting    |        |   index.html/JS   |
+-----------+        +------------------+        +-------------------+
```

That's it. Everything below `dist/` is shipped as-is to a CDN.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 19 + TypeScript | UI |
| Build | Vite 8 | Bundler |
| Deploy | Vercel | Static hosting + CDN |

## Project Structure

```
src/
├── main.tsx
├── App.tsx
├── MainPage.tsx
├── components/
│   ├── Header.tsx        # Baby name + age + "last updated"
│   ├── StatsBar.tsx
│   ├── FilterBar.tsx
│   ├── Timeline.tsx
│   ├── VaccineCard.tsx
│   └── Footer.tsx
├── data/
│   ├── baby.ts           # Baked-in baby record
│   └── vaccines.ts       # Baked-in 36 vaccine records
├── styles/
│   └── index.css
├── types/
│   └── index.ts
└── utils/
    ├── date.ts
    └── vaccine.ts
```

## Local Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build
```

No `.env` needed.

## Updating the data

Open `src/data/vaccines.ts`, change `done` / `done_date` fields, update `LAST_UPDATED` in `src/components/Header.tsx`, commit, push — GitHub Pages redeploys.

## Deploy to GitHub Pages

Push to `main` → `.github/workflows/deploy.yml` runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages.

One-time setup (GitHub repo → Settings → Pages):
- **Source**: GitHub Actions
- URL will be: `https://tankfinal.github.io/averlyn-vaccine/`

`vite.config.ts` sets `base: "/averlyn-vaccine/"` so assets resolve under the sub-path.
