# Developer Portfolio Evaluator

A full-stack MERN application that analyses any public GitHub profile and generates a detailed scorecard covering activity, code quality, project diversity, community impact, and hiring readiness — all from the free GitHub API.

## Live Demo
> Coming soon after deployment (Vercel + Render)

## Features
- GitHub username search with live profile data
- 5-category scoring engine (Activity, Code Quality, Diversity, Community, Hiring Readiness)
- Visual score card with radar chart, heatmap, and language distribution
- Shareable report URLs
- MongoDB caching (24-hour TTL)
- Compare Mode (bonus) — two profiles side by side

## Tech Stack
| Layer | Tool |
|-------|------|
| Frontend | React 18 + Vite, React Router v6, Chart.js, Axios |
| Backend | Node.js + Express, Octokit (GitHub SDK), node-cron |
| Database | MongoDB Atlas + Mongoose |
| Deploy | Vercel (frontend) + Render (backend) |

## Project Structure
```
portfolio-evaluator/
├── client/          ← React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── utils/
├── server/          ← Node.js + Express backend
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   └── config/
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- Git
- MongoDB Atlas account (free tier)
- GitHub Personal Access Token

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/portfolio-evaluator.git
cd portfolio-evaluator

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Set up environment variables
cd server && cp .env.example .env   # fill in your values
cd ../client && cp .env.example .env

# Run backend (Terminal 1)
cd server && npm run dev

# Run frontend (Terminal 2)
cd client && npm run dev
```

### Environment Variables

**server/.env**
```
MONGODB_URI=your_mongodb_atlas_connection_string
GITHUB_TOKEN=your_github_personal_access_token
PORT=5000
JWT_SECRET=your_random_secret
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment
- **Frontend**: Vercel — connect GitHub repo, set `VITE_API_URL` env var
- **Backend**: Render — create Web Service, set all `.env` variables

## Submission Deadline
April 10, 2025

## Author
Built as part of the Internship Mini Project program.
