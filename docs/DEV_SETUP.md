# OpenPath Developer Setup

## Repository layout

Use one checkout at the repository root (`CODE/`). Application code is organized in `frontend/` and `backend/`; shared engineering documents live in `docs/`.

```text
CODE/
├── backend/       # Express API, services, tests, backend package
├── frontend/      # React/Vite app, public assets
├── docs/          # setup, requirements, contracts, architecture, audits
├── assets/        # README artwork
├── package.json   # root development scripts and frontend tooling
└── README.md
```

Do not create additional full-project copies or Git worktrees for the two task branches. This checkout can have only one branch checked out at a time, so coordinate branch switches and do not switch while another developer has uncommitted work in this folder. Separate branches remain available on the same remote.

## Branches and ownership

- `main`: shared integration branch.
- `feature/ai-backend`: backend and AI task branch, owned by Developer A.
- `feature/frontend`: frontend/UX task branch, owned by Developer B.

| Owner | Primary paths | Coordinate before changing |
|---|---|---|
| Developer A — backend/AI | `backend/`, backend tests/configuration | Shared API contracts and docs, root scripts/config |
| Developer B — frontend/UX | `frontend/` | Shared API contracts and docs, root scripts/config |
| Shared | `docs/`, API integration and release work | Agree on request/response shape and ownership first |

Current working preference: use `feature/ai-backend` for backend work by default. Switch to `feature/frontend` only when the frontend task is requested. Do not push any branch unless Manas explicitly asks. When a push is requested without a branch specified, use `feature/ai-backend`; push `feature/frontend` or `main` only when explicitly requested.

## Safe single-checkout workflow

Before starting or switching tasks:

```bash
pwd
git status --short --branch
git branch --show-current
```

Fetch and switch only after the working tree is clean or the current work has been committed:

```bash
git fetch origin
git switch feature/ai-backend
git pull --ff-only origin feature/ai-backend
```

For a specifically requested frontend task, use `feature/frontend` in those commands. Do not switch branches over uncommitted changes. If work is unfinished, commit it on its task branch or ask before stashing it.

Stage only owned paths and make a focused commit:

```bash
git add backend/
git commit -m "feat(ai): describe backend change"
```

For a frontend task, stage the actual changed `frontend/` paths instead. A commit is local; push only after an explicit request. Never force-push or rewrite shared branch history.

## Integration

Review task-branch changes against `main` before integration:

```bash
git fetch origin
git log --oneline --left-right origin/main...feature/ai-backend
git diff --stat origin/main...feature/ai-backend
```

Use `feature/frontend` for frontend changes. Integrate through an approved pull request when requested. Do not work directly on `main` or merge branches without review/authorization. After integration, update a task branch only after inspecting the incoming diff; do not reset it.

## Local development

```bash
npm install
npm ci --prefix backend
npm run dev
```

The root dev command starts Vite and Express together. See [frontend setup](FRONTEND_SETUP.md) and [backend setup](BACKEND_SETUP.md) for service-specific commands and environment configuration. Keep credentials in ignored local `.env` files; commit only `.env.example` templates.

## API coordination

Client calls live in `frontend/src/services/api.js`; Express routes live in `backend/src/routes/`. Before changing a contract, agree on method/path, request shape, success and error responses, status codes, timeout behavior, and authentication expectations. The current draft is [API_CONTRACTS.md](API_CONTRACTS.md).

## Verification baseline

See [current state](CURRENT_STATE.md), [feature audit](FEATURE_AUDIT.md), and [technical debt](TECHNICAL_DEBT.md). The latest recorded baseline has a passing frontend build, one existing lint warning, and one backend test failure for an Ollama status-message expectation.
