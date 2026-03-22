const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check — now also reports DB status
app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.json({
    status: 'ok',
    message: 'Portfolio Evaluator API is running',
    database: dbState[mongoose.connection.readyState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
