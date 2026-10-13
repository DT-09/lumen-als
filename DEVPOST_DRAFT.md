# LUMEN ALS — Devpost submission draft

## One-line summary

A local-first adaptive learning studio that turns course documents, slides, and timestamped lecture transcripts into source-linked explanations, mixed-format practice, and transparent topic-level mastery estimates.

## Inspiration

Students often study across disconnected PDFs, slide decks, and lecture transcripts. A fluent answer is not enough if learners cannot verify where it came from or understand which concepts need more practice. LUMEN ALS treats source traceability and learner feedback as part of the learning workflow, not as afterthoughts.

## What it does

- Ingests PDF, PPTX, DOCX, TXT/Markdown, and SRT/VTT transcript files, preserving page, slide, or timestamp locations.
- Attempts OCR on embedded PDF figures and slide images when local OCR support is installed.
- Uses BM25 ranking plus informative-query-term coverage to retrieve relevant course passages and return source-linked evidence; unsupported questions are flagged when retrieval evidence is insufficient.
- Generates source-derived multiple-choice completion questions, short-answer prompts, and numerical recall items when the source supports them.
- Keeps quiz answer keys and grading metadata server-side until submission, records attempts, avoids re-serving generated questions, and explains why a topic was prioritized for practice.
- Displays a concept index, explicitly stated prerequisite links where detected, and topic-level learning estimates.
- Includes a reproducible 31-query retrieval/refusal fixture across physics, biology, and history, Recall@3/MRR@3, citation-provenance checks, a synthetic learner-profile direction check, a question-repetition check, and regression tests.

## How we built it

LUMEN ALS uses Python, FastAPI, SQLite, PyMuPDF, python-pptx, python-docx, and a custom HTML/CSS/JavaScript interface. Retrieval and evidence selection run locally with transparent lexical scoring; the core app requires no paid API or secret key. Optional local transcription uses `faster-whisper`, and optional image text extraction uses Tesseract OCR.

## Evaluation and limitations

The included hand-authored smoke fixture checks 31 retrieval/refusal queries across physics, biology, and history (20 in-scope and 11 off-material). The current run passes 31/31 curated cases, with Recall@3 and MRR@3 of 1.0 on this fixture and 11/11 off-material prompts refused, including three hard negatives with misleading lexical overlap. These numbers are reproducible through `python evaluate.py` and recorded in `evaluation_results.json`. They describe only a small curated fixture—not general accuracy or evidence of improved learning outcomes.

The tutor composes answers from retrieved sentences rather than using a remote generative LLM. Retrieval uses BM25 plus query-term coverage and can still miss paraphrases or retrieve misleading lexical matches. Short-answer grading uses heuristic keyword coverage; numerical grading normalizes a small set of common unit spellings but is not full dimensional analysis; topic labels and prerequisite extraction are heuristic; mastery is a Beta(2,2) posterior mean with an approximate uncertainty interval, not validated BKT/IRT. OCR is not full visual understanding of diagrams. The README documents setup and limitations.

## Built with

Python, FastAPI, SQLite, PyMuPDF, python-pptx, python-docx, HTML, CSS, JavaScript, Tesseract OCR (optional), faster-whisper (optional), AI-assisted development.

## AI assistance disclosure

AI coding assistance was used during development. The entrant should review the code and be able to explain the architecture, retrieval/refusal logic, assessment generation, learner model, and evaluation limitations before submission.
