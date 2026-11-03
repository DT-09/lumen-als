# PaceLab — Learning in motion

PaceLab is an interactive learning experience with two connected surfaces:

- Public learning experience (web/index.html): an immersive product website with a live physics model, selectable concept network, and an interactive knowledge check.
- Learning Studio (web/workspace.html): the full workspace for learner-owned sources, concept exploration, evidence-linked tutoring, retrieval practice, review scheduling, progress and a constrained math studio.

The public experience works as a static site. The Learning Studio uses the separate FastAPI backend for source processing and saved workspace data.

## Run locally

1. Install Python 3.12 or 3.13.
2. Create an environment and install dependencies:

    python -m venv .venv
    pip install -r requirements.txt
    uvicorn app:app --reload --host 127.0.0.1 --port 8000

3. Open http://127.0.0.1:8000 for the Learning Studio. The public website is served by Cloudflare Pages from web/index.html.

On Windows, run_windows.bat performs setup and starts the local API and studio.

## Cloudflare Pages

Connect this repository to Cloudflare Pages:

| Setting | Value |
|---|---|
| Project name | pacelabs |
| Production branch | main |
| Root directory | web |
| Build command | Leave blank |
| Output directory | . |

The public website is the root route /. The complete Learning Studio is /workspace.html.

The Pages Function at web/functions/api/[[path]].js proxies same-origin /api/* requests to a separately hosted FastAPI service. Set Pages variable PACELAB_API_ORIGIN to the backend's HTTPS origin only (no path or trailing slash). The public landing experience does not depend on this variable; source ingestion, tutor, practice, review and workspace persistence do.

## Backend deployment

Deploy the included Dockerfile to a compatible container host with persistent writable storage. Configure:

    PACELAB_SESSION_ISOLATION=1
    PACELAB_DATA_DIR=/var/data
    PACELAB_COOKIE_SECURE=1
    PORT=8000

Mount a persistent volume at /var/data. The opaque HttpOnly cookie selects a per-browser SQLite workspace; it is not an account system and does not provide account recovery or cross-device sync. Keep HTTPS enabled, and apply host-level rate limits and request limits.

## Learning Studio capabilities

- PDF, PPTX, DOCX, TXT, MD, SRT and VTT ingestion
- Optional audio/video transcription with the optional faster-whisper package
- Source-grounded tutor with evidence locators and unsupported-question handling
- Retrieval practice with answer keys retained on the server until submission
- Spaced review queue
- Topic-level progress estimates and evaluation view
- Interactive constrained function plotter
- Browser-side command navigation

## Limits and responsible interpretation

The retrieval engine is deterministic and source-aware; it is not a general-purpose generative model. Topic extraction, quiz generation, short-answer grading and mastery estimates are heuristic baselines, not validated educational measurements. A single incorrect answer does not prove a misconception. Review intervals are a simple schedule, not a validated forgetting-curve model. The math studio is not a computer algebra system.

Uploaded files are sent to the configured API for processing. Upload only material you have permission to process. Hosted deployments need isolated sessions, persistent storage, HTTPS and appropriate access controls.

## Verification

    python -m pytest -q
    python evaluate.py

Run these checks against the exact release commit. Then manually verify the live Pages homepage, mobile navigation, interactive lab, concept selection, knowledge check, workspace API connection, uploads, citations, unsupported queries, answer submission, review scheduling and reset behavior.