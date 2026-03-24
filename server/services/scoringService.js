/**
 * Scoring Service
 * Computes 5 category scores from raw GitHub data and returns an overall score.
 *
 * Weights:
 *   Activity Score     — 25%
 *   Code Quality Score — 20%
 *   Diversity Score    — 20%
 *   Community Score    — 20%
 *   Hiring Ready Score — 15%
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Clamp a value between 0 and max
 */
const clamp = (value, max = 100) => Math.min(Math.max(Math.round(value), 0), max);

/**
 * Safe logarithm — returns 0 for 0 or negative values
 */
const safeLog = (value) => (value > 0 ? Math.log10(value + 1) : 0);

// ─── Category 1: Activity Score (25%) ───────────────────────────────────────
/**
 * Uses push events from the last 90 days
 * Max 100 points:
 *   - Commits in last 90 days  → up to 60 pts (60+ commits = full score)
 *   - Push frequency           → up to 20 pts (active on 20+ different days = full)
 *   - Longest streak           → up to 20 pts (streak of 14+ days = full)
 */
const computeActivityScore = (events) => {
  if (!events || events.length === 0) return 0;

  const now = new Date();
  const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);

  const recentEvents = events.filter((e) => new Date(e.date) >= ninetyDaysAgo);

  // Total commits in last 90 days
  const totalCommits = recentEvents.reduce((sum, e) => sum + e.commitCount, 0);
  const commitScore = clamp((totalCommits / 60) * 60, 60);

  // Unique active days
  const activeDays = new Set(
    recentEvents.map((e) => new Date(e.date).toISOString().split('T')[0])
  );
  const frequencyScore = clamp((activeDays.size / 20) * 20, 20);

  // Longest streak (consecutive days with at least one push)
  const sortedDays = Array.from(activeDays).sort();
  let longestStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  const streakScore = clamp((longestStreak / 14) * 20, 20);

  return clamp(commitScore + frequencyScore + streakScore);
};

// ─── Category 2: Code Quality Score (20%) ───────────────────────────────────
/**
 * Checks each of the top repos for quality signals
 * Max 100 points across all checks, normalised to 100:
 *   - Has README     → +3 pts per repo
 *   - Has license    → +2 pts per repo
 *   - Has topics     → +2 pts per repo
 *   - Has tests folder → +3 pts per repo
 */
const computeCodeQualityScore = (reposWithDetails) => {
  if (!reposWithDetails || reposWithDetails.length === 0) return 0;

  const ownRepos = reposWithDetails.filter((r) => !r.isForked);
  if (ownRepos.length === 0) return 0;

  let totalPoints = 0;
  const maxPerRepo = 10; // 3 + 2 + 2 + 3

  ownRepos.forEach((repo) => {
    if (repo.hasReadme)             totalPoints += 3;
    if (repo.hasLicense)            totalPoints += 2;
    if (repo.topics && repo.topics.length > 0) totalPoints += 2;
    if (repo.hasTests)              totalPoints += 3;
  });

  const maxPossible = ownRepos.length * maxPerRepo;
  return clamp((totalPoints / maxPossible) * 100);
};

// ─── Category 3: Diversity Score (20%) ──────────────────────────────────────
/**
 * Measures language variety and project type variety
 * Max 100 points:
 *   - Unique languages    → up to 50 pts (10+ languages = full)
 *   - Project categories  → up to 30 pts (web, cli, lib, mobile, data, etc.)
 *   - Repo count          → up to 20 pts (20+ original repos = full)
 */
const computeDiversityScore = (repos) => {
  if (!repos || repos.length === 0) return 0;

  const ownRepos = repos.filter((r) => !r.isForked);

  // Unique languages
  const languages = new Set(
    ownRepos.map((r) => r.language).filter((l) => l && l !== 'Unknown')
  );
  const languageScore = clamp((languages.size / 10) * 50, 50);

  // Project categories from topics
  const categoryKeywords = {
    web:    ['web', 'frontend', 'backend', 'fullstack', 'html', 'css', 'react', 'vue', 'angular', 'nextjs'],
    cli:    ['cli', 'terminal', 'command-line', 'bash', 'shell', 'tool'],
    lib:    ['library', 'lib', 'package', 'npm', 'sdk', 'api', 'framework'],
    mobile: ['android', 'ios', 'mobile', 'flutter', 'react-native', 'swift', 'kotlin'],
    data:   ['machine-learning', 'ml', 'data-science', 'ai', 'deep-learning', 'nlp', 'data'],
    game:   ['game', 'unity', 'pygame', 'gamedev'],
    devops: ['docker', 'kubernetes', 'ci-cd', 'devops', 'terraform', 'aws'],
  };

  const detectedCategories = new Set();
  ownRepos.forEach((repo) => {
    const repoTopics = repo.topics.map((t) => t.toLowerCase());
    const repoLang = (repo.language || '').toLowerCase();

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some((kw) => repoTopics.includes(kw) || repoLang.includes(kw))) {
        detectedCategories.add(category);
      }
    });
  });

  const categoryScore = clamp((detectedCategories.size / 5) * 30, 30);

  // Repo volume
  const repoCountScore = clamp((ownRepos.length / 20) * 20, 20);

  return clamp(languageScore + categoryScore + repoCountScore);
};

// ─── Category 4: Community Score (20%) ──────────────────────────────────────
/**
 * Measures community impact using a log scale (so 1000 stars isn't 10x harder than 100)
 * Max 100 points:
 *   - Total stars received  → up to 50 pts
 *   - Total forks received  → up to 25 pts
 *   - Followers             → up to 25 pts
 */
const computeCommunityScore = (repos, profile) => {
  const ownRepos = (repos || []).filter((r) => !r.isForked);

  const totalStars = ownRepos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = ownRepos.reduce((sum, r) => sum + r.forks, 0);
  const followers  = profile?.followers || 0;

  // Log scale: log10(1001) ≈ 3, so 1000 stars = full score
  const starScore     = clamp((safeLog(totalStars) / safeLog(1000)) * 50, 50);
  const forkScore     = clamp((safeLog(totalForks) / safeLog(500))  * 25, 25);
  const followerScore = clamp((safeLog(followers)  / safeLog(500))  * 25, 25);

  return clamp(starScore + forkScore + followerScore);
};

// ─── Category 5: Hiring Readiness Score (15%) ────────────────────────────────
/**
 * Checks if the profile is recruiter-ready
 * Max 100 points — 20 pts each:
 *   - Bio is filled in
 *   - Website/blog link set
 *   - Public email set
 *   - Has at least 5 public repos
 *   - Account is more than 6 months old
 */
const computeHiringReadyScore = (profile) => {
  if (!profile) return 0;

  let score = 0;

  if (profile.bio && profile.bio.trim().length > 0)   score += 20;
  if (profile.blog && profile.blog.trim().length > 0)  score += 20;
  if (profile.email && profile.email.trim().length > 0) score += 20;
  if (profile.publicRepos >= 5)                         score += 20;

  // Account age — more than 6 months old
  const accountAge = (new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24 * 30);
  if (accountAge >= 6) score += 20;

  return clamp(score);
};

// ─── Overall Score ───────────────────────────────────────────────────────────
/**
 * Weighted average of all 5 categories
 */
const computeOverallScore = (scores) => {
  const weighted =
    scores.activity     * 0.25 +
    scores.codeQuality  * 0.20 +
    scores.diversity    * 0.20 +
    scores.community    * 0.20 +
    scores.hiringReady  * 0.15;

  return clamp(weighted);
};

// ─── Language Distribution ───────────────────────────────────────────────────
/**
 * Returns top languages as [ { name, percent } ] for the bar chart
 */
const computeLanguageDistribution = (repos) => {
  const ownRepos = (repos || []).filter((r) => !r.isForked && r.language && r.language !== 'Unknown');

  const counts = {};
  ownRepos.forEach((r) => {
    counts[r.language] = (counts[r.language] || 0) + 1;
  });

  const total = Object.values(counts).reduce((s, c) => s + c, 0);
  if (total === 0) return [];

  return Object.entries(counts)
    .map(([name, count]) => ({ name, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 8); // top 8 languages
};

// ─── Top Repos ───────────────────────────────────────────────────────────────
/**
 * Returns top 6 repos sorted by stars for the repo list component
 */
const getTopRepos = (repos) => {
  return (repos || [])
    .filter((r) => !r.isForked)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 6)
    .map((r) => ({
      name:        r.name,
      description: r.description,
      language:    r.language,
      stars:       r.stars,
      forks:       r.forks,
      url:         r.url,
      topics:      r.topics,
    }));
};

// ─── Master Scoring Function ─────────────────────────────────────────────────
/**
 * Takes the raw data from githubService.fetchFullProfile()
 * Returns the complete scored report object ready to save to MongoDB
 */
const generateReport = (githubData) => {
  const { profile, repos, reposWithDetails, events } = githubData;

  const scores = {
    activity:    computeActivityScore(events),
    codeQuality: computeCodeQualityScore(reposWithDetails),
    diversity:   computeDiversityScore(repos),
    community:   computeCommunityScore(repos, profile),
    hiringReady: computeHiringReadyScore(profile),
  };

  scores.overall = computeOverallScore(scores);

  return {
    username:    profile.login,
    name:        profile.name,
    avatarUrl:   profile.avatarUrl,
    bio:         profile.bio,
    followers:   profile.followers,
    publicRepos: profile.publicRepos,
    location:    profile.location,
    blog:        profile.blog,
    scores,
    topRepos:    getTopRepos(repos),
    languages:   computeLanguageDistribution(repos),
    cachedAt:    new Date(),
    expiresAt:   new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hour TTL
  };
};

module.exports = {
  generateReport,
  computeActivityScore,
  computeCodeQualityScore,
  computeDiversityScore,
  computeCommunityScore,
  computeHiringReadyScore,
  computeOverallScore,
};
