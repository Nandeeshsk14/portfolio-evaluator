const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const connectDB  = require('./config/db');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler  = require('./middleware/errorHandler');

dotenv.config({ path: __dirname + '/.env' });

const app = express();

// Connect to MongoDB Atlas
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
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

// Profile routes — /api/profile/:username
app.use('/api/profile', profileRoutes);

// Compare route — /api/compare?u1=x&u2=y
app.use('/api/compare', (req, res, next) => {
  req.query.u1 && req.query.u2
    ? require('./controllers/profileController').compareProfiles(req, res, next)
    : res.status(400).json({ error: 'Provide u1 and u2 query params' });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
