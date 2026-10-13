# LUMEN ALS — 5-minute product demo script

**Format:** real screen recording of the running app, with concise narration or on-screen captions. No face camera or self-recorded lecture is required. Use the included original sample course pack. Keep the full video within the track's stated 3–10 minute range.

## 0:00–0:25 — The problem and the claim

**Show:** Course workspace landing page.

**Say / caption:** “LUMEN ALS is a source-grounded adaptive learning studio. It turns course material into cited explanations and practice, then updates a transparent topic-level mastery estimate. The central design choice is evidence before answer: if the indexed material does not support a response, the tutor should say so.”

## 0:25–1:10 — Ingest more than one source type

**Show:** Upload `newtons_laws_sample.pdf`, `newtons_laws_sample.pptx`, and `newtons_laws_sample.vtt` from `sample_materials/`.

**Say / caption:** “The course index preserves page, slide, and transcript timestamps. This demo uses an original sample pack, slide deck, and timestamped transcript so the source trail is inspectable. PDF figure text and slide-image OCR are attempted when local OCR support is available; this is OCR, not full visual diagram reasoning.”

## 1:10–2:05 — Ask a grounded question

**Show:** Open Grounded Tutor and ask: `What does Newton second law say about force mass and acceleration?`

**Say / caption:** “The tutor uses BM25 ranking plus query-term coverage to retrieve relevant source sentences and attaches the exact source filename and location. This implementation uses local lexical retrieval and extractive evidence composition rather than a remote generative model. That makes the output inspectable and avoids API keys, but it can miss paraphrases and does not provide free-form LLM reasoning.”

## 2:05–2:30 — Test the boundary

**Show:** Ask: `What is the capital of Mars and its population?`

**Say / caption:** “This question is outside the course evidence. LUMEN ALS flags insufficient evidence instead of pretending the answer came from the course.”

## 2:30–3:45 — Assessment and adaptation

**Show:** Open Adaptive Practice and generate a set. Demonstrate one numerical item, one short-answer item, and one multiple-choice item when available. Submit an answer and show the cited feedback.

**Say / caption:** “Question formats are generated only when the indexed text provides enough structure. Numerical items are created from explicit numeric results in the source. Short answers use a simple source-derived keyword coverage check, so the score is heuristic rather than a human-quality semantic grade. Answer keys stay server-side until submission. The interface explains why a topic was prioritized, attempts update the estimate with an approximate uncertainty interval, and served questions are not repeated.”

## 3:45–4:25 — Concept and learner evidence

**Show:** Return to Course Workspace, then Learning Evidence. Point out concepts, any explicitly detected prerequisite relationship, topic estimates, attempt counts, and observed accuracy.

**Say / caption:** “Concept labels and prerequisite relationships are extracted heuristically. Mastery uses a transparent Beta(2,2) prior updated by correct and incorrect answers; it is not claimed to be validated BKT or IRT. With no attempts, 50% is a prior estimate—not measured learning.”

## 4:25–5:00 — Reproducible evaluation and close

**Show:** In a terminal run `python evaluate.py`, then `python -m pytest -q`. Briefly show `evaluation_results.json`.

**Say / caption:** “The small hand-authored fixture currently passes 31 of 31 retrieval/refusal cases across physics, biology, and history (20 in-scope and eleven off-material), with Recall@3 and MRR@3 of 1.0 on that curated set. In a separate synthetic profile check, four correct answers produce a 0.75 estimate and four incorrect answers produce 0.25, and two generated sets have no repeated question IDs. The regression suite passes 24 tests. These are software checks on small fixtures, not a general benchmark or evidence of educational efficacy.”

**Close:** “LUMEN ALS’s goal is to make study assistance traceable and adaptive: course evidence in, assessed practice out, and learner estimates that remain explicit about their limits.”

## Recording checklist

- Start with the app already running; do not spend video time on package installation.
- Upload all three sample files before recording or keep them ready in a single folder.
- Verify the exact question results and citation locations before recording.
- Show at least one unsupported question, one answer submission, and the changed mastery estimate.
- Show `evaluation_results.json` only after rerunning the tests.
- Keep browser zoom at a readable level; hide notifications and unrelated tabs.
- Publish to YouTube with public/unlisted visibility that judges can access; copy the URL into Devpost.
