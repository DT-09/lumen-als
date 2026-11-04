# VESPER

**An independent STEM learning workspace.**

VESPER helps serious self-directed learners turn a question into a defensible body of understanding and original work.

The product is organised around one learning cycle:

**Discover → Map → Understand → Investigate → Create → Demonstrate → Retain**

This repository contains the learner-facing web application. It is a static, local-first web app; there is no account service, cloud sync, AI tutor, live research engine, or billing system.

## Run locally

Open `web/index.html` in a local static server:

```bash
cd web
python -m http.server 8080
```

Then visit http://localhost:8080.

## Deploy

Deploy the `web/` directory to Cloudflare Pages.

- Production branch: `main`
- Root directory: `web`
- Build command: leave blank
- Build output directory: `.`

## Learner data

Workspace data stays in the browser's local storage. Use Settings → Export workspace to create a JSON backup. Import accepts VESPER backup files. Clearing browser data can erase the local workspace. There is no cross-device sync.

## Product boundaries

- Learning routes are editable learner plans, not AI-generated prescriptions.
- Research notes and source assessments are learner-entered; VESPER does not verify sources.
- Demonstration records capture work and reflections; they do not certify mastery.
- The workspace does not replace subject-specific instruction, expert review, or experimental safety procedures.
