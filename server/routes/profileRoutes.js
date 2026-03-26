const express = require('express');
const router  = express.Router();
const { getProfile, getCachedProfile, compareProfiles } = require('../controllers/profileController');
const { checkCache } = require('../middleware/cache');

// GET /api/profile/:username
// checkCache runs first — if fresh cache exists it returns immediately
// otherwise getProfile fetches from GitHub
router.get('/:username', checkCache, getProfile);

// GET /api/profile/:username/cached
// Returns cached report only, no GitHub API call
router.get('/:username/cached', getCachedProfile);

// GET /api/compare?u1=username1&u2=username2
// Compare two GitHub profiles side by side
router.get('/compare/profiles', compareProfiles);

module.exports = router;
