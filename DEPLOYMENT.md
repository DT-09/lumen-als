# STEMPROOF deployment runbook

## Deployment topology

- Cloudflare Pages serves the static multi-page website from `web/`.
- A separate FastAPI service runs the verification engine and audit API.
- The Pages Function at `web/functions/api/[[path]].js` forwards same-origin `/api/*` requests to the backend.

The static pages can be browsed without the API. The audit workspace requires a reachable API and an operator-issued access key.

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

Deploy the repository root with the included Dockerfile. Mount a private persistent volume at `/var/data`. Configure:

```text
STEMPROOF_DATA_DIR=/var/data
STEMPROOF_ENV=production
STEMPROOF_API_TOKEN=<random secret of at least 32 characters>
STEMPROOF_CORS_ORIGINS=https://<your-pages-domain>
PORT=8000
```

Generate the token with a password manager or a cryptographically secure random generator. Do not commit it, place it in frontend JavaScript, put it in a URL, or send it in email. The audit workspace has an access-key field; paste the token there. It is held in session storage for that browser tab and sent in the Authorization header. Rotate it by replacing the backend environment variable and restarting the service.

Production startup fails closed if the token is missing or shorter than 32 characters. API documentation routes are disabled in production. `GET /api/health` remains unauthenticated and reports whether authentication is required; it does not expose the token.

The backend must be reachable only over HTTPS. Restrict direct origin access where your hosting provider permits it. The Pages proxy does not replace origin authentication.

## Data and access boundary

This release uses one shared operator bearer token. It is not a multi-user account system: there are no individual identities, tenant isolation, per-user permissions, or customer-level access boundaries. Do not issue the shared key to customers or expose the authenticated audit workspace publicly. For demonstrations, use synthetic, public-domain or properly redacted content only.

Audit records are stored as JSON files. The API supports explicit deletion of an audit, but this is not a complete retention or backup-erasure policy. Configure private persistent storage, backups and retention procedures at the hosting layer. A production customer portal requires a database, tenant model, account authentication, authorization, audit logging and tested retention controls.

## Release checks

1. Confirm production backend startup fails when `STEMPROOF_API_TOKEN` is absent.
2. Confirm `/api/health` returns `authentication_required: true`.
3. Confirm an API request without a token returns HTTP 401.
4. Enter the operator key in `/audit.html` and run the built-in sample.
5. Confirm the sample produces verified, defect and needs-review outcomes.
6. Download PDF, CSV and JSON reports.
7. Record a reviewer decision and confirm it persists.
8. Delete the test audit and confirm it can no longer be retrieved.
9. Upload the included synthetic `sample_question_bank.json`.
10. Test mobile navigation, keyboard focus, and the Pages-to-backend proxy.
11. Run `python -m pytest -q` against the deployed commit.

## Remaining production work

Authentication here is a single shared operator key, not customer account security. Before confidential customer use, implement tenant isolation, individual user identities, role-based authorization, managed database storage, key rotation workflows, formal retention and backup deletion, rate limiting, monitoring, backups and an incident-response process. Do not claim production readiness solely because the site deploys.
