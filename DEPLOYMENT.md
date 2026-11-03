# PaceLab deployment runbook

## Architecture

- Cloudflare Pages serves the static application from `web/`.
- The Pages Function at `web/functions/api/[[path]].js` proxies same-origin `/api/*` requests.
- FastAPI runs as a separate container service.
- SQLite workspaces are stored on a persistent writable volume.

Pages does not run Python, parse documents or host the SQLite database.

## Cloudflare Pages

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | `web` |
| Build command | Leave blank |
| Build output directory | `.` |
| Environment variable | `PACELAB_API_ORIGIN` |

Set `PACELAB_API_ORIGIN` to the backend's HTTPS origin only, for example `https://api.example.com`. Do not include a path, `/api`, or trailing slash.

## FastAPI backend

Deploy the repository root with the included Dockerfile. Mount persistent storage at `/var/data` and configure:

```text
PACELAB_SESSION_ISOLATION=1
PACELAB_DATA_DIR=/var/data
PACELAB_COOKIE_SECURE=1
PORT=8000
```

The service must use HTTPS. Do not disable session isolation on a public deployment. The cookie is a pseudonymous workspace selector, not authentication. Apply host-level rate limits, request limits and monitoring. Restrict direct backend access if your host supports it.

## Release smoke tests

1. Open the backend's `/api/health`; confirm `ok: true` and service `pacelab-api`.
2. Open the Pages domain; confirm the workspace reports a connected API.
3. Open `/api/state` on the Pages domain; confirm JSON is returned.
4. Upload `sample_materials/newtons_laws_sample.md`; confirm indexed passages and source locators.
5. Ask a question answered by the uploaded source; confirm the tutor cites the source and locator.
6. Ask an unrelated question; confirm the system reports insufficient evidence.
7. Generate practice, submit an answer and confirm feedback is recorded.
8. Complete a review item and confirm the review queue updates.
9. Check concept selection, math plotting, reset confirmation, keyboard focus, reduced motion and mobile navigation.
10. Open a separate browser profile; confirm it receives a separate workspace.
11. Restart the backend; confirm the persistent volume retains workspace data.
12. Run `python -m pytest -q` and `python evaluate.py` against the exact release commit.

Do not describe the hosted product as verified until the live smoke tests pass.
