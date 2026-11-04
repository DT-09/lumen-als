# VESPER — Product Architecture

## Product definition

**VESPER is a self-education system for curious, self-directed learners.** It helps people turn questions into structured learning, independent investigation, original work and demonstrated capability. It is not a course catalogue, school replacement or generic AI tutor.

## Core learning loop

1. **Question:** capture a curiosity and clarify what is being asked.
2. **Map:** identify concepts, prerequisites, sources and capabilities needed.
3. **Learn:** study explanations, primary sources, worked examples and models.
4. **Investigate:** form hypotheses, define variables, examine evidence and record limitations.
5. **Create:** produce a model, paper, code artefact, experiment or technical explanation.
6. **Demonstrate:** test retrieval, reasoning and application; distinguish evidence from assumption.
7. **Evolve:** refine the question and choose a further direction.

## Product systems

| System | Purpose | Current capability |
|---|---|---|
| Curiosity Engine | Learner-owned questions | Capture, edit, contextualise and delete inquiries |
| Knowledge Architect | Flexible routes | Transparent keyword-based concept suggestions, learner-selected route and authored prerequisite map |
| Learning Studio | Concept acquisition | 18 starter explanations, relationships, narrow checks and reflection |
| Investigation Lab | Scientific inquiry | Hypothesis, variables, controls, observation, interpretation and limitations records |
| Creation Workshop | Original work | Project records and editable Markdown-ready working documents |
| Resource Library | Source literacy | Save links, bibliographic details and learner-entered source evaluation |
| Field Journal | Metacognition | Learner-owned notes and reflections |
| Knowledge Intelligence | Evidence review | Task records and project/investigation counts; no mastery score |
| Recall Practice | Retrieval continuity | Learner-managed revisit list |

## Architecture and state

The current public learner application is a static JavaScript application with hash-based navigation and browser local storage. It has no application server dependency. The data model is versioned at the application level and includes profile, questions, plans, resources, investigations, projects, notes, sessions/checks, recall items and settings. A migration path preserves available legacy BATLAB/VESPER local records where possible.

## Content and evidence boundaries

- The starter concept set contains 18 authored concepts across mathematics, physics, chemistry, biology, computer science and engineering.
- The prerequisite graph is intentionally small and incomplete. Missing edges mean unknown, not unrelated.
- Authored answer matching is narrow and task-specific. It does not assess proofs, open responses, diagrams, code, complete working or transfer.
- A correct check is not a mastery certificate or evidence of long-term retention.
- Investigation records are learner-entered. VESPER does not independently validate hypotheses, methods or conclusions.
- Source-quality labels are entered by the learner. Saving a source does not verify its credibility.
- The platform must show uncertainty rather than infer psychological traits or fabricate expertise.

## Design principles

- Curiosity before curriculum.
- Learner agency before platform prescription.
- Sources and evidence before confident claims.
- Practice and creation before passive completion.
- Visible assumptions and limitations.
- Local-first privacy until secure, age-appropriate services exist.
- Accessibility, keyboard support and reduced motion.
- No streak pressure, public rankings, attention tracking or manipulative engagement loops.

## Not implemented

AI-based route generation (current local suggestions use keyword matching only), live web research, source verification, a comprehensive reviewed curriculum, robust open-response or proof verification, validated adaptive diagnosis, cloud accounts, sync, backups, collaboration, moderation, analytics pipeline, billing and validated learning-outcome research.

## Next engineering priorities

1. Expand and review the concept graph with stable IDs, learning objectives, citations, prerequisite rationales and subject-specific verification.
2. Add stronger evidence capture: working, explanations, diagrams, code and transfer tasks, each with an appropriate validation method.
3. Build secure optional sync and export/restore only after threat modelling, age-appropriate privacy review and deletion controls.
4. Add research workflows with citation metadata, provenance, source comparison and explicit uncertainty.
5. Evaluate learning outcomes with real users and transparent methodology before making efficacy claims.
