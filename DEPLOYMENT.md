# Deployment runbook

## Architecture

- Cloudflare Pages serves the static frontend from `web/`.
- A Pages Function proxies `/api/*` to the separately hosted FastAPI backend.
- The Python backend runs in a Docker-compatible environment with a persistent writable volume for per-browser SQLite workspaces.

Pages is not the Python backend host for this project. The Python parser stack (including PyMuPDF and python-pptx) and SQLite file persistence must be tested on the selected backend host.

## Cloudflare Pages settings

- Repository root directory: `web`
- Build command: none
- Build output directory: `.`
- Variable: `LUMEN_API_ORIGIN=https://<backend-origin>` (HTTPS origin only, no trailing slash)

The Pages Function is `web/functions/api/[[path]].js`. It returns a descriptive 503 when the variable is absent and a 502 if the upstream cannot be reached.

## Backend settings

Use the included `Dockerfile`. Configure:

```text
LUMEN_SESSION_ISOLATION=1
LUMEN_DATA_DIR=/var/data
LUMEN_COOKIE_SECURE=1
PORT=<provided by host, if applicable>
```

Attach a persistent writable volume at `/var/data`. Keep the service behind HTTPS. The workspace cookie is an opaque bearer identifier, not authentication. Do not expose the API without session isolation, persistent storage and platform-level abuse protections.

## Release smoke tests

1. `GET /api/state` on the backend returns JSON.
2. The deployed Pages site's `/api/state` reaches that backend through the proxy.
3. Upload the included Newton's laws sample PDF and confirm the page citation is present.
4. Ask a supported question and verify the displayed excerpt and source locator.
5. Ask an unrelated question and verify the backend reports insufficient evidence.
6. Generate a practice set, submit an answer and verify grading plus the progress estimate update.
7. Test the concept universe, concept list, function plotter, reduced motion, keyboard focus and mobile navigation.
8. Open a second browser profile and verify its workspace is isolated.
9. Restart the backend and verify data persists from the configured volume.
10. Run `python -m pytest -q` and `python evaluate.py` on the exact release candidate.

Do not describe deployment as complete until these checks have been performed against the live deployment. The ZIP does not contain your Cloudflare credentials or backend host credentials and cannot deploy itself.
