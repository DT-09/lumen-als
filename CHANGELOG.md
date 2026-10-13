# Changelog

## LUMEN ALS 1.1 — 2026-10-13

- Standardized the product identity to **LUMEN ALS — Adaptive Learning System** across the app, README, demo script, and submission draft.
- Added optional hosted-mode per-browser workspace isolation using random HttpOnly, SameSite=Lax cookies and separate SQLite files. Hosted deployments must use HTTPS, persistent storage, and `LUMEN_SESSION_ISOLATION=1`.
- Added per-request upload limits (10 files, 25 MB per file, 50 MB total) and an answer-length limit.
- Normalized common question-wording variants in retrieval and evidence selection.
- Added conservative answer-type checks to refuse several misleading lexical-overlap queries (e.g., asking for a population or price of an unrelated course concept).
- Tightened numerical answer grading to check both numeric value and a small set of normalized unit spellings.
- Expanded the curated retrieval/refusal fixture to 31 questions across physics, biology, and history.
- Added deployment checklist, Dockerfile, and hosted-workspace isolation regression tests.

## Known limitations

- Retrieval is lexical BM25 with heuristic query coverage and can miss paraphrases or select misleading passages.
- The 31-case evaluation is hand-authored and small; perfect results on it are not general accuracy evidence.
- Question generation, short-answer grading, topic assignment, prerequisite extraction, and mastery estimates remain heuristic baselines.
- Browser workspaces are not user accounts; there is no account recovery, cross-device sync, or workspace sharing.
- A hosted deployment has not been created or verified by this package alone.
