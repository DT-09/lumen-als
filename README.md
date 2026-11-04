# STEMPROOF

**Independent verification for mathematics and physics assessment content.**

STEMPROOF is an assessment-quality assurance application for test-preparation providers, assessment publishers and education teams. It independently checks supported question-bank items, records the calculation or rule used, and routes unsupported cases to human review.

## Product surfaces
- `web/index.html` — product overview
- `web/platform.html` — platform
- `web/verification.html` — verification methods
- `web/workflows.html` — editorial workflows
- `web/benchmark.html` — benchmark methodology
- `web/audit.html` — interactive audit workspace
- `web/docs.html` — input schema and API reference
- `web/pilot.html` — bounded commercial pilot
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

Open `http://127.0.0.1:8000`. FastAPI serves the website and API from one local origin. Local API documentation is at `/docs`.

## Supported item types

| Type | Check |
|---|---|
| `equation` | Solve a single-variable equation and compare the complete supplied answer set |
| `expression` | Symbolic equivalence between a reference expression and supplied answer |
| `newton2` | Recalculate acceleration from net force and mass |
| `kinematics` | Recalculate final velocity or displacement for constant acceleration |
| `mcq` | Check answer-key field consistency only; not an independent solution of the options |

Unsupported or malformed items are marked `needs_review`, never silently passed. Multi-solution equations require `expected_answer` as an array containing the complete solution set.

## Example input

See `sample_question_bank.json`. Every item requires `id`, `subject`, `type`, `prompt` and `expected_answer`.

## API

- `GET /api/health`
- `POST /api/audits` — CSV/JSON multipart upload
- `POST /api/audits/preview` — JSON body `{"items":[...]}`
- `GET /api/audits/{id}`
- `POST /api/audits/{id}/reviews`
- `GET /api/audits/{id}/report.{pdf,csv,json}`
- `DELETE /api/audits/{id}` — removes the active audit JSON file

## Engineering boundaries

Expressions are parsed using a restricted AST grammar; arbitrary calls, attributes, imports and code execution are rejected. SymPy receives only expressions produced by that parser. A verified answer means the supplied answer matched a specific implemented check. It does not prove clarity, uniqueness, pedagogy, syllabus alignment or correctness outside the encoded model. Human approval is required before publishing changes.

## Tests

```bash
pip install pytest httpx
python -m pytest -q
```

Tests cover the implemented rules and API paths. They are not psychometric validation or evidence of learning efficacy.

## Cloudflare deployment

Deploy `web/` as a Cloudflare Pages static site with root directory `web`, no build command and output directory `.`. The Pages Function at `web/functions/api/[[path]].js` proxies `/api/*` to the separately deployed FastAPI service. Set Pages `STEMPROOF_API_ORIGIN` to the backend HTTPS origin. Deploy the root Dockerfile to a container host with a private persistent volume mounted at `/var/data`.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full production environment configuration.

## Security and production boundary

The Docker production configuration requires `STEMPROOF_ENV=production`, an explicit HTTPS `STEMPROOF_CORS_ORIGINS` list and a `STEMPROOF_API_TOKEN` containing at least 32 characters. The audit workspace stores the operator key in browser session storage for the current tab and sends it as a bearer token.

This is one shared operator key, not individual authentication or tenant isolation. JSON-file persistence is not a managed multi-tenant database, and deleting an active audit does not erase backups. Use synthetic, public-domain or properly redacted data only. Do not accept confidential customer banks until tenant-aware identity, authorization, managed storage, retention, monitoring and contractual controls are implemented.

PDF/DOCX ingestion, diagram interpretation, general proof checking, natural-language question parsing, psychometric analysis and syllabus mapping are not implemented.
