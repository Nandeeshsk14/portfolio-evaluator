import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance — all calls go through this
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s — GitHub API can be slow on first fetch
});

/**
 * Fetch (or generate) a full scored report for a GitHub username.
 * Hits cache first, fetches fresh if not cached.
 */
export const fetchReport = async (username) => {
  const { data } = await api.get(`/profile/${username.trim().toLowerCase()}`);
  return data;
};

/**
 * Return cached report only — no GitHub API call.
 * Throws if no valid cache exists.
 */
export const fetchCachedReport = async (username) => {
  const { data } = await api.get(`/profile/${username.trim().toLowerCase()}/cached`);
  return data;
};

/**
 * Compare two GitHub profiles side by side.
 * Returns { profiles: [report1, report2], winners: { category: username } }
 */
export const compareProfiles = async (u1, u2) => {
  const { data } = await api.get('/compare', { params: { u1, u2 } });
  return data;
};

/**
 * Check backend + database health.
 */
export const checkHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

// Global error interceptor — normalises error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : null) ||
      (error.request ? 'Cannot reach the server. Is the backend running?' : null) ||
      error.message ||
      'Something went wrong.';

    return Promise.reject(new Error(message));
  }
);

export default api;
