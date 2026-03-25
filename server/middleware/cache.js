const Report = require('../models/Report');

/**
 * Cache middleware
 * Checks MongoDB for a fresh report before hitting the GitHub API.
 * If a cached report exists and hasn't expired, it's returned immediately.
 * If not, the request continues to the controller which fetches fresh data.
 */
const checkCache = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase().trim();

    const cached = await Report.findOne({ username });

    if (cached) {
      const isExpired = new Date() > new Date(cached.expiresAt);

      if (!isExpired) {
        // Serve from cache — no GitHub API call needed
        return res.json({
          ...cached.toObject(),
          fromCache: true,
        });
      }

      // Expired — delete it so a fresh one gets saved later
      await Report.deleteOne({ username });
    }

    // No valid cache — continue to the controller
    next();

  } catch (error) {
    // Cache check failed — don't crash, just skip cache and fetch fresh
    console.error('Cache middleware error:', error.message);
    next();
  }
};

module.exports = { checkCache };
