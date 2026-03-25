const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    message: 'Portfolio Evaluator API is running',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Day 3–5 test route — fetch, score, save to MongoDB, return report
// Remove after Day 6 when proper routes are mounted
app.get('/api/test/:username', async (req, res) => {
  try {
    const Report = require('./models/Report');
    const { fetchFullProfile } = require('./services/githubService');
    const { generateReport }   = require('./services/scoringService');
    const { checkCache }       = require('./middleware/cache');

    const username = req.params.username.toLowerCase().trim();

    // Check cache first
    const cached = await Report.findOne({ username });
    if (cached && new Date() < new Date(cached.expiresAt)) {
      return res.json({ ...cached.toObject(), fromCache: true });
    }

    // Fetch fresh data from GitHub and score it
    const githubData = await fetchFullProfile(username);
    const report     = generateReport(githubData);

    // Save to MongoDB (upsert — update if exists, insert if not)
    const saved = await Report.findOneAndUpdate(
      { username },
      report,
      { upsert: true, new: true }
    );

    res.json({ ...saved.toObject(), fromCache: false });

  } catch (error) {
    // Handle GitHub 404 — user doesn't exist
    if (error.status === 404) {
      return res.status(404).json({ error: `GitHub user "${req.params.username}" not found` });
    }
    res.status(500).json({ error: error.message });
  }
});

// TODO (Day 6): Mount full profile routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
