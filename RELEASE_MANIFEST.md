# LUMEN ALS — Release 1.2.0 manifest

Release date: 2026-10-13

## Package contents

- Source-aware FastAPI learning API and SQLite engine.
- New responsive frontend with projected spatial concept universe, accessible concept list, tutoring, source library, dedicated practice screen, interactive function plotter, progress and evaluation views.
- Cloudflare Pages Function API proxy and frontend security headers.
- Docker backend definition, Windows launch script, sample source materials, tests, curated evaluation runner, deployment runbook, demo script and Devpost draft.

## Verification performed on this exact package source

- `python -m pytest -q`: **26 passed**.
- `python evaluate.py`: **31/31 curated retrieval/refusal fixture cases passed**; Recall@3 = 1.0 and MRR@3 = 1.0 on the 20 in-scope hand-authored queries. The 11 out-of-scope fixture prompts were refused.
- `node --check` on the extracted frontend JavaScript: passed.
- `node --check` on the Cloudflare Pages Function: passed.
- FastAPI integration smoke test: sample PDF upload, grounded tutor response, practice generation, answer grading and learner-state update passed.

## Not verified here

- Full browser-driven visual/end-to-end test: the available browser runtime blocked local URL navigation.
- Live Cloudflare Pages deployment, remote backend connectivity, production cookie behavior, or persistence across a real backend restart.
- Independent educational efficacy, general retrieval accuracy, semantic grading quality or long-term retention/transfer.

## Required before submission

1. Run the app in a real browser and verify the UI interactions on your machine.
2. Deploy the Python API to a compatible HTTPS container host with a persistent volume and session isolation enabled.
3. Deploy `web/` to Cloudflare Pages and configure `LUMEN_API_ORIGIN`.
4. Perform the hosted smoke tests in `DEPLOYMENT.md`.
5. Rerun the test suite and evaluation script after any changes.
6. Record a truthful demo on the same build and review the Devpost text and AI-assistance disclosure.

This manifest distinguishes completed automated checks from deployment and browser checks that remain to be performed. It does not promise or imply a hackathon result.
