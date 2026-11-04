# Deployment

Deploy the contents of `web/` as a static site.

## Cloudflare Pages

- Connect repository: `DT-09/Vesper`
- Production branch: `main`
- Root directory: `web`
- Build command: none
- Output directory: `.`

Every route is handled client-side; the app uses hash navigation and needs no server rewrite rules.

After deployment, verify:
1. The root URL opens the learner workspace.
2. Refreshing a nested hash route preserves the app.
3. A test question persists after refresh.
4. Export and import work.
5. The app shell can reopen after a successful first load.

The repository update does not itself deploy the Cloudflare Pages project. Confirm the Pages build and production URL in Cloudflare.
