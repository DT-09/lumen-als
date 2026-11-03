# STEMPROOF

**Independent verification for mathematics and physics assessment content.**

STEMPROOF is an assessment-quality assurance application for test-preparation providers, assessment publishers and education teams. It independently checks supported question-bank items, records the calculation or rule used, and routes unsupported cases to human review.

## Product surfaces
- `web/index.html` — product overview
- `web/platform.html` — platform architecture
- `web/verification.html` — verification methods and boundaries
- `web/workflows.html` — editorial and dispute workflows
- `web/benchmark.html` — benchmark methodology and results
- `web/audit.html` — interactive audit workspace
- `web/docs.html` — input schema and API documentation
- `web/contact.html` — evaluation request

## Run locally
Python 3.11+:
```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```
Open `http://127.0.0.1:8000/api/health`. Serve `web/` as a static site. For local split-origin testing, configure the browser's API base in `web/assets/config.js`; for Cloudflare Pages, set `STEMPROOF_API_ORIGIN` to the HTTPS origin of the FastAPI service.

## Supported item types
| Type | Check |
|---|---|
| `equation` | Solve a single-variable equation and compare the supplied answer with the solution set |
| `expression` | Symbolic equivalence between a reference expression and supplied answer |
| `newton2` | Recalculate acceleration from net force and mass |
| `kinematics` | Recalculate final velocity or displacement for constant acceleration |
| `mcq` | Check internal consistency of answer-key fields only; not an independent proof of the option |

Unsupported or malformed items are marked `needs_review`, never silently passed.

## Example JSON
```json
[{"id":"ALG-001","subject":"mathematics","type":"equation","prompt":"Solve 2x + 3 = 11.","expression":"2*x+3=11","variable":"x","expected_answer":"4"},{"id":"PHY-001","subject":"physics","type":"newton2","prompt":"A 3 kg object experiences 12 N net force. Find acceleration.","values":{"force":12,"mass":3},"expected_answer":"4"}]
```

## API
- `GET /api/health`
- `POST /api/audits` — CSV/JSON multipart upload
- `POST /api/audits/preview` — JSON body `{"items":[...]}`
- `GET /api/audits/{id}`
- `POST /api/audits/{id}/reviews`
- `GET /api/audits/{id}/report.json`, `report.csv`, `report.pdf`

## Engineering boundaries
Expressions are parsed using a restricted AST grammar; arbitrary calls, attributes, imports and code execution are rejected. SymPy receives only expressions produced by that parser. A verified answer means the supplied answer matched a specific implemented check. It does not prove clarity, uniqueness, pedagogy, syllabus alignment or correctness outside the encoded model. Human approval is required before publishing changes.

## Test
```bash
pip install pytest httpx
pytest -q
```
Tests are software checks for implemented rules, not psychometric validation or evidence of learning efficacy.

## Deployment
Deploy `web/` as a static site and FastAPI as a separate HTTPS service. Configure the Pages Function variable `STEMPROOF_API_ORIGIN`. This repository does not yet provide authentication, tenant isolation, billing, or production retention controls. Add these before accepting confidential customer question banks. PDF/DOCX ingestion, diagram interpretation, general proof checking and psychometric analysis are not claimed as implemented.
