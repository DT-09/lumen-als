# Lumen — Product status

## Product purpose

Lumen turns a learner's own course materials into an evidence-linked study workflow: source ingestion, concept exploration, grounded questions, retrieval practice, spaced review, and transparent progress signals.

## Current implementation

- FastAPI backend with per-browser SQLite workspaces for hosted deployments.
- PDF, PPTX, DOCX, TXT, Markdown, SRT and VTT ingestion with source locators; optional OCR and audio/video transcription.
- BM25 retrieval with query coverage thresholds and source-backed responses.
- Heuristic source-derived practice with server-held answer keys.
- Transparent topic estimates and a learning decision trace.
- Persistent spaced review queue with 1, 3, 7, 14 and 30-day intervals after correct answers; incorrect answers return after one day.
- Interactive concept universe, accessible concept list, function plotter, progress and evaluation views.

## Known limitations

- Topic extraction and question generation are heuristic.
- Short-answer grading uses keyword coverage; it is not semantic rubric grading.
- Mastery estimates are not validated BKT/IRT or evidence of durable learning.
- Spaced review intervals are a simple baseline, not a validated forgetting-curve model.
- The tutor retrieves indexed source passages; it is not a generative tutor.
- The function plotter is constrained and is not a computer algebra system.
- Hosted browser workspaces are isolated but are not accounts; there is no account recovery or cross-device sync.
- Live production deployment and browser end-to-end behavior must be verified separately.

## Verification

The GitHub Actions run for the spaced-review pull request passed the frontend JavaScript syntax check, API and engine tests, and the curated retrieval evaluation. A later test-only extension was committed to `main`; rerun CI before the next release.

## Deployment requirements

Use the included Docker backend with a persistent writable volume and session isolation. Deploy `web/` to Cloudflare Pages and set `LUMEN_API_ORIGIN` to the HTTPS origin of the separate FastAPI backend. Follow `DEPLOYMENT.md` and do not claim a live deployment is verified until the hosted smoke tests pass.

## Next engineering priorities

1. Improve concept extraction and prerequisite relationships with inspectable source evidence.
2. Build a learner diagnosis across explicit skills, not a single topic percentage.
3. Replace heuristic question quality and keyword-only grading with reviewed rubrics and evidence matching.
4. Add a coherent teach → practise → review → transfer path.
5. Evaluate learning outcomes with consented studies before making efficacy claims.
6. Add secure accounts, export, recovery and cross-device sync before promising durable personal learning records.
