# Frontend Setup — Developer B

## Worktree and ownership

- Worktree: `../openpath-frontend`
- Branch: `feature/frontend`
- Own `frontend/`, frontend tests, UI styles, and frontend-specific configuration/docs. Do not edit `backend/` or backend AI/provider logic.
- Locked dependencies installed successfully in this worktree with `npm ci`.

## Requirements

- Verified in the baseline environment: Node.js `v20.20.0`, npm `10.8.2`.
- Root frontend dependencies are declared in `package.json` and pinned by `package-lock.json`.
- No frontend test script or component/E2E test suite is currently configured.

## Install and run

```bash
cd ../openpath-frontend
npm ci
npm run dev:client
```

Vite serves `http://localhost:5173/`. API calls use `/api` and proxy to `http://localhost:5501` by default. For integrated UI work, ask Developer A to run the backend in the AI/backend worktree or use an approved mock API contract. To run both services from this worktree, install backend dependencies as well and use `npm run dev`.

Build and lint:

```bash
npm run build
npm run lint
```

Previous verification: `npm run build` passed; `npm run lint` completed with 0 errors and one unused `useEffect` warning at `frontend/src/components/SkillReadinessCard.jsx`. There is no `npm test` script at the root. Recheck build and lint after this directory reorganization.

## Configuration

Optional client API override: `VITE_API_BASE_URL`. Leave unset for the Vite proxy. Do not put GitHub or AI credentials in frontend environment variables or browser storage. Frontend profile skills/experience currently use browser `localStorage`.

## Handoff

Document any required API changes in the PR, including method/path, request/response examples, errors/status codes, and loading/empty/retry states. Keep backend implementation changes with Developer A.
