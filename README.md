# 🤖 Autonomous CI/CD Healing Agent

> **Production-ready multi-agent system that automatically detects, classifies, and fixes CI/CD failures using LLM-powered code repair.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Supported Bug Types](#supported-bug-types)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [Team](#team)

---

## 🎯 Overview

The **CI/CD Healing Agent** is an autonomous system that:

1. ✅ Clones any GitHub repository
2. ✅ Auto-detects project type (Python/Node.js)
3. ✅ Installs dependencies automatically
4. ✅ Discovers and runs test files
5. ✅ Detects test failures
6. ✅ Uses multi-agent LLM system to classify bugs
7. ✅ Generates minimal code fixes
8. ✅ Commits fixes with `[AI-AGENT]` prefix
9. ✅ Pushes to a new branch (never touches `main`)
10. ✅ Re-runs tests (max 5 iterations)
11. ✅ Generates structured `results.json`
12. ✅ Displays everything in a beautiful React dashboard

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  (Input Form → Loading State → Results Dashboard)          │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP POST /run-agent
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                           │
│  • Validates input                                          │
│  • Creates branch: TEAMNAME_LEADERNAME_AI_Fix              │
│  • Orchestrates multi-agent pipeline                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Multi-Agent Controller                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. AnalyzerAgent    → Parses error logs             │  │
│  │ 2. ClassifierAgent  → Identifies bug type           │  │
│  │ 3. FixGeneratorAgent→ Generates code fix (LLM)      │  │
│  │ 4. ExecutorAgent    → Re-runs tests                 │  │
│  │ 5. CommitAgent      → Commits with [AI-AGENT]       │  │
│  │ 6. CITrackerAgent   → Tracks iterations             │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Docker Sandbox Executor                        │
│  • Isolated environment                                     │
│  • Safe dependency installation                             │
│  • Test execution (pytest / npm test)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Repository                              │
│  • New branch created                                       │
│  • Commits pushed with [AI-AGENT] prefix                   │
│  • Never touches main branch                                │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Backend
- **Multi-Agent Architecture**: 6 specialized agents working in concert
- **Auto Project Detection**: Supports Python (`requirements.txt`, `setup.py`) and Node.js (`package.json`, `yarn.lock`)
- **Test Discovery**: Automatically finds test files without hardcoding paths
- **LLM-Powered Fixes**: Uses OpenAI GPT-4 for intelligent code repair
- **Rule-Based Fallback**: Heuristic fixes when LLM is unavailable
- **Docker Isolation**: Safe execution environment
- **Structured Output**: Generates `results.json` with complete pipeline data

### Frontend
- **Modern React UI**: Built with TypeScript, TailwindCSS, and shadcn/ui
- **Real-time Loading States**: Visual feedback during pipeline execution
- **Score Visualization**: Recharts radial chart showing performance
- **Responsive Design**: Mobile and desktop optimized
- **Fixes Table**: Detailed breakdown of all detected issues
- **CI/CD Timeline**: Iteration-by-iteration execution log
- **Branch Preview**: Shows generated branch name before running

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** (Functional components + hooks)
- **TypeScript** (Type-safe development)
- **Vite** (Fast build tool)
- **TailwindCSS** (Utility-first styling)
- **shadcn/ui** (Beautiful component library)
- **Recharts** (Score visualization)
- **Axios** (API communication)
- **React Router** (Navigation)
- **Context API** (State management)

### Backend
- **Python 3.12**
- **FastAPI 0.115** (Modern async API framework)
- **Pydantic** (Data validation)
- **GitPython** (Git automation)
- **OpenAI API** (LLM-powered fixes)
- **Docker** (Isolated execution)
- **Uvicorn** (ASGI server)

### DevOps
- **Docker Compose** (Multi-container orchestration)
- **GitHub Actions** (CI/CD ready)
- **Health Checks** (Service monitoring)

---

## 🚀 Setup & Installation

### Prerequisites
- **Docker** & **Docker Compose** (recommended)
- OR **Python 3.12+** and **Node.js 20+**
- **Git**
- **OpenAI API Key** (optional, for LLM fixes)
- **GitHub Token** (optional, for private repos)

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone <YOUR_REPO_URL>
cd <PROJECT_NAME>

# 2. Set environment variables (optional)
echo "OPENAI_API_KEY=sk-..." > .env
echo "GITHUB_TOKEN=ghp_..." >> .env

# 3. Start the full stack
docker-compose up

# 4. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY="sk-..."
export GITHUB_TOKEN="ghp_..."

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Access at http://localhost:5173
```

---

## 📖 Usage

### 1. Via Web Dashboard

1. Open http://localhost:5173
2. Enter:
   - **GitHub Repository URL**: `https://github.com/owner/repo`
   - **Team Name**: `DevTeam`
   - **Leader Name**: `Alice`
3. Click **"Run Agent"**
4. Watch the pipeline execute in real-time
5. View results: summary, score, fixes table, timeline

### 2. Via API

```bash
curl -X POST http://localhost:8000/run-agent \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/owner/repo",
    "team_name": "DevTeam",
    "leader_name": "Alice"
  }'
```

### 3. Branch Naming Convention

The agent creates a branch with this exact format:
```
TEAMNAME_LEADERNAME_AI_Fix
```

Example: `DEVTEAM_ALICE_AI_Fix`

- Uppercase
- Spaces → underscores
- Never pushes to `main`

---

## 🐛 Supported Bug Types

The classifier agent identifies these exact bug types:

| Bug Type | Description | Examples |
|----------|-------------|----------|
| **LINTING** | Code style violations | Trailing whitespace, line too long, missing docstrings |
| **SYNTAX** | Invalid Python/JS syntax | Missing colons, unclosed brackets, unexpected tokens |
| **LOGIC** | Test assertion failures | `AssertionError`, expected vs actual mismatches |
| **TYPE_ERROR** | Type mismatches | `TypeError`, `AttributeError`, wrong argument types |
| **IMPORT** | Missing modules | `ImportError`, `ModuleNotFoundError`, missing packages |
| **INDENTATION** | Python indentation errors | Mixed tabs/spaces, unexpected indent |

---

## 📡 API Documentation

### `POST /run-agent`

**Request Body:**
```json
{
  "repo_url": "https://github.com/owner/repo",
  "team_name": "DevTeam",
  "leader_name": "Alice"
}
```

**Response (200 OK):**
```json
{
  "repo_url": "https://github.com/owner/repo",
  "branch_name": "DEVTEAM_ALICE_AI_Fix",
  "team_name": "DevTeam",
  "leader_name": "Alice",
  "total_failures": 5,
  "total_fixes": 4,
  "iterations_used": 3,
  "ci_status": "PASSED",
  "time_taken": "2m 34s",
  "score": {
    "base": 100,
    "speed_bonus": 10,
    "efficiency_penalty": 0,
    "final_score": 110
  },
  "fixes": [
    {
      "file": "src/utils/parser.py",
      "bug_type": "SYNTAX",
      "line": 42,
      "commit_message": "[AI-AGENT] Fixed SYNTAX error in src/utils/parser.py line 42",
      "status": "Fixed"
    }
  ],
  "timeline": [
    {
      "iteration": 1,
      "status": "FAIL",
      "timestamp": "2026-02-19T10:00:00.000Z"
    },
    {
      "iteration": 2,
      "status": "PASS",
      "timestamp": "2026-02-19T10:01:32.000Z"
    }
  ]
}
```

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "agent": "online",
  "timestamp": "2026-02-19T10:00:00.000Z"
}
```

### `GET /results`

Returns the latest `results.json` file.

---

## 📁 Project Structure

```
.
├── backend/
│   ├── agents/
│   │   ├── analyzer_agent.py       # Parses error logs
│   │   ├── classifier_agent.py     # Classifies bug types
│   │   ├── fix_generator_agent.py  # Generates fixes (LLM)
│   │   ├── executor_agent.py       # Runs tests
│   │   ├── commit_agent.py         # Git commits
│   │   ├── ci_tracker_agent.py     # Tracks iterations
│   │   └── controller.py           # Orchestrates all agents
│   ├── utils/
│   │   ├── git_helper.py           # Git operations
│   │   ├── project_detector.py     # Auto-detect project type
│   │   └── scoring.py              # Score calculation
│   ├── Dockerfile                  # Backend container
│   ├── main.py                     # FastAPI entry point
│   └── requirements.txt            # Python dependencies
├── src/
│   ├── components/
│   │   ├── Header.tsx              # App header
│   │   ├── InputSection.tsx        # Input form
│   │   ├── RunSummaryCard.tsx      # Results summary
│   │   ├── ScorePanel.tsx          # Score visualization
│   │   ├── FixesTable.tsx          # Fixes breakdown
│   │   ├── CICDTimeline.tsx        # Iteration timeline
│   │   └── ui/                     # shadcn components
│   ├── context/
│   │   └── AgentContext.tsx        # Global state
│   ├── types/
│   │   └── agent.ts                # TypeScript types
│   ├── pages/
│   │   └── Index.tsx               # Main page
│   └── App.tsx                     # App root
├── docker-compose.yml              # Multi-container setup
├── results.json                    # Example output
└── README.md                       # This file
```

---

## ⚠️ Known Limitations

1. **GitHub Only**: Currently supports only GitHub repositories
2. **Public Repos**: Private repos require `GITHUB_TOKEN` environment variable
3. **Test Frameworks**: Supports pytest (Python) and Jest/Mocha (Node.js)
4. **Max Iterations**: Limited to 5 retry attempts
5. **LLM Dependency**: Best results require OpenAI API key (falls back to rule-based fixes)
6. **Branch Conflicts**: Does not handle merge conflicts automatically
7. **Large Repos**: May timeout on very large repositories (>1GB)
8. **Test Discovery**: Relies on standard naming conventions (`test_*.py`, `*.test.js`)

---

## 🎓 Scoring System

```
Base Score: 100 points

Bonuses:
  + 10 points if completed in < 5 minutes

Penalties:
  - 2 points per commit over 20

Final Score:
  = Base + Bonuses - Penalties
  = 0 if CI status is FAILED
```

---

## 👥 Team

Built for hackathon by the CI/CD Healing Agent team.

---

## 📄 License

MIT License - feel free to use this project for your hackathon or production needs!

---

## 🙏 Acknowledgments

- **FastAPI** for the amazing async framework
- **OpenAI** for GPT-4 API
- **shadcn/ui** for beautiful React components
- **Recharts** for data visualization
- **Docker** for containerization

---

## 🚀 Deployment

### Deploy Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy the 'dist' folder
```

### Deploy Backend (Railway/Render/Fly.io)

```bash
# Set environment variables:
# - OPENAI_API_KEY
# - GITHUB_TOKEN (optional)

# Deploy using Dockerfile
docker build -t ci-healer-api ./backend
docker run -p 8000:8000 ci-healer-api
```

### Environment Variables

```bash
# Backend
OPENAI_API_KEY=sk-...        # Required for LLM fixes
GITHUB_TOKEN=ghp_...         # Optional, for private repos
LOG_LEVEL=info               # Optional, default: info

# Frontend
VITE_API_URL=http://localhost:8000  # Backend API URL
```

---

**Happy Hacking! 🎉**
