# Cloudflare Pages deployment

Vesper has **one canonical application**: the Vite + React + TypeScript app in `web/`.

## Required production configuration

| Setting | Value |
|---|---|
| Git repository | `DT-09/Vesper` |
| Production branch | `main` |
| Root directory | `web` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | 20 or newer |

Cloudflare Pages dashboard: **Workers & Pages → Vesper → Settings → Builds & deployments → Build configuration**.

After changing the root directory, save and create a new production deployment from the latest `main` commit. A GitHub commit alone does not prove that Cloudflare published it.

## Routes to verify

- `/` — public Vesper product site.
- `/workspace` — The Lair.
- `/workspace/knowledge` — Knowledge Network.
- `/workspace/investigations` — Investigation Chamber.

The `web/public/_redirects` file provides SPA route fallback. `web/public/_headers` applies security headers and avoids caching the HTML shell.

## Local production check

```bash
cd web
npm ci
npm run typecheck
npm run build
npm run preview
```

The deploy is complete only after the Cloudflare production deployment reports **Success** and the routes above load from the live domain.
