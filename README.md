# BATLAB

**Build. Apply. Test. A bat-guided STEM discovery environment.**

BATLAB is a learner-first environment for exploring mathematics, physics, chemistry, biology, computer science and engineering. The bat is a quiet attention companion, not an interruptive chatbot. The experience is designed around a single learning loop:

**Discover → Build a model → Apply → Test → Reflect → Revisit**

## Learner experience

- **The Roost:** guest-first home, session goal, next-step recommendation, subject entry points and local activity summary.
- **Explore STEM:** searchable starter library across six STEM domains, with open navigation rather than a locked grade path.
- **Focus Chamber:** one concept at a time, concise explanation, key relationship, confidence check, independent retrieval task and notebook save.
- **Knowledge Terrain:** concept relationships, prerequisite labels, evidence states and cross-subject bridges.
- **Discovery Lab:** six interactive models — linear function explorer, simple pendulum, simplified atomic shell explorer, schematic cell structure explorer, insertion-sort visualiser and ideal Ohm's-law workbench.
- **Echo Intelligence:** explains what local attempts and prerequisite relationships support, and what remains uncertain.
- **Revisit Queue:** successful task checks schedule a simple local retrieval prompt.
- **Flight Records:** inspect attempts and task-level outcomes; export a JSON learning record.
- **Field Notebook:** save, review and delete learner-authored notes and observations.
- **Focus environment:** hide navigation while studying, dismissible bat cues, reduced-motion option and session goal.
- **Guest-first:** no signup wall; progress remains in browser local storage.

## Learning evidence and limits

The current route logic is deterministic and local. It uses authored prerequisite relationships, recent activity, task outcomes and optional self-reported confidence. A successful check schedules a revisit after two days. This is a basic retrieval prompt, not a validated spaced-repetition algorithm.

The 18 concept checks are narrow authored tasks with simple answer matching. They do not yet verify proofs, diagrams, working, open responses or code. The six lab models are deliberately simplified and state their assumptions. They are educational visualisations, not research-grade simulators.

BATLAB does **not** currently provide:
- a complete or independently reviewed STEM curriculum;
- robust misconception diagnosis or validated mastery measurement;
- comprehensive prerequisite inference or transfer assessment;
- AI tutoring or an autonomous bat agent;
- accounts, cloud sync, backup, guardian controls or multi-user profiles;
- community features, moderation or aggregate learner analytics;
- production billing, memberships or entitlement management;
- a validated learning-efficacy study.

Do not treat a passed task as proof of general mastery, academic attainment or ability. Echo can report insufficient evidence. Recommendations are suggestions; learners can choose another route.

## Run locally

The learner experience is static and requires no backend:

```bash
cd web
python -m http.server 8080
```

Open `http://localhost:8080`. The application uses hash-based navigation and browser local storage. No build step is required.

## Deploy

Deploy the `web/` directory as a static Cloudflare Pages project:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | `web` |
| Build command | None |
| Output directory | `.` |

The legacy FastAPI assessment-verification service at the repository root is not part of the BATLAB learner experience. Do not expose old STEMPROOF routes as BATLAB capabilities.

## Privacy and safety

This build stores learning activity, notes, confidence selections and settings in local browser storage. It does not send learner activity to a server. Learners can export or clear local data. There is no cloud backup.

No camera, microphone, eye tracking, audio prompts, public learner ranking or streak pressure is used. Because the intended audience includes minors, any future accounts, analytics, community, sync or payments require age-appropriate privacy design, data minimisation, access controls, retention and deletion rules, and guardian/consent review where required.

## Engineering direction

The next production phase requires a versioned content graph, reviewed curriculum, subject-specific verification, richer reasoning capture, tested simulation models, accessible automated and manual testing, secure optional sync and privacy review. AI may assist explanations but must not be the sole authority for mathematical or scientific correctness.
