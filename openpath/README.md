# OpenPath — AI-Powered Open-Source Onboarding Platform

> **From curious beginner to confident contributor.**  
> *“Most tools help you find an issue. OpenPath helps you understand whether it may fit your skills—and how to begin.”*

OpenPath is a full-stack developer product built to help students and first-time contributors transition from curiosity to making their first practical contribution to real open-source software.

---

## 🌟 Key Highlights & User Journey

1. **Open Source 101 Guide**: Clear, bite-sized explanations of core GitHub primitives (Repositories, Issues, Forks, Branches, Commits, Pull Requests, Code Reviews) with real-world analogies. Skippable for experienced users.
2. **Real GitHub Issue Discovery**: Live search of public GitHub issues via the GitHub REST API. Filter by keywords, languages (JavaScript, Python, TypeScript, Rust, Go, HTML/CSS, etc.), labels (`good first issue`, `help wanted`, `documentation`), and sort orders. No mock data.
3. **AI Issue Explainer (English & Hinglish)**: Breaks down selected issues into plain English or conversational Hinglish (`हिंदी + English` mix tailored for Indian & global developer communities). Highlights what is broken, what the maintainer expects, and provides a **Jargon Buster** for unfamiliar terms.
4. **Skill Readiness Card**: Contributor enters their skills (React, Python, Git, etc., persisted in local storage). Compares skills with issue requirements, highlights skills to learn, and offers a cautious difficulty estimate with an explicit disclaimer.
5. **Interactive Contribution Roadmap**: 8-step practical checklist from reading `CONTRIBUTING.md` and commenting politely on the issue to testing locally and preparing a clean PR referencing `#issue_number`. Interactive checkboxes with local progress persistence.
6. **Verified Programs Directory**: Curated directory of official mentorship programs and hackathons (Google Summer of Code, Hacktoberfest, Outreachy, LFX Mentorship, MLH Fellowship, GirlScript Summer of Code, Season of Docs) with official verified links.
7. **Honest AI Fallback**: If no AI provider key is configured, the application runs cleanly and displays an honest setup guide with copy-paste `.env` snippets. It never returns fabricated AI responses.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19 + Vite 8 + JavaScript
- **Styling**: Custom CSS design system (editorial typography, warm off-white `#FAF8F5`, deep charcoal hero `#111215`, restrained lime `#D2F824` / warm amber `#F59E0B` accents, thin borders, GitHub contribution grid accents)
- **Icons**: Lucide React
- **Backend**: Node.js + Express
- **External Data**: GitHub REST API (`/search/issues` and `/repos/:owner/:repo/issues/:id`)
- **AI Integration**: Configurable provider support via clean adapter pattern (Google Gemini, OpenAI, Groq, or OpenAI-compatible endpoints)

---

## 📁 Project Structure

```text
openpath/
├── public/
│   ├── favicon.svg          # OpenPath branching git commit icon
│   └── icons.svg
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ai.js        # AI explanation & status endpoints
│   │   │   ├── health.js    # System health & API tier check
│   │   │   └── issues.js    # GitHub issue search & detail endpoints
│   │   ├── services/
│   │   │   ├── aiService.js # Configurable adapter (Gemini, OpenAI, Groq)
│   │   │   └── githubService.js # GitHub REST API client & rate-limit handler
│   │   └── index.js         # Express server entry point
│   ├── .env.example         # Backend environment variables template
│   └── package.json
├── src/
│   ├── components/
│   │   ├── AiExplainerModal.jsx   # AI explanation drawer with Hinglish toggle
│   │   ├── ContributionRoadmap.jsx# Interactive 8-step checklist
│   │   ├── Footer.jsx             # Polished developer startup footer
│   │   ├── FrictionPoints.jsx     # "Why beginners get stuck" section
│   │   ├── Hero.jsx               # Deep charcoal hero with journey visual
│   │   ├── HowItWorks.jsx         # 3-step structured path
│   │   ├── IssueCard.jsx          # GitHub issue card with labels and badges
│   │   ├── IssueDiscovery.jsx     # Search, language filters, and skeletons
│   │   ├── JourneyVisual.jsx      # Pipeline graphic (Skills ➔ Issue ➔ AI ➔ PR)
│   │   ├── Navbar.jsx             # Navigation and live health badge
│   │   ├── OpenSource101.jsx      # Interactive beginner concepts & analogies
│   │   ├── OpportunitiesSection.jsx # Curated programs & fellowships
│   │   ├── SetupModal.jsx         # System health & API setup walkthrough
│   │   └── SkillReadinessCard.jsx # Skills manager and match comparison
│   ├── data/
│   │   ├── openSourceGuide.js     # Git concepts and etiquette data
│   │   └── opportunities.js       # Verified fellowship & program details
│   ├── services/
│   │   └── api.js                 # Frontend API client
│   ├── App.jsx                    # Root component orchestrator
│   ├── index.css                  # OpenPath bespoke design system
│   └── main.jsx                   # Vite entry point
├── .env.example                   # Root environment template
├── index.html                     # HTML head with fonts and metadata
├── package.json                   # Root scripts & dependencies
└── vite.config.js                 # Vite configuration with /api proxy
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
Install dependencies for both the frontend and backend:

```bash
# In project root:
npm install

# In server directory:
cd server
npm install
cd ..
```

### 3. Environment Variables (Optional but Recommended)
Copy the example environment file:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```ini
PORT=5000

# Recommended: Add a personal GitHub token to raise rate limit from 10 req/min to 5,000 req/hr
# (Create a free fine-grained or classic token at https://github.com/settings/tokens)
GITHUB_TOKEN=

# AI Provider Configuration (Choose 'gemini', 'openai', or 'groq')
AI_PROVIDER=gemini
AI_MODEL=gemini-2.5-flash

# Get a free key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_key_here
```

> **Note on AI Keys:** If no key is set, the application runs in demonstration mode. Issue search, filtering, skill assessment heuristics, and the 8-step roadmap remain fully functional. When an issue is selected for AI explanation, an honest setup prompt is shown rather than fabricated output.

### 4. Running the Application

To run **both** the backend API server and frontend Vite server concurrently:

```bash
npm run dev
```

Alternatively, run each in separate terminal windows:

```bash
# Terminal 1: Backend Express Server (port 5000)
npm run dev:server

# Terminal 2: Frontend Vite App (port 5173)
npm run dev:client
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🧪 Verification & Endpoints

### Backend API Endpoints:
- `GET /api/health` — Checks server uptime, GitHub token status, and AI provider status.
- `GET /api/issues/search?q=...&language=...&label=...&page=...` — Searches public GitHub issues with rate-limit safety.
- `GET /api/issues/details?owner=...&repo=...&issue_number=...` — Fetches full issue description and repository stars/forks/metadata.
- `GET /api/ai/status` — Returns AI provider configuration status.
- `POST /api/ai/explain` — Grounded AI analysis with English/Hinglish language support.

### Production Build:
```bash
npm run build
```
Builds optimized production assets to the `dist/` directory.

---

## 📜 Design Principles

- **No AI Slop / Excessive Gradients**: Uses intentional typography, clean lines, and an editorial developer aesthetic.
- **Honesty First**: Never simulates mock GitHub data or fakes AI results. When APIs are rate-limited or unconfigured, the user is given helpful, transparent instructions.
- **Actionable Roadmaps**: Focuses on what to do *after* finding an issue—the part where 90% of beginners get stuck.

---

## 📄 License
MIT © OpenPath Team.
