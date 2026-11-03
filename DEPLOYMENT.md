# STEMPROOF deployment runbook

## Deployment topology

- Cloudflare Pages serves the static multi-page website from `web/`.
- A separate FastAPI service runs the verification engine and audit API.
- The Pages Function at `web/functions/api/[[path]].js` forwards same-origin `/api/*` requests to the backend.

The static pages can be browsed without the API. The audit workspace requires a reachable API.

## Cloudflare Pages

| Setting | Value |
|---|---|
| Project name | `stemproof` |
| Repository | `DT-09/StemProof` |
| Production branch | `main` |
| Root directory | `web` |
| Build command | Leave blank |
| Output directory | `.` |

Set the Pages environment variable `STEMPROOF_API_ORIGIN` to the backend HTTPS origin only, for example `https://api.example.com`. Do not include a path, credentials or trailing slash. Redeploy after changing environment variables.

## FastAPI backend

Deploy the repository root with the included Dockerfile. Mount persistent storage at `/var/data`. Configure:

```
STEMPROOF_DATA_DIR=/var/data
PORT=8000
```

The Dockerfile sets the data directory. The service exposes `/api/health`; verify it before connecting Pages. Keep HTTPS enabled.

## Release checks

1. Open the Pages production URL and inspect all nine pages.
2. Open `/audit.html` and run the built-in sample.
3. Confirm the sample produces verified, defect and needs-review outcomes.
4. Download the PDF, CSV and JSON reports.
5. Record a reviewer decision and confirm it persists in the audit record.
6. Upload the included `sample_question_bank.json`.
7. Verify `/api/health` on the backend.
8. Run `python -m pytest -q` against the exact release commit.
9. Test mobile navigation and keyboard focus.

## Deployment boundary

The current backend stores audits as JSON files. It does not provide authentication, tenant isolation, billing, audit deletion, contractual retention controls or a secure customer upload portal. Use synthetic, public or properly redacted data for demonstrations. Do not accept confidential customer assessment banks until access controls, retention policy and secure transfer are implemented. Do not claim production readiness solely because the site deploys.
