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

const clamp = (value, max = 100) => Math.min(Math.max(Math.round(value), 0), max);
const safeLog = (value) => (value > 0 ? Math.log10(value + 1) : 0);

// ─── Category 1: Activity Score (25%) ───────────────────────────────────────
const computeActivityScore = (events) => {
  if (!events || events.length === 0) return 0;

  const now = new Date();
  const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);
  const recentEvents = events.filter((e) => new Date(e.date) >= ninetyDaysAgo);

  const totalCommits = recentEvents.reduce((sum, e) => sum + e.commitCount, 0);
  const commitScore = clamp((totalCommits / 60) * 60, 60);

  const activeDays = new Set(
    recentEvents.map((e) => new Date(e.date).toISOString().split('T')[0])
  );
  const frequencyScore = clamp((activeDays.size / 20) * 20, 20);

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
const computeCodeQualityScore = (reposWithDetails) => {
  if (!reposWithDetails || reposWithDetails.length === 0) return 0;

  const ownRepos = reposWithDetails.filter((r) => !r.isForked);
  if (ownRepos.length === 0) return 0;

  let totalPoints = 0;
  const maxPerRepo = 10;

  ownRepos.forEach((repo) => {
    if (repo.hasReadme)                          totalPoints += 3;
    if (repo.hasLicense)                         totalPoints += 2;
    if (repo.topics && repo.topics.length > 0)   totalPoints += 2;
    if (repo.hasTests)                           totalPoints += 3;
  });

  const maxPossible = ownRepos.length * maxPerRepo;
  return clamp((totalPoints / maxPossible) * 100);
};

// ─── Category 3: Diversity Score (20%) ──────────────────────────────────────
const computeDiversityScore = (repos) => {
  if (!repos || repos.length === 0) return 0;

  const ownRepos = repos.filter((r) => !r.isForked);

  const languages = new Set(
    ownRepos.map((r) => r.language).filter((l) => l && l !== 'Unknown')
  );
  const languageScore = clamp((languages.size / 10) * 50, 50);

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
  const repoCountScore = clamp((ownRepos.length / 20) * 20, 20);

  return clamp(languageScore + categoryScore + repoCountScore);
};

// ─── Category 4: Community Score (20%) ──────────────────────────────────────
const computeCommunityScore = (repos, profile) => {
  const ownRepos = (repos || []).filter((r) => !r.isForked);

  const totalStars = ownRepos.reduce((sum, r) => sum + r.stars, 0);
  const totalForks = ownRepos.reduce((sum, r) => sum + r.forks, 0);
  const followers  = profile?.followers || 0;

  const starScore     = clamp((safeLog(totalStars) / safeLog(1000)) * 50, 50);
  const forkScore     = clamp((safeLog(totalForks) / safeLog(500))  * 25, 25);
  const followerScore = clamp((safeLog(followers)  / safeLog(500))  * 25, 25);

  return clamp(starScore + forkScore + followerScore);
};

// ─── Category 5: Hiring Readiness Score (15%) ────────────────────────────────
const computeHiringReadyScore = (profile) => {
  if (!profile) return 0;

  let score = 0;
  if (profile.bio && profile.bio.trim().length > 0)    score += 20;
  if (profile.blog && profile.blog.trim().length > 0)   score += 20;
  if (profile.email && profile.email.trim().length > 0) score += 20;
  if (profile.publicRepos >= 5)                          score += 20;

  const accountAge = (new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24 * 30);
  if (accountAge >= 6) score += 20;

  return clamp(score);
};

// ─── Overall Score ───────────────────────────────────────────────────────────
const computeOverallScore = (scores) => {
  const weighted =
    scores.activity    * 0.25 +
    scores.codeQuality * 0.20 +
    scores.diversity   * 0.20 +
    scores.community   * 0.20 +
    scores.hiringReady * 0.15;

  return clamp(weighted);
};

// ─── Language Distribution ───────────────────────────────────────────────────
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
    .slice(0, 8);
};

// ─── Top Repos ───────────────────────────────────────────────────────────────
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

// ─── Heatmap Data ─────────────────────────────────────────────────────────────
/**
 * Builds a { 'YYYY-MM-DD': commitCount } map for the last 364 days (52 weeks)
 * Days with no activity are set to 0.
 */
const computeHeatmapData = (events) => {
  const heatmap = {};

  // Seed every day in the last 52 weeks with 0
  const now = new Date();
  for (let i = 363; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    heatmap[key] = 0;
  }

  // Fill in actual commit counts from events
  (events || []).forEach((event) => {
    const key = new Date(event.date).toISOString().split('T')[0];
    if (key in heatmap) {
      heatmap[key] = (heatmap[key] || 0) + event.commitCount;
    }
  });

  return heatmap;
};

// ─── Master Scoring Function ─────────────────────────────────────────────────
const generateReport = (githubData) => {
  const { profile, repos, reposWithDetails, events } = githubData;

  console.log('Events passed to scoring:', events.length);
  const heatmapData = computeHeatmapData(events);
  const nonZeroDays = Object.entries(heatmapData).filter(([, v]) => v > 0);
  console.log('Heatmap non-zero days:', nonZeroDays.length);
  console.log('Sample non-zero entries:', nonZeroDays.slice(0, 5));
  
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
    heatmapData: computeHeatmapData(events),
    cachedAt:    new Date(),
    expiresAt:   new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
};

module.exports = {
  generateReport,
  computeHeatmapData,
  computeActivityScore,
  computeCodeQualityScore,
  computeDiversityScore,
  computeCommunityScore,
  computeHiringReadyScore,
  computeOverallScore,
};
