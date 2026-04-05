import { useNavigate } from 'react-router-dom';

const ERROR_HINTS = {
  'not found': {
    icon: '🔍',
    title: 'User not found',
    hint: 'Double-check the GitHub username — it is case-sensitive.',
  },
  'rate limit': {
    icon: '⏱️',
    title: 'GitHub API rate limit reached',
    hint: 'Too many requests in a short time. Wait a few minutes and try again.',
  },
  'reach the server': {
    icon: '🔌',
    title: 'Cannot reach the server',
    hint: 'Make sure the backend is running on port 5000.',
  },
  'timed out': {
    icon: '⌛',
    title: 'Request timed out',
    hint: 'GitHub took too long to respond. Try again in a moment.',
  },
};

function ErrorState({ error, username }) {
  const navigate = useNavigate();

  // Pick the best matching hint based on error message
  const matched = Object.entries(ERROR_HINTS).find(([key]) =>
    error?.toLowerCase().includes(key)
  );

  const { icon, title, hint } = matched?.[1] || {
    icon: '❌',
    title: 'Something went wrong',
    hint: error || 'An unexpected error occurred. Please try again.',
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '3rem', maxWidth: '520px' }}>
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h2>
        {username && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Username tried: <code style={{ color: 'var(--accent)' }}>@{username}</code>
          </p>
        )}
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          {hint}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            ← Search again
          </button>
          <button
            className="btn btn-outline"
            onClick={() => window.location.reload()}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorState;
