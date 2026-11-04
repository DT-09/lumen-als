# VESPER release manifest

## Release identity
- Product: VESPER — The Independent Learning Environment
- Static application: `web/index.html`
- Application runtime: `web/assets/batlab.js`
- Current product architecture: `PRODUCT_ARCHITECTURE.md`
- Release version: 2.0.0 (self-education system rebuild)

## Included learner systems
- Curiosity Engine: create, edit and delete learner-owned questions.
- Knowledge Architect: create flexible learning plans with learner-selected concepts.
- Learning Studio: 18 authored starter concepts, core relationships, narrow retrieval checks and reflection capture.
- Knowledge Map: inspect the currently authored prerequisite graph.
- Investigation Lab: record research questions, hypotheses, variables, controls, observations, interpretations and limitations.
- Model Bench: six interactive teaching models: linear function, ideal pendulum, Ohm's law, simplified atomic shells, cell structure and insertion sort with prediction/observation notes.
- Creation Workshop: manage research, model, software, experiment and technical-explanation projects; export project documents as Markdown.
- Resource Library: save source metadata and learner-entered quality assessments.
- Field Journal: create and manage learner-authored notes and reflections.
- Recall Practice: maintain a learner-managed retrieval queue.
- Knowledge Intelligence: inspect task-level records and project/investigation activity without a mastery score.
- Local-first storage, legacy learner-record migration, JSON export and data clearing.
- Responsive workspace, mobile navigation, keyboard-accessible controls and reduced-motion preference.

## Known limitations
- The application is static and stores data in browser local storage. There are no accounts, cloud sync, server backup or cross-device restore.
- The starter concept library contains 18 concepts across six STEM domains. It is not a comprehensive reviewed curriculum.
- Prerequisite relationships are incomplete and manually authored.
- Retrieval checks use narrow expected-answer matching. They do not verify proofs, extended reasoning, diagrams, full working, code or transfer.
- The six Model Bench models are simplified teaching models, not research-grade simulators.
- Investigation records are learner-entered; VESPER does not conduct experiments or independently validate scientific conclusions.
- Resource quality labels are entered by the learner and are not independently verified.
- No AI-generated learning plans, live research, source discovery, source verification, collaboration, billing or aggregate learner analytics are implemented.
- Task-level evidence is not a mastery certificate, grade prediction or proof of durable retention.

## Release gates
- [ ] JavaScript syntax validation passes on the release commit.
- [ ] Static platform validation passes.
- [ ] Python regression suite passes.
- [ ] Live Pages smoke tests pass after deployment.
- [ ] Mobile, keyboard and reduced-motion checks are completed.
- [ ] Privacy and security review is completed before adding accounts, analytics or sync.
