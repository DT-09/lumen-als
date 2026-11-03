# PaceLab — Learning Intelligence

PaceLab is a source-grounded learning workspace. It turns a learner's own course material into an evidence-linked study loop: map candidate concepts, ask questions against indexed passages, practise retrieval, inspect feedback and revisit earlier questions on a spaced schedule.

## Run locally

1. Install Python 3.12 or 3.13.
2. Create an environment and install dependencies:

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

3. Open http://127.0.0.1:8000.

On Windows, `run_windows.bat` performs setup and starts the local app.

## Cloudflare Pages deployment

The frontend lives in `web/` and is static. Connect this repository to Cloudflare Pages, set the root directory to `web`, use no build command, and set the output directory to `.`.

The Pages Function at `web/functions/api/[[path]].js` proxies same-origin `/api/*` requests to a separately hosted FastAPI service. Set the Pages variable `PACELAB_API_ORIGIN` to the HTTPS origin of that backend (origin only; no path or trailing slash). The Python service is not run by Pages itself.

## Backend deployment

Deploy the included Dockerfile to a compatible container host with persistent writable storage. Configure:

```text
PACELAB_SESSION_ISOLATION=1
PACELAB_DATA_DIR=/var/data
PACELAB_COOKIE_SECURE=1
```

Mount a persistent volume at `/var/data`. The opaque HttpOnly cookie selects a per-browser SQLite workspace; it is not an account system and does not provide account recovery or cross-device sync. Keep HTTPS enabled. Do not expose a shared database workspace to the public internet.

Verify `GET /api/health` directly on the backend before configuring Pages. Then test `/api/state` on the Pages domain and confirm that separate browser profiles receive separate workspaces.

## Features

- Responsive learning workspace with concept map and source library
- PDF, PPTX, DOCX, TXT, MD, SRT and VTT ingestion
- Optional audio/video transcription with the optional `faster-whisper` package
- Source-grounded tutor with evidence locators and unsupported-question handling
- Retrieval practice with answer keys retained on the server until submission
- Spaced review queue
- Topic-level progress estimates and evaluation view
- Interactive constrained function plotter
- CSV-free local operation; no frontend build tool required

## Limits and responsible interpretation

The retrieval engine is deterministic and source-aware; it is not a general-purpose generative model. Topic extraction, quiz generation, short-answer grading and mastery estimates are heuristic baselines, not validated educational measurements. A single incorrect answer does not prove a misconception. Review intervals are a simple schedule, not a validated forgetting-curve model. The math studio is not a computer algebra system.

The browser sends selected files to the configured API for processing. Hosted deployments should use isolated sessions, persistent storage, HTTPS, upload limits and appropriate access controls. Only upload material you have permission to process.

## Verification

```bash
python -m pytest -q
python evaluate.py
```

Run these checks against the exact release candidate before describing its quality or efficacy. Also manually verify uploads, citations, unsupported queries, answer submission, review scheduling, reset behavior, keyboard focus and mobile layout.
