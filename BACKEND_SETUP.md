# Backend Setup — Developer A

## Worktree and ownership

- Worktree: `../openpath-ai-backend`
- Branch: `feature/ai-backend`
- Own `server/`, backend routes/services/middleware/tests/configuration and backend docs. Do not edit frontend `src/`, CSS, assets, or frontend dependencies.

## Requirements and commands

- Verified in the baseline environment: Node.js `v20.20.0`, npm `10.8.2`.
- Backend package: `server/package.json`; dependencies are pinned in `server/package-lock.json`.

```bash
cd ../openpath-ai-backend
npm ci --prefix server
npm --prefix server run dev
```

Backend listens at `http://localhost:5501` by default. Other commands:

```bash
npm --prefix server start
npm test --prefix server
```

If website capture is needed, install Playwright Chromium after dependencies:

```bash
cd server
npx playwright install chromium
```

## Environment and secrets

Copy `server/.env.example` to `server/.env` for local configuration. Supported example names include `PORT`, `GITHUB_TOKEN`, `KAGGLE_KERNEL_URL`, `KAGGLE_MODEL`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `OLLAMA_FALLBACK_ENABLED`, and `WEBSITE_ANALYSIS_TIMEOUT_MS`. The example file contains placeholders, not credentials. Keep real values only in ignored local `.env` files; never commit or log them. No `.env` or `server/.env` file was present by filename check during this baseline.

AI readiness is available at `GET /api/ai/status`; application health is `GET /api/health`. A successful health response does not mean AI is ready. Baseline AI status returned HTTP 200 but Ollama was unreachable. GitHub works without a token at a low unauthenticated limit; add a token only in local backend configuration if needed.

## Current tests and smoke checks

Run `npm test --prefix server`. Baseline result: 12 pass, 1 fail. `server/src/services/aiService.test.js` expects the unreachable Ollama status text to contain `Start Ollama`, while implementation returns `Local Ollama fallback is unreachable.` Investigate the intended user message before changing the test or implementation.

Verified public workflow: `GET /api/repositories/vitejs/vite` returned metadata, README, and contribution guide; `GET /api/repositories/vitejs/vite/issues?per_page=1` returned one real issue. Both were live unauthenticated GitHub API calls.

## API handoff

Document any frontend integration change before implementation: method/path, inputs, response envelope, error codes/statuses, loading/timeout expectations, and authentication requirements. Keep endpoint implementation and backend tests in this worktree; send the contract to Developer B for UI integration.
