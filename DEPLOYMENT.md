# Cloudflare Pages deployment

Vesper's canonical frontend is the Vite + React + TypeScript application in `web/`.

## Production configuration

| Setting | Value |
|---|---|
| Git repository | `DT-09/Vesper` |
| Production branch | `main` |
| Root directory | `web` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | 20 or newer |

## Routes to verify

- `/` — The Roost, the new independent-discovery home.
- `/discover` — question, subject, and challenge entry.
- `/journeys` — active and synthesised inquiries.
- `/flight/:id` — inquiry workbench: frame, learn, investigate, research, derive.
- `/network` — concept records across inquiries.
- `/workspace` — preserved previous local workspace.

The `web/public/_redirects` file provides SPA route fallback.

## Local production check

```bash
cd web
npm ci
npm run typecheck
npm run build
npm run preview
```

A deployment is complete only after the Cloudflare production deployment reports **Success** and the live routes above load correctly. A GitHub commit alone is not deployment confirmation.
