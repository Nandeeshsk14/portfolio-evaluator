# Developer Portfolio Evaluator

A full-stack MERN application that analyses any public GitHub profile and generates a detailed scorecard covering activity, code quality, project diversity, community impact, and hiring readiness — all computed from the free GitHub API.

## 🔗 Live Demo

- **Frontend (Vercel):** https://portfolio-evaluator-14.vercel.app/
- **Backend API (Render):** https://portfolio-evaluator-api.onrender.com/api/health



## ✨ Features

- **GitHub username search** — fetch any public profile instantly
- **5 scoring categories** — Activity (25%), Code Quality (20%), Diversity (20%), Community (20%), Hiring Readiness (15%)
- **Visual score card** — animated circular progress ring + category bars
- **Radar chart** — spider chart showing all 5 categories at once
- **Contribution heatmap** — GitHub-style calendar grid of push activity
- **Language distribution** — horizontal bar chart with GitHub language colours
- **Top repositories** — repo cards with language dots and topic pills
- **Shareable URLs** — every report lives at `/report/:username`
- **24-hour MongoDB cache** — repeat lookups are instant, no wasted API calls
- **Compare mode** — enter two usernames, see overlaid radar charts and per-category winners
- **Responsive design** — works on mobile and desktop

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite, React Router v6, Chart.js, Axios |
| Backend | Node.js + Express, Octokit (GitHub SDK), node-cron |
| Database | MongoDB Atlas + Mongoose (TTL index for auto-expiry) |
| Deploy | Vercel (frontend) + Render (backend) |

## 📁 Project Structure

```
portfolio-evaluator/
├── client/                    ← React + Vite frontend
│   ├── public/
│   │   └── vercel.json        ← SPA redirect config
│   └── src/
│       ├── components/
│       │   ├── ErrorState.jsx
│       │   ├── HeatMap.jsx
│       │   ├── LanguageChart.jsx
│       │   ├── Navbar.jsx
│       │   ├── RadarChart.jsx
│       │   ├── RepoList.jsx
│       │   ├── ScoreCard.jsx
│       │   ├── SearchBar.jsx
│       │   ├── ShareCard.jsx
│       │   └── Skeleton.jsx
│       ├── pages/
│       │   ├── Compare.jsx
│       │   ├── Home.jsx
│       │   ├── NotFound.jsx
│       │   └── Report.jsx
│       └── utils/
│           ├── api.js
│           └── useMeta.js
└── server/                    ← Node.js + Express backend
    ├── config/db.js
    ├── controllers/profileController.js
    ├── middleware/
    │   ├── cache.js
    │   └── errorHandler.js
    ├── models/Report.js
    ├── routes/profileRoutes.js
    └── services/
        ├── githubService.js
        └── scoringService.js
```

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- Git
- MongoDB Atlas account (free tier)
- GitHub Personal Access Token

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/portfolio-evaluator.git
cd portfolio-evaluator

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### Environment Variables

Create `server/.env`:
```
MONGODB_URI=your_mongodb_standard_connection_string
GITHUB_TOKEN=your_github_personal_access_token
PORT=5000
JWT_SECRET=your_random_secret
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### Running Locally

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api/health

## 🚀 Deployment

- **Frontend:** Vercel — set `VITE_API_URL` to your Render backend URL
- **Backend:** Render — set all `.env` variables in the dashboard

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server + database health check |
| GET | `/api/profile/:username` | Fetch and score a GitHub profile |
| GET | `/api/profile/:username/cached` | Return cached report only |
| GET | `/api/compare?u1=x&u2=y` | Compare two GitHub profiles |

## 🧮 Scoring Algorithm

| Category | Weight | Signals Used |
|---|---|---|
| Activity | 25% | Commits last 90 days, push frequency, streak |
| Code Quality | 20% | README, license, topics, tests folder per repo |
| Diversity | 20% | Unique languages, project categories, repo count |
| Community | 20% | Stars, forks, followers (log scale) |
| Hiring Ready | 15% | Bio, website, email, repo count, account age |

## 📋 Submission Checklist

- [x] Code pushed to public GitHub repository
- [x] README with project description, setup steps, and live demo link
- [x] `.env` files in `.gitignore` — not committed
- [x] No hardcoded secrets in codebase
- [x] Search works for any valid GitHub username
- [x] All 5 score categories computed and displayed
- [x] Shareable URL works and loads report directly
- [x] Error handling for invalid usernames and API failures
- [x] MongoDB caching confirmed (second request is faster)
- [x] Frontend live on Vercel
- [x] Backend live on Render
- [x] CORS configured correctly
- [x] Compare mode working

## 👤 Author

Built as part of the Internship Mini Project — March–April 2025.
