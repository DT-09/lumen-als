# VESPER

**The independent learning environment.**

VESPER is a local-first self-education system for curious learners devoted to educating themselves in STEM and adjacent fields. It starts with learner-owned questions rather than a fixed course catalogue.

**Question → Knowledge route → Study → Investigate → Create → Demonstrate → Discover further.**

## Product systems

- **Curiosity Engine:** capture and refine questions, interests, prior knowledge and intended outcomes.
- **Knowledge Architect:** create and revise learning plans, receive transparent keyword-based starter suggestions, track six practical milestones, and inspect authored prerequisite relationships. Suggestions are limited by the small local concept index.
- **Learning Studio:** study starter concepts, inspect core relationships, attempt narrow retrieval checks and save reflections.
- **Investigation Lab:** define research questions, hypotheses, variables, controls, observations, interpretations and limitations.
- **Model Bench:** manipulate six simplified STEM teaching models and record predictions and observations.
- **Creation Workshop:** manage research papers, models, software, experiments and other original outputs.
- **Resource Library:** save sources and record relevance, provenance and quality checks.
- **Field Journal:** preserve learner-authored reasoning, observations and corrections.
- **Knowledge Intelligence:** inspect task-level evidence without inventing mastery scores.
- **Recall Practice:** maintain a learner-managed list of concepts to revisit.
- **Self-Education Method:** practise question design, prerequisite mapping, source evaluation, retrieval, investigation and creation.

## Run locally

    cd web
    python -m http.server 8080

Open http://localhost:8080. No build step is required.

## Deploy

Deploy the web/ directory as a static Cloudflare Pages project. Set web as the root directory, no build command, and . as the output directory.

The legacy FastAPI verifier at the repository root is not part of the VESPER learner application.

## Storage, offline use and privacy

The application stores learner records in the current browser profile. A service worker caches the application shell so the workspace can reopen offline after its first successful online load. Offline use does not provide cloud backup or cross-device sync. Export a JSON backup regularly and keep it somewhere safe. Clearing browser data can erase local records.

There are no accounts, cloud sync, analytics, collaboration, billing or server-side learner analytics. The intended audience may include minors; any future accounts, analytics, collaboration or sync require age-appropriate privacy and security design before release.

## Learning and evidence boundaries

The starter concept library contains 18 authored STEM concepts across six fields. Its prerequisite graph is incomplete. Learning checks use narrow authored answer matching and are evidence for one task only. They do not verify proofs, extended reasoning, diagrams, code or transfer. The investigation workspace records learner-entered work; it does not conduct experiments or validate scientific conclusions. Resource quality labels are learner-entered, not independently verified. The six Model Bench models are simplified teaching models, not research-grade simulators.

VESPER does not claim to certify mastery, predict grades, or prove durable learning. It is a structured workspace for independent study and evidence capture.
