# OpenPath

OpenPath helps students and first-time contributors find public GitHub repositories, explore their open issues, and understand how an issue might fit their skills and experience. Its local AI assistant explains issue details and suggests contribution steps using Ollama on the backend machine.

## Contents

- [Features](#features)
- [How it works](#how-it-works)
- [Technology](#technology)
- [Prerequisites](#prerequisites)
- [Install and configure](#install-and-configure)
- [Run locally](#run-locally)
- [Tests and build](#tests-and-build)
- [API routes](#api-routes)
- [Troubleshooting](#troubleshooting)
- [Limitations and security](#limitations-and-security)
- [Future improvements](#future-improvements)

## Features

- Search public GitHub repositories or enter a GitHub repository URL. OpenPath loads repository metadata, its README, contribution guidance when available, and real open issues.
- Filter repository issues and ask Ollama to rank up to three supplied issues against your stated skills and experience. Recommendations refer only to issues returned by GitHub.
- Request an English or Hinglish explanation of an issue, including a summary, expected outcome, technical terms, skill-readiness estimate, investigation guidance, and a six-step issue-specific roadmap.
- Use the separate eight-step contribution checklist. Skills, experience, and checklist progress are saved in browser local storage.
- Browse a curated directory of open-source programs and fellowships, and use the Open Source 101 guide to learn GitHub concepts.
- **Website Issue Detective (experimental):** capture a public webpage and ask the local Ollama model to suggest evidence-based potential improvements. This requires Playwright's Chromium browser. Findings are model suggestions, not confirmed defects, and are not published automatically.
- Check backend, Ollama, and configured-model status in the application.

## How it works

1. Search for a public repository or enter its GitHub URL.
2. OpenPath's Express backend fetches repository metadata, available onboarding documents, and real open issues from the GitHub REST API.
3. Set your skills and experience, then browse issues or request local Ollama recommendations.
4. Select an issue to request an explanation and contribution roadmap. The backend sends the supplied issue and repository metadata to Ollama and validates its structured response. The model does not inspect repository source files.

## Technology

- **Frontend:** React 19, Vite 8, JavaScript, and Lucide React.
- **Backend:** Node.js, Express 4, and native `fetch` for HTTP requests.
- **Repository and issue data:** GitHub REST API.
- **Local inference:** Ollama's HTTP API (`/api/chat` and `/api/tags`), default model `gemma4:e2b`.
- **Website capture:** Playwright with Chromium (used by the optional Website Issue Detective).

## Prerequisites

- Windows 10 or later with PowerShell.
- Git.
- Node.js `^20.19.0` or `>=22.12.0` (required by the installed Vite 8 version) and npm.
- Ollama installed on the machine running the backend.
- Enough system memory and compute for the selected local model. Inference can be slow on CPU-only hardware.

## Install and configure

Clone the repository and install both sets of dependencies:

```powershell
git clone https://github.com/aayushi2882/openpath.git
Set-Location openpath
npm install
npm --prefix server install
```

Install Ollama from its official Windows installer, then download the model configured by default in the backend:

```powershell
irm https://ollama.com/install.ps1 | iex
ollama pull gemma4:e2b
ollama list
```

The Ollama Windows app normally starts its local service. If it is not running, start it in a separate PowerShell window with `ollama serve`.

Create the backend environment file from the example if one does not already exist:

```powershell
if (-not (Test-Path server/.env)) { Copy-Item server/.env.example server/.env }
```

For Website Issue Detective, install Playwright's Chromium browser once:

```powershell
Push-Location server
npx playwright install chromium
Pop-Location
```

## Environment configuration

Use `server/.env.example` as the backend configuration reference:

| Variable | Default/example | Purpose |
| --- | --- | --- |
| `PORT` | `5501` | Express backend port; Vite's development proxy reads this value. |
| `GITHUB_TOKEN` | Empty | Optional server-side token for higher GitHub API rate limits. Public repository access works without it, subject to GitHub's unauthenticated limits. |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Base URL for the local Ollama service. |
| `OLLAMA_MODEL` | `gemma4:e2b` | Model used for issue analysis and website image analysis. |
| `WEBSITE_ANALYSIS_TIMEOUT_MS` | `25000` | Optional website page-navigation timeout, clamped by the backend. |

No hosted AI API key is required or used. The root `.env.example` documents the optional `VITE_API_BASE_URL` for connecting the browser directly to a backend; normally, leave it unset to use the Vite proxy. Keep tokens and other secrets in `.env` files, never in `VITE_*` variables or committed files.

## Run locally

From the repository root, either start both applications together:

```powershell
npm run dev
```

Or use separate PowerShell terminals:

```powershell
# Terminal 1: Express API at http://localhost:5501
npm run dev:server
```

```powershell
# Terminal 2: Vite frontend at http://localhost:5173
npm run dev:client
```

Open the Vite URL shown in the terminal. The development server proxies `/api` requests to the backend port.

## Tests and build

Run the backend tests and frontend lint/build scripts from the repository root:

```powershell
npm --prefix server test
npm run lint
npm run build
```

The backend test script uses Node's built-in test runner. There is no separate frontend test script in `package.json`.

## API routes

| Method and route | Purpose |
| --- | --- |
| `GET /api/health` | Backend health, GitHub token status, and Ollama/model readiness. |
| `GET /api/repositories/search?q=...` | Search public GitHub repositories. |
| `GET /api/repositories/:owner/:repo` | Fetch repository metadata, README, and available contribution guide. |
| `GET /api/repositories/:owner/:repo/issues` | Fetch open issues scoped to a repository. |
| `GET /api/issues/search` | Search public GitHub issues. |
| `GET /api/issues/details?owner=...&repo=...&issue_number=...` | Fetch issue details and related repository metadata. |
| `GET /api/ai/status` | Check Ollama reachability and whether the configured model is installed. |
| `GET /api/ai/models` | List installed Ollama models. |
| `POST /api/ai/recommend` | Rank real issues supplied in the request. |
| `POST /api/ai/explain` | Explain a supplied issue in English or Hinglish. |
| `POST /api/website-analysis/analyze` | Capture a public webpage and return observations and potential findings. |

## Troubleshooting

- **Ollama is unreachable:** Start the Ollama Windows app or run `ollama serve` in a separate terminal. Check that `OLLAMA_BASE_URL` points to the service, usually `http://localhost:11434`.
- **Configured model is missing:** Run `ollama pull gemma4:e2b`, or pull the model named by `OLLAMA_MODEL`. The health and AI status endpoints report the configured model and installed models.
- **Port is already in use:** Set `PORT` in `server/.env` to an unused port. Vite reads the backend port for its proxy; restart both development servers after changing it.
- **Dependencies fail to install:** Confirm Node.js meets the Vite requirement above, then run `npm install` at the root and `npm --prefix server install` again.
- **GitHub rate limit errors:** Add an optional `GITHUB_TOKEN` to `server/.env` and restart the backend. Keep the token private.
- **Website analysis cannot launch Chromium:** Run `npx playwright install chromium` from the `server` directory.

## Limitations and security

- Local model latency and quality depend on the host machine and selected model. Treat skill assessments and AI suggestions as guidance; verify issue details, repository paths, setup instructions, and tests against the project itself.
- GitHub may rate-limit unauthenticated requests. A server-side `GITHUB_TOKEN` can raise available limits.
- Ollama's local API is intended for a trusted local machine/network. Do not expose an unauthenticated Ollama service or an arbitrary `OLLAMA_BASE_URL` to the public internet; remote deployments need an authenticated, network-isolated setup.
- `.env` files are ignored by Git. Do not commit them or put secrets in frontend variables. The committed `.env.example` files contain placeholders only.
- Website findings are unconfirmed model inferences. OpenPath does not create or publish GitHub issues from them.

## Future improvements

These are ideas, not current features:

- Add browser-based end-to-end tests for the frontend and complete repository-to-inference flow.
- Add an in-app selector for installed Ollama models; currently, choose a model through the backend's `OLLAMA_MODEL` setting.
- Add additional checks for maintainer activity and whether an issue already has an active pull request.
