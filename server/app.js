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

// Health check route
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

// Day 3 test route — remove this after verifying githubService works
app.get('/api/test/:username', async (req, res) => {
  try {
    const { getUserProfile } = require('./services/githubService');
    const profile = await getUserProfile(req.params.username);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO (Day 6): Mount full profile routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
