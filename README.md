# LUMEN ALS — Adaptive Learning System

LUMEN ALS is a source-grounded adaptive-learning prototype for the Multimodal AI Hackathon's Personalized Tutoring & Adaptive Learning track. It connects indexed course evidence, tutoring, source-derived practice, a transparent topic-level estimate, and an interactive concept universe.

## Release scope and limitations

This release candidate includes a responsive cinematic knowledge universe, an accessible concept list, supported-material ingestion, source-grounded tutoring, server-held quiz answer keys, assessment feedback, a self-contained function plotter, progress estimates, and a system-evaluation view. The universe is rendered as an interactive projected spatial graph on Canvas rather than a WebGL scene; it supports rotation, zoom, concept selection, keyboard entry and a reduced-motion mode. The math lab plots a constrained set of expressions; it is not a computer algebra system and does not perform symbolic integration. The tutor retrieves and quotes indexed source passages; it is not a general-purpose generative LLM. Quiz generation and grading are heuristic, and mastery estimates are not validated educational measurements.

The package cannot guarantee a hackathon win. All benchmark results must be generated from the exact release candidate and reported with their test-set size and limitations.

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

## Verify before submission

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
