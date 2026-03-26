const Report = require('../models/Report');
const { fetchFullProfile } = require('../services/githubService');
const { generateReport }   = require('../services/scoringService');

/**
 * GET /api/profile/:username
 * Main endpoint — checks cache first, fetches fresh if needed
 */
const getProfile = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase().trim();

    // Fetch from GitHub + score
    const githubData = await fetchFullProfile(username);
    const report     = generateReport(githubData);

    // Upsert into MongoDB
    const saved = await Report.findOneAndUpdate(
      { username },
      report,
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ ...saved.toObject(), fromCache: false });

  } catch (error) {
    next(error); // pass to global error handler
  }
};

/**
 * GET /api/profile/:username/cached
 * Returns cached report only — no GitHub API call
 * Returns 404 if no cache exists or if it has expired
 */
const getCachedProfile = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase().trim();

    const cached = await Report.findOne({ username });

    if (!cached) {
      return res.status(404).json({
        error: `No cached report found for "${username}". Fetch the full report first.`,
      });
    }

    if (new Date() > new Date(cached.expiresAt)) {
      return res.status(404).json({
        error: `Cached report for "${username}" has expired. Fetch a fresh report.`,
      });
    }

    res.json({ ...cached.toObject(), fromCache: true });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/compare?u1=username1&u2=username2
 * Fetches and scores two profiles in parallel
 */
const compareProfiles = async (req, res, next) => {
  try {
    const { u1, u2 } = req.query;

    if (!u1 || !u2) {
      return res.status(400).json({
        error: 'Both u1 and u2 query parameters are required. Example: /api/compare?u1=torvalds&u2=gaearon',
      });
    }

    if (u1.toLowerCase() === u2.toLowerCase()) {
      return res.status(400).json({
        error: 'Please provide two different GitHub usernames to compare.',
      });
    }

    // Fetch both profiles in parallel for speed
    const [data1, data2] = await Promise.all([
      fetchFullProfile(u1.toLowerCase().trim()),
      fetchFullProfile(u2.toLowerCase().trim()),
    ]);

    const [report1, report2] = [
      generateReport(data1),
      generateReport(data2),
    ];

    // Save both to cache in parallel
    await Promise.all([
      Report.findOneAndUpdate({ username: report1.username }, report1, { upsert: true, new: true }),
      Report.findOneAndUpdate({ username: report2.username }, report2, { upsert: true, new: true }),
    ]);

    // Determine winner per category
    const categories = ['activity', 'codeQuality', 'diversity', 'community', 'hiringReady', 'overall'];
    const winners = {};
    categories.forEach((cat) => {
      const s1 = report1.scores[cat];
      const s2 = report2.scores[cat];
      if (s1 > s2)      winners[cat] = report1.username;
      else if (s2 > s1) winners[cat] = report2.username;
      else               winners[cat] = 'tie';
    });

    res.json({
      profiles: [report1, report2],
      winners,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, getCachedProfile, compareProfiles };
