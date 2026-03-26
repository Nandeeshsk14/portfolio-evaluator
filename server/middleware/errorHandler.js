/**
 * Global error handling middleware
 * Must be the LAST middleware registered in app.js
 * Catches all errors passed via next(error)
 */
const errorHandler = (err, req, res, next) => {
  // GitHub API 404 — user not found
  if (err.status === 404) {
    return res.status(404).json({
      error: `GitHub user "${req.params.username}" not found. Please check the username and try again.`,
    });
  }

  // GitHub API rate limit exceeded
  if (err.status === 403 || err.message?.includes('rate limit')) {
    return res.status(429).json({
      error: 'GitHub API rate limit reached. Please wait a few minutes and try again.',
    });
  }

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Data validation failed.',
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // MongoDB duplicate key (shouldn't normally reach here with upsert, but just in case)
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'A report for this user already exists.',
    });
  }

  // Network / DNS errors (e.g. no internet, GitHub down)
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: 'Could not reach GitHub API. Please check your connection and try again.',
    });
  }

  // Generic fallback
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Something went wrong on the server. Please try again.',
  });
};

module.exports = errorHandler;
