# VESPER deployment

## Static self-education platform

Deploy the `web/` directory to Cloudflare Pages.

| Setting | Value |
|---|---|
| Product | VESPER — The Independent Learning Environment |
| Repository | `DT-09/Vesper` |
| Production branch | `main` |
| Root directory | `web` |
| Build command | Leave blank |
| Output directory | `.` |

No environment variables or backend service are required for the current learner experience. It uses hash-based navigation and browser local storage.

## Smoke checks before publishing

1. Open the root URL and complete guest onboarding.
2. Create, edit and delete an inquiry.
3. Build a learning plan and open its concept route.
4. Study a concept, attempt its authored check and save a reflection.
5. Open the Knowledge Map and inspect the stated prerequisite relationships.
6. Change variables in all three Model Bench models and confirm their outputs update.
7. Create an investigation, record an observation and save its interpretation and limitations.
8. Create a project, edit its working document and export it as Markdown.
9. Add and evaluate a resource; create and delete a Field Journal entry.
10. Add a recall item and mark it reviewed.
11. Export all local data, reload, and confirm the records persist.
12. Clear local data and confirm the first-run experience returns.
13. Test mobile navigation, keyboard focus and reduced-motion settings.

## Release boundary

The legacy FastAPI verifier at the repository root is not part of the VESPER learner application. Do not expose legacy assessment-verification routes as VESPER capabilities.

The current application is a static, local-first self-education workspace. It is not yet a cloud platform or a validated adaptive-learning service. Comprehensive curriculum, robust reasoning verification, AI-assisted route generation, live research, source verification, secure accounts, backups, guardian controls, collaboration, analytics and billing remain unimplemented.
