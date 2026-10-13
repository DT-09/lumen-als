# LUMEN ALS — 3-minute demo script

## Before recording

- Run the test suite and evaluation script on the exact release candidate.
- Start the backend and open the app in a fresh browser workspace.
- Use the included Newton's laws sample PDF or another source you have permission to use.
- Confirm that upload, source citations, practice submission, graph plotting and progress refresh work in the browser.
- Do not show fabricated counters. If no material is indexed, show the honest empty state or upload the sample during the recording.
- Record the deployed Pages build if the backend and Pages proxy are both live. Otherwise clearly label the recording as local.

## 0:00–0:25 — Knowledge universe

Open LUMEN on the concept universe. Orbit the graph, zoom and select an actual concept extracted from the indexed source. Show that the concept list provides an accessible alternative. Click **Learn this**.

Narration: “LUMEN starts with a connected view of the learner's course material. The graph is populated from indexed concepts, not a prerecorded marketing animation.”

## 0:25–0:55 — Source ingestion

Open Library and upload the sample PDF. Show the real processing result and the page-level source locator. If extraction fails, do not conceal it; explain the limitation and retry with a readable source.

Narration: “The system preserves source locations so the learner can inspect the evidence behind an answer.”

## 0:55–1:25 — Grounded tutor

Ask a specific question answerable from the uploaded source. Show the quoted source excerpt and locator. Then ask an unrelated question and show the backend's insufficient-evidence response if the fixture is appropriate.

Narration: “The tutor retrieves source passages and abstains when its evidence threshold is not met. Retrieval thresholds are heuristic, so citations still need human verification.”

## 1:25–2:05 — Practice and learner model

Generate a practice set. Submit an answer, inspect the expected answer, grading note and source location. Show the mastery estimate and uncertainty interval. Complete a follow-up only if the time permits.

Narration: “Each response updates a transparent topic estimate. This baseline is not a validated psychometric model, and one wrong answer is not treated as proof of a misconception.”

## 2:05–2:30 — Interactive math lab

Plot `x^2`, then `2*x+1`. Change the inspection coordinate and range. Explain that this is a lightweight graphing tool rather than a symbolic algebra engine.

## 2:30–2:50 — Evaluation lab

Show the live counters and explain the test dimensions: retrieval, grounding, assessment, adaptation and regression. Only show benchmark values produced by the current `python evaluate.py` run, with the test-set size and limitations.

## 2:50–3:00 — Close

“LUMEN connects course evidence, interactive exploration, practice and transparent learning-state updates. The next research step is independent evaluation of answer quality, grading agreement and transfer—not a claim that those outcomes are already proven.”

## Recording checklist

- [ ] UI is legible at the recording resolution.
- [ ] No secrets, personal files, browser notifications or private workspace data are visible.
- [ ] Every shown interaction was performed live on this build.
- [ ] Source citations and quiz results are real responses.
- [ ] Deployment status is described accurately.
- [ ] Known limitations and AI-assisted development are disclosed.
