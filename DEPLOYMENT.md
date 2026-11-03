# PaceLab deployment runbook

## What visitors see

Cloudflare Pages serves the public interactive learning website at /. The full Learning Studio is served at /workspace.html. The public site includes a responsive landing experience, a live Newton's second-law model, an interactive concept map and a three-question knowledge check. These experiences run in the browser and do not require the API.

The Learning Studio needs a separate FastAPI backend for uploaded sources, evidence retrieval, practice generation, review history and progress persistence.

## Cloudflare Pages

| Setting | Value |
|---|---|
| Project name | pacelabs |
| Production branch | main |
| Root directory | web |
| Build command | Leave blank |
| Build output directory | . |

The Pages Function at web/functions/api/[[path]].js proxies same-origin /api/* requests. Set the Pages environment variable PACELAB_API_ORIGIN to the backend's HTTPS origin only, for example https://api.example.com. Do not include a path, /api, credentials or a trailing slash.

If the Pages project is not yet created, create a Pages project named pacelabs from repository DT-09/PaceLab, branch main. This yields pacelabs.pages.dev. Do not claim deployment until the production URL loads and is smoke-tested.

## FastAPI backend

Deploy the repository root with the included Dockerfile. Mount persistent storage at /var/data and configure:

    PACELAB_SESSION_ISOLATION=1
    PACELAB_DATA_DIR=/var/data
    PACELAB_COOKIE_SECURE=1
    PORT=8000

The service must use HTTPS. Keep session isolation enabled. The cookie is a pseudonymous workspace selector, not authentication. Apply host-level rate limits and request limits. Restrict direct backend access where supported.

## Release smoke tests

1. Open https://pacelabs.pages.dev/; confirm the public website and navigation load.
2. Move both sliders in the force laboratory; confirm acceleration and the model update.
3. Select several concept nodes; confirm the explanation and active node change.
4. Complete all three knowledge-check questions and restart the check.
5. Open /workspace.html; confirm the API connection indicator.
6. Open /api/health directly on the backend; confirm ok: true and service pacelab-api.
7. Open /api/state on the Pages domain; confirm JSON is returned.
8. Upload the sample Markdown file; confirm indexed passages and source locators.
9. Ask a question answered by the uploaded source; confirm the tutor cites the source and locator.
10. Ask an unrelated question; confirm the system reports insufficient evidence.
11. Generate practice, submit an answer and confirm feedback is recorded.
12. Complete a review item and confirm the review queue updates.
13. Test a separate browser profile; confirm it receives a separate workspace.
14. Restart the backend; confirm persistent volume data survives.
15. Run python -m pytest -q and python evaluate.py against the release commit.

Do not describe the hosted product as production-verified until the live smoke tests pass.