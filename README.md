# Lumen — Source-grounded adaptive learning

Lumen is a learning workspace that turns a learner's own course material into an evidence-linked study loop: map concepts, ask questions, practise retrieval, inspect feedback, and revisit earlier questions on a spaced schedule. The product is designed around a persistent learner workspace and explainable study decisions—not a generic chatbot or a collection of disconnected study tools.

## Current product scope and limitations

This release candidate includes a responsive cinematic knowledge universe, an accessible concept list, supported-material ingestion, source-grounded tutoring, server-held quiz answer keys, assessment feedback, a self-contained function plotter, progress estimates, and a system-evaluation view. The universe is rendered as an interactive projected spatial graph on Canvas rather than a WebGL scene; it supports rotation, zoom, concept selection, keyboard entry and a reduced-motion mode. The math lab plots a constrained set of expressions; it is not a computer algebra system and does not perform symbolic integration. The tutor currently retrieves and quotes indexed source passages; it is not a general-purpose generative LLM. Answered practice questions enter a simple spaced-review queue. Quiz generation and grading are heuristic, and mastery estimates are not validated educational measurements.

Lumen is under active product development. Do not treat the current heuristic learner model, question generation, grading, or review intervals as validated measures of learning. Product claims must match tested behavior.

## Run locally on Windows

1. Install Python 3.12 or 3.13 (recommended for dependency compatibility).
2. Open PowerShell in this project folder.
3. Run `run_windows.bat`, or execute:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8000
```

4. Open `http://127.0.0.1:8000`.

If the frontend says the engine is unavailable, confirm the API server is running and inspect the terminal error. The UI uses the same-origin `/api/*` endpoints.

## Deploy the frontend to Cloudflare Pages

The frontend is in `web/`; it can be deployed independently of the Python service.

1. Push the project to GitHub.
2. In Cloudflare Pages, connect the repository.
3. Set **Root directory** to `web`.
4. Use no build command and set the build output directory to `.` (the files are static and require no bundler).
5. Under **Settings → Variables and Secrets**, set `LUMEN_API_ORIGIN` to the HTTPS origin of the separately deployed FastAPI backend, for example `https://your-backend.example.com` with no trailing slash. Do not put a private key in frontend JavaScript.
6. Redeploy Pages and test `/api/state` on the Pages domain. If the variable is absent, the proxy returns an explicit 503 rather than pretending the backend is connected.

The Pages Function at `web/functions/api/[[path]].js` proxies same-origin `/api/*` requests to the configured backend. The backend origin must be reachable over HTTPS. Do not point it to the Pages domain itself, or a proxy loop will occur.

## Deploy the Python backend

Cloudflare Pages serves the frontend and its JavaScript proxy; it does not automatically run this Python/FastAPI app with its native Python parsing dependencies. Deploy the included Dockerized FastAPI backend to a compatible container host with a persistent writable volume.

Set these environment variables on the backend:

```text
LUMEN_SESSION_ISOLATION=1
LUMEN_DATA_DIR=/var/data
LUMEN_COOKIE_SECURE=1
```

Mount a persistent volume at `/var/data`. Use HTTPS, restrict access to the backend if the host permits it, and apply platform-level rate limits and request-size limits. Session isolation uses an opaque, HttpOnly, SameSite=Lax browser cookie to select a per-browser SQLite workspace; it is not a login system and has no account recovery or cross-device sync. Clearing the cookie disconnects the browser from its existing workspace. Do not expose a deployment with `LUMEN_SESSION_ISOLATION=0` to the public internet.

After deploying the backend, verify its `/api/state` endpoint directly, then configure `LUMEN_API_ORIGIN` on Pages. Verify that cookies are scoped to the Pages domain through the proxy and that different browser profiles receive isolated workspaces. A persistent disk is mandatory for hosted SQLite data.

## Supported source formats

- PDF: page-level text extraction; optional image OCR if Tesseract and its Python wrapper are available.
- PPTX: slide text and tables, with slide locators.
- DOCX: paragraphs and tables.
- TXT / MD: text lines.
- SRT / VTT: transcript segments with timestamp locators.
- Audio/video transcription is optional and requires `faster-whisper` and its model weights. A supplied transcript is the lower-friction alternative.

Only successfully extracted and indexed text can ground course answers. Image-only documents may require OCR; the application reports failures rather than silently treating files as usable.

## Architecture

- `app.py`: FastAPI routes, source parsers, optional browser-workspace isolation and serving for local use.
- `engine.py`: SQLite persistence, source-aware chunking, BM25 retrieval with query-term coverage, evidence-first answers, quiz generation, server-held answer keys, grading and mastery updates.
- `web/index.html`: responsive application, interactive spatial concept graph, learning workspace, source library, function plotter, practice, progress and evaluation UI.
- `web/functions/api/[[path]].js`: Cloudflare Pages API proxy. Configure `LUMEN_API_ORIGIN` in Pages.
- `evaluate.py`: curated retrieval/refusal evaluation; run it to regenerate `evaluation_results.json` for the current code.
- `tests/`: API and engine regression tests.
- `DEMO_SCRIPT.md`: suggested timed demo and recording checklist.
- `DEVPOST_DRAFT.md`: submission copy and limitations/disclosure language.

## Verify a development build

Run from the project root:

```powershell
python -m pytest -q
python evaluate.py
```

Then start the app and manually verify: source upload and page/slide citations; supported and unsupported tutor questions; practice generation and answer submission; progress updates; concept selection; math graph plotting; mobile layout; keyboard focus; and reset behavior. For hosted deployment, test the Pages domain and backend separately, including a second browser profile and a backend restart to confirm persistence. Do not report previous evaluation results as current until the commands have been rerun on this exact release candidate.

## Honest interpretation of the learner model

Topic labels are heuristic. Mastery uses a simple Beta(2,2)-style prior updated by correct/incorrect answers and displays an approximate posterior interval. Short-answer grading uses keyword coverage; numerical grading checks a parsed value and a limited set of common unit spellings. These are transparent baselines, not validated BKT/IRT models, semantic grading or proof of retention/transfer. A single incorrect answer should not be described as a confirmed misconception.

## AI and tool disclosure

Built with Python, FastAPI, SQLite, PyMuPDF, python-pptx, python-docx and AI-assisted development. Disclose AI coding assistance in the hackathon submission as required by the event rules. The entrant should review, understand and be able to explain the submitted code.

## Spaced retrieval

After a learner answers a practice item, Lumen schedules it for another retrieval attempt. Correct responses advance through 1, 3, 7, 14 and 30-day intervals; an incorrect response returns after one day. The learner can open the Review Due action to answer items whose due time has arrived. This is a transparent baseline schedule, not a validated forgetting-curve model or proof of retention.

## Product development priorities

1. Replace heuristic topic extraction with source-grounded concept and prerequisite extraction that can be inspected and corrected.
2. Improve diagnosis through multiple item types and explicit skill dimensions; do not infer misconceptions from one response.
3. Replace keyword-only short-answer grading with rubric-based evidence matching and learner-visible criteria.
4. Build teach–practise–review–transfer sequences with source citations at each step.
5. Validate learning outcomes with consented learner studies and pre/post transfer tasks before making efficacy claims.
6. Add accounts, recovery, export and cross-device sync before positioning hosted workspaces as durable personal records.

## Deployment health check

The FastAPI service exposes `GET /api/health`. After deploying the backend, verify that it returns `ok: true` before connecting Cloudflare Pages. The frontend now displays an actionable connection banner for common deployment failures:

- **503** — `LUMEN_API_ORIGIN` is not configured in Pages.
- **502** — the configured backend cannot be reached.
- **404 / 405** — the origin or API routing is wrong, or the backend deployment is outdated.
- **508** — the Pages proxy points back to the Pages frontend and would loop.

Set `LUMEN_API_ORIGIN` to the HTTPS origin of the separate FastAPI service only (for example, `https://your-api.example.com`), without an `/api` path. Redeploy Pages after changing it.
