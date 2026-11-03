# STEMPROOF

**Independent verification for mathematics and physics assessment content.**

STEMPROOF is an assessment-quality assurance application for test-preparation providers, assessment publishers and education teams. It independently checks supported question-bank items, records the calculation or rule used, and routes unsupported cases to human review.

## Product surfaces
- `web/index.html` — product overview
- `web/platform.html` — platform architecture
- `web/verification.html` — verification methods and boundaries
- `web/workflows.html` — editorial and dispute workflows
- `web/benchmark.html` — benchmark methodology and limitations
- `web/audit.html` — interactive audit workspace
- `web/docs.html` — input schema and API reference
- `web/pilot.html` — bounded commercial evaluation offer
- `web/contact.html` — evaluation request brief

## Run locally
Python 3.11+:
```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```
Open `http://127.0.0.1:8000`. FastAPI serves the multi-page site and API from one local origin. API documentation is at `/docs`.

## Supported item types
| Type | Check |
|---|---|
| `equation` | Solve a single-variable equation and compare the complete supplied answer set with the computed solution set |
| `expression` | Symbolic equivalence between a reference expression and supplied answer |
| `newton2` | Recalculate acceleration from net force and mass |
| `kinematics` | Recalculate final velocity or displacement for constant acceleration |
| `mcq` | Check internal consistency of answer-key fields only; not an independent proof of the option |

Unsupported or malformed items are marked `needs_review`, never silently passed. Multi-solution equations require `expected_answer` as an array containing the complete solution set.

## Example JSON
See `sample_question_bank.json`. Every item requires `id`, `subject`, `type`, `prompt` and `expected_answer`.

## API
- `GET /api/health`
- `POST /api/audits` — CSV/JSON multipart upload
- `POST /api/audits/preview` — JSON body `{"items":[...]}`
- `GET /api/audits/{id}`
- `POST /api/audits/{id}/reviews`
- `GET /api/audits/{id}/report.json`, `report.csv`, `report.pdf`

## Engineering boundaries
Expressions are parsed using a restricted AST grammar; arbitrary calls, attributes, imports and code execution are rejected. SymPy receives only expressions produced by that parser. A verified answer means the supplied answer matched a specific implemented check. It does not prove clarity, uniqueness, pedagogy, syllabus alignment or correctness outside the encoded model. Human approval is required before publishing changes.

## Tests
```bash
pip install pytest httpx
pytest -q
```
Tests are software checks for implemented rules, not psychometric validation or evidence of learning efficacy.

## Cloudflare deployment
Deploy `web/` as a Cloudflare Pages static site with root directory `web`, no build command and output directory `.`. The Pages Function at `web/functions/api/[[path]].js` proxies `/api/*` to the separately deployed FastAPI service. Set the Pages environment variable `STEMPROOF_API_ORIGIN` to the backend HTTPS origin (no trailing slash). Deploy the root Dockerfile to a container host with persistent volume mounted at `/var/data`; set `STEMPROOF_DATA_DIR=/var/data` and `PORT=8000`.

## Production readiness boundary
The current release is a working deterministic audit workflow for the supported item types. It does not include user authentication, tenant isolation, billing, retention controls, audit deletion, or production-grade customer data governance. Do not accept confidential customer question banks until these controls are implemented. PDF/DOCX ingestion, diagram interpretation, general proof checking and psychometric analysis are not implemented.
