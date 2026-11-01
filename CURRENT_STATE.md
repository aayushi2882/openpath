# OpenPath Current State

**Audit date:** 2026-11-01

**Repository:** `https://github.com/aayushi2882/openpath.git`

**Default branch:** `main`

**Current baseline:** commit `e22ba5d` (`fix: restore README artwork`)

This is an evidence-based snapshot of the connected repository. “Verified” means a command or live endpoint was exercised in this environment; source inspection alone is called out separately.

## Repository and collaboration baseline

- Canonical working copy: repository root `CODE/` (this directory).
- `origin` points to the OpenPath GitHub repository. `origin/HEAD` resolves to `origin/main`.
- `main` was clean and equal to `origin/main` when Phase 0 setup began.
- Existing remote branch `docs/animated-readme` was observed. No local feature branches or additional worktrees existed at the start of setup.
- Local `develop` was created from `origin/main` at `e22ba5d`; shared baseline documentation is committed at `96597ed`.
- `feature/ai-backend` and `feature/frontend` both point to `96597ed`. Their isolated worktrees are `../openpath-ai-backend` and `../openpath-frontend`, respectively. Both worktrees have clean tracked status and independent locked dependencies installed.
- These setup branches are local and have not been pushed. `main` remains unchanged at `e22ba5d`.
- Do not treat an unpushed local branch as available to a developer on another machine. Publish branches only through the agreed collaboration workflow.

## Stack and structure

- Frontend: React 19, Vite 8, JavaScript, CSS; root `package.json` and `src/`.
- Backend: Node.js ESM and Express 4; `server/package.json`, `server/src/index.js`, `server/src/routes/`, `server/src/services/`.
- GitHub integration: direct REST API requests in `server/src/services/githubService.js`.
- AI: issue AI routes call `server/src/services/aiService.js`; configured Kaggle endpoint is supported with optional local Ollama fallback. Website AI calls Ollama directly in `server/src/services/websiteAnalysisService.js`.
- Website capture: Playwright Chromium and a custom public-network proxy in `server/src/services/websiteAnalysisService.js`.
- Persistence: browser `localStorage` only. No database, user accounts, or job queue was found.

## Verified commands and runtime checks

Commands were run in the connected primary checkout on 2026-11-01:

| Check | Result |
|---|---|
| `npm run build` | Passed; Vite production build completed. |
| `npm run lint` | Completed with 0 errors and 1 warning: unused `useEffect` import in `src/components/SkillReadinessCard.jsx`. |
| `npm test --prefix server` | 12 passed, 1 failed. The failure is a stale message expectation in `server/src/services/aiService.test.js`; details in `TECHNICAL_DEBT.md`. |
| `npm run dev` | Frontend served at `http://localhost:5173/`; Express served at `http://localhost:5501/`. Both started and were stopped cleanly. |
| `GET /api/health` | HTTP 200, `status: ok`. AI reported unreachable local Ollama; no GitHub token was configured. |
| `GET /api/ai/status` | HTTP 200; Ollama `gemma4:e2b` unreachable in this environment. |
| Repository metadata | `GET /api/repositories/vitejs/vite` returned success, repository identity/language, README, and contribution guide. |
| Repository issues | `GET /api/repositories/vitejs/vite/issues?per_page=1` returned success and one real issue. GitHub reported unauthenticated limit 10, remaining 9 at request time. |

The same startup/API checks were repeated from the separate worktrees: Developer B's Vite root returned HTTP 200 while Developer A's Express service was running; the backend health, AI status, repository metadata/docs, and issue requests succeeded as described above.

No actual credentials were printed or recorded. `.env` and `server/.env` were absent by filename check at audit time; only example files were present.

## Feature snapshot

- **Implemented, runtime-verified:** repository metadata/docs and issue retrieval against public `vitejs/vite`; app/backend startup; health and AI-status endpoints.
- **Implemented, but only partly verified:** issue explanation/recommendations, profile stored in browser, contribution checklist, website capture and AI findings. AI tests use mocked provider responses; a live Ollama/Kaggle inference was not available.
- **Not implemented:** managed Kaggle credentials/session lifecycle; deterministic repository ranking; async scan jobs, progress and cancellation; report history/export; database, authentication, CI/CD, deployment and operational monitoring.
- **Known content issue:** the preserved root `README.md` still describes the old nested `openpath/` layout and its quick-start command uses `cd openpath/openpath`; app files now live at repository root. README artwork under `assets/` was restored in commit `e22ba5d`.

See `FEATURE_AUDIT.md`, `TECHNICAL_DEBT.md`, `SYSTEM_ARCHITECTURE.md`, and `ROADMAP.md` for details.

**Phase 0 readiness:** Both worktrees are prepared and verified. Phase 0 is ready for review but remains open until both developers approve the baseline; the backend test mismatch and unavailable AI runtime are recorded limitations.
