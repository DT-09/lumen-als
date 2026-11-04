# VESPER

**A universe of ideas. One clear next step.**

VESPER is a learner-first STEM learning observatory for mathematics, physics, chemistry, biology, computer science and engineering. It combines structured concept learning with interactive models, focused study, evidence-aware recommendations and a quiet bat companion.

**Discover → Build a model → Apply → Test → Reflect → Revisit**

## The learner experience

- **Observatory:** guest-first home, session intention, next-step recommendation, subject portals and activity overview.
- **Explore:** searchable concept library across six STEM domains.
- **Focus Studio:** one concept at a time, concise explanation, key relationship, confidence reflection, independent retrieval task and notebook capture.
- **Concept Atlas:** prerequisite relationships, evidence states and cross-disciplinary connections.
- **Model Lab:** six interactive models — linear functions, simple pendulum, simplified atomic shells, schematic cell structures, insertion sort and ideal Ohm's law.
- **Learning Signals:** transparent view of attempts, task outcomes, confidence when supplied, and why a route is suggested.
- **Recall Queue:** local retrieval prompts scheduled after successful task checks.
- **Flight Log:** inspect task-level attempts and export a JSON learning record.
- **Field Notes:** save, review and delete learner-authored observations.
- **Focus environment:** hide navigation, use dismissible bat cues, respect reduced-motion settings and set a session intention.
- **Guest-first:** no signup wall; current progress remains in this browser.

## Evidence and limitations

The current recommendation engine is deterministic and local. It uses authored prerequisite links, recent activity, task outcomes, optional self-reported confidence and due revisit timestamps. Successful task checks schedule a simple two-day retrieval prompt. This is a basic reminder, not a validated spaced-repetition algorithm.

The starter checks use authored expected answers and narrow answer matching. They do not verify proofs, diagrams, full working, open responses or code. The six lab models state their assumptions and are educational visualisations, not research-grade simulators.

A successful task check is evidence for that task only. It is not a mastery certificate, grade prediction or proof of transfer. Learning Signals can report insufficient evidence. Learners can always choose another route.

## Current release boundary

VESPER currently provides a substantial static learner experience. It does **not** yet provide a complete reviewed STEM curriculum, validated misconception diagnosis, comprehensive adaptive intelligence, AI tutoring, cloud accounts, synchronisation, backup, guardian controls, community, aggregate analytics, billing or validated learning-efficacy research.

No camera, microphone, eye tracking, audio prompts, public learner rankings or streak pressure are used. Local data can be exported or cleared.

## Run locally

```bash
cd web
python -m http.server 8080
```

Open `http://localhost:8080`. The application uses hash-based navigation and browser local storage; no build step is required.

## Deploy

Deploy the `web/` directory as a static Cloudflare Pages project. Use `web` as the root directory, no build command and `.` as the output directory.

The legacy FastAPI assessment-verification service at the repository root is not part of VESPER. Do not expose legacy STEMPROOF routes as VESPER capabilities.

## Privacy and learner safety

The current build stores activity, notes, confidence selections, settings and revisit timestamps in browser local storage. It does not send learner activity to a server. Learners can export or clear local data. There is no cloud backup.

Because the intended audience includes minors, future accounts, analytics, community, sync or payments require age-appropriate privacy design, data minimisation, access controls, retention and deletion rules, and guardian/consent review where required.

## Engineering direction

A production platform requires a versioned content graph, reviewed curriculum, subject-specific verification, richer reasoning capture, tested simulation models, accessibility and device QA, secure optional sync, privacy review, monitoring, backups and an evidence-based evaluation of learning outcomes. AI may assist explanations but must not be the sole authority for mathematical or scientific correctness.
