const { Octokit } = require('@octokit/rest');

// Initialise Octokit once with the GitHub token from .env
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Fetch basic profile info for a GitHub user
 * Endpoint: GET /users/:username
 */
const getUserProfile = async (username) => {
  const { data } = await octokit.rest.users.getByUsername({ username });
  return {
    login: data.login,
    name: data.name || data.login,
    avatarUrl: data.avatar_url,
    bio: data.bio || '',
    blog: data.blog || '',
    email: data.email || '',
    followers: data.followers,
    following: data.following,
    publicRepos: data.public_repos,
    createdAt: data.created_at,
    location: data.location || '',
  };
};

/**
 * Fetch up to 100 public repositories for a user
 * Endpoint: GET /users/:username/repos
 */
const getUserRepos = async (username) => {
  const { data } = await octokit.rest.repos.listForUser({
    username,
    per_page: 100,
    sort: 'updated',
    type: 'owner',
  });

  return data.map((repo) => ({
    name: repo.name,
    description: repo.description || '',
    language: repo.language || 'Unknown',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics || [],
    hasLicense: !!repo.license,
    isForked: repo.fork,
    url: repo.html_url,
    updatedAt: repo.updated_at,
    size: repo.size,
  }));
};

/**
 * Fetch recent public events (push events = commits)
 * Endpoint: GET /users/:username/events/public
 * Used to calculate activity score and streak
 */
const getUserEvents = async (username) => {
  const { data } = await octokit.rest.activity.listPublicEventsForUser({
    username,
    per_page: 100,
  });

  // We only care about push events (actual commits)
  const pushEvents = data.filter((event) => event.type === 'PushEvent');

   // DEBUG — add these 3 lines
  console.log('Total events from GitHub:', data.length);
  console.log('Push events found:', pushEvents.length);
  if (pushEvents.length > 0) {
    console.log('Sample push event payload:', JSON.stringify(pushEvents[0].payload, null, 2));
  }
  
  return pushEvents.map((event) => ({
    date: event.created_at,
    repoName: event.repo.name,
    // payload.size = total commits in push (reliable)
    // payload.commits.length can be 0 if GitHub truncated the array
    commitCount: event.payload.size || (event.payload.commits ? event.payload.commits.length : 1),
  }));
};

/**
 * Check if a repo has a README file
 * Endpoint: GET /repos/:owner/:repo/readme
 */
const checkReadme = async (username, repoName) => {
  try {
    await octokit.rest.repos.getReadme({ owner: username, repo: repoName });
    return true;
  } catch {
    return false; // 404 means no README
  }
};

/**
 * Check if a repo has a tests folder
 * Endpoint: GET /repos/:owner/:repo/contents
 * Looks for folders named: test, tests, __tests__, spec
 */
const checkTestsFolder = async (username, repoName) => {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: username,
      repo: repoName,
      path: '',
    });

    const testFolderNames = ['test', 'tests', '__tests__', 'spec', '__spec__'];
    return data.some(
      (item) =>
        item.type === 'dir' && testFolderNames.includes(item.name.toLowerCase())
    );
  } catch {
    return false;
  }
};

/**
 * Master function — fetches everything needed to generate a full report
 * Called by the profile controller on Day 6
 */
const fetchFullProfile = async (username) => {
  // Run profile + repos + events in parallel for speed
  const [profile, repos, events] = await Promise.all([
    getUserProfile(username),
    getUserRepos(username),
    getUserEvents(username),
  ]);

  // Only check README/tests on the top 10 repos (avoid rate limiting)
  const topRepos = repos
    .filter((r) => !r.isForked)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10);

  const reposWithDetails = await Promise.all(
    topRepos.map(async (repo) => {
      const [hasReadme, hasTests] = await Promise.all([
        checkReadme(username, repo.name),
        checkTestsFolder(username, repo.name),
      ]);
      return { ...repo, hasReadme, hasTests };
    })
  );

  return {
    profile,
    repos,             // all repos — used for language/diversity scoring
    reposWithDetails,  // top 10 with README + tests info
    events,            // push events — used for activity scoring
  };
};

module.exports = {
  fetchFullProfile,
  getUserProfile,
  getUserRepos,
  getUserEvents,
};
