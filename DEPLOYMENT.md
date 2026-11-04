# VESPER deployment

## Static learner platform

Deploy the `web/` directory to Cloudflare Pages.

| Setting | Value |
|---|---|
| Product | VESPER |
| Repository | `DT-09/StemBat` |
| Production branch | `main` |
| Root directory | `web` |
| Build command | Leave blank |
| Output directory | `.` |

No environment variables or backend service are required for the current learner experience. It uses hash-based navigation and browser local storage.

## Smoke checks before publishing

1. Open the root URL and confirm VESPER loads with the observatory identity.
2. Navigate to Observatory, Explore, all six subjects, Concept Atlas, Model Lab, Learning Signals, Recall Queue, Flight Log, Field Notes and Settings.
3. Complete a concept check and confirm its task-level state changes.
4. Reload and confirm local progress persists.
5. Change pendulum length and gravity; confirm the predicted period changes.
6. Save a model observation and confirm it appears in Field Notes.
7. Export the learning record as JSON.
8. Clear local data and confirm the guest experience returns.
9. Test mobile navigation, keyboard focus and reduced-motion preference.

## Release boundary

The legacy FastAPI assessment-verification service remains repository code but is not part of VESPER. Do not expose old STEMPROOF audit routes as VESPER capabilities.

The current app is a substantial static learner experience, not a production adaptive-learning service. Comprehensive curriculum, robust reasoning verification, validated adaptive diagnosis, cloud accounts, backups, guardian controls, community, analytics and billing remain unimplemented.
