# VESPER

**The independent learning environment.**

VESPER is a local-first self-education system for curious learners devoted to educating themselves in STEM and adjacent fields. It starts with learner-owned questions rather than a fixed course catalogue.

**Question → Knowledge route → Study → Investigate → Create → Demonstrate → Discover further.**

## Product systems

- **Curiosity Engine:** capture and refine questions, interests, prior knowledge and intended outcomes.
- **Knowledge Architect:** create and revise learning plans, receive transparent keyword-based starter suggestions, track six practical milestones, and inspect authored prerequisite relationships. Suggestions are limited by the small local concept index.
- **Learning Studio:** study starter concepts, inspect core relationships, attempt narrow retrieval checks and save reflections.
- **Investigation Lab:** define research questions, hypotheses, variables, controls, observations, interpretations and limitations.
- **Creation Workshop:** manage research papers, models, software, experiments and other original outputs.
- **Resource Library:** save sources and record relevance, provenance and quality checks.
- **Field Journal:** preserve learner-authored reasoning, observations and corrections.
- **Knowledge Intelligence:** inspect task-level evidence without inventing mastery scores.
- **Recall Practice:** maintain a learner-managed list of concepts to revisit.
- **Self-Education Method:** practise question design, prerequisite mapping, source evaluation, retrieval, investigation and creation.

## Current implementation boundary

The web application is a static, browser-local application. Questions, plans, notes, projects, investigations, resources and task records are stored in local storage. There are no accounts, cloud sync, AI-generated curricula, live source discovery, collaboration, billing or server-side learner analytics.

The starter concept library contains 18 authored STEM concepts across six fields. Its prerequisite graph is incomplete. Learning checks use narrow authored answer matching and are evidence for one task only. They do not verify proofs, extended reasoning, diagrams, code or transfer. The investigation workspace records learner-entered work; it does not conduct experiments or validate scientific conclusions. Resource quality labels are learner-entered, not independently verified.

## Run locally

```bash
cd web
python -m http.server 8080
```

Open http://localhost:8080. No build step is required.

## Deploy

Deploy the `web/` directory as a static Cloudflare Pages project. Set `web` as the root directory, no build command, and `.` as the output directory.

The legacy FastAPI verifier at the repository root is not part of the VESPER learner application.

## Privacy

Data remains in the current browser profile. Export before clearing browser data. There is no cloud backup or cross-device sync. The intended audience may include minors; any future accounts, analytics, collaboration or sync require age-appropriate privacy and security design before release.
