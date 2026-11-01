# OpenPath Developer Setup and Collaboration

## Repository baseline

- Canonical repo: `https://github.com/aayushi2882/openpath.git`
- Default/release branch: `main` (`origin/HEAD -> origin/main`).
- Integration branch: `main`, verified as the repository default (`origin/HEAD -> origin/main`).
- Developer branches: `feature/ai-backend` and `feature/frontend`, both based on the same Phase 0 documentation history.
- Worktrees: `/Users/manas/Code/Projects /openpath/openpath-ai-backend` and `/Users/manas/Code/Projects /openpath/openpath-frontend`, siblings of the primary `CODE/` checkout.
- `main` is the shared integration and stable branch. Developers do not work directly on `main`.

The feature branches are published to `origin` after verifying their histories. Current installed dependencies are independent: backend packages in Developer A's worktree; frontend packages in Developer B's worktree. Do not force-push.

## Worktree commands

The two worktrees are already created. For future local clones, first fetch and check branch/worktree state; then create a worktree only if its branch and path are not already in use:

```bash
git fetch origin
git worktree list
git worktree add ../openpath-ai-backend feature/ai-backend
git worktree add ../openpath-frontend feature/frontend
```

Verify:

```bash
git -C ../openpath-ai-backend branch --show-current
git -C ../openpath-frontend branch --show-current
git worktree list
```

Verified branch names: `feature/ai-backend` and `feature/frontend`. Each worktree has its own checkout; Git metadata and object storage are shared by design. Keep local `.env` files out of Git; worktrees do not automatically copy ignored environment files.

## File ownership

| Developer | Owns | Avoid editing |
|---|---|---|
| A — AI/backend | `server/`, backend tests, backend configuration/docs; backend architecture and API behavior. | `src/`, React components, page/UI behavior, CSS, frontend dependencies. |
| B — frontend | `src/`, frontend tests, frontend-facing configuration/docs and UI. | `server/`, backend AI/provider logic, middleware, backend dependencies. |
| Shared | API contract, current-state/architecture/roadmap docs, integration and release checks. | Coordinate before editing shared files or changing request/response contracts. |

If a task crosses ownership, document the endpoint/request/response/status/error contract and hand it to the other developer; do not edit their worktree files.

## Branch and PR workflow

1. Fetch before planning integration: `git fetch origin`.
2. Review the incoming branch against main (`git log --oneline --left-right origin/main...feature/<owner>` and `git diff --stat origin/main...feature/<owner>`) before integration.
3. Commit only files owned by the branch author. Use focused messages such as `feat(ai): ...`, `fix(api): ...`, `test(ai): ...`, or `feat(frontend): ...`.
4. Push a branch only after checking whether its remote counterpart exists and contains work. Never force-push or reset a shared branch.
5. Open a PR from the feature branch to `main`, include tests and API contract changes, and request review from the other developer.
6. Resolve conflicts in the feature branch after inspecting both sides. Do not discard another developer's changes; ask for coordination when ownership overlaps.
7. Run the relevant checks in the feature worktree. After integration, run frontend build/lint and backend tests. Merge only through an approved PR to `main`.

## Synchronize a feature worktree with approved main changes

Run these commands from that developer's worktree. Inspect the incoming commits and diff first; then merge the shared main branch without rewriting the published feature branch:

```bash
git fetch origin
git log --oneline --left-right feature/ai-backend...origin/main
git diff --stat feature/ai-backend...origin/main
git merge --no-ff origin/main
```

In Developer B's worktree, substitute `feature/frontend` in the inspection commands. If the merge has conflicts, inspect both sides and coordinate with the owner of the overlapping files; do not discard changes to force a clean merge.

## API integration procedure

Current client calls are centralized in `src/services/api.js`; Express routes live under `server/src/routes/`. Before changing a contract, record method/path, request shape, success response, error response/status, timeout behavior, and authentication expectations in the owning PR or shared contract document. Frontend work integrates against that contract and uses the Vite `/api` proxy; do not assume undocumented response fields.

## Known baseline

See `CURRENT_STATE.md`, `FEATURE_AUDIT.md`, and `TECHNICAL_DEBT.md`. Current verification: build passed; lint has one warning; server tests are 12/13 due to a stale Ollama status expectation. AI was unreachable during smoke checks; live public GitHub requests succeeded unauthenticated.
