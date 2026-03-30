import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SUGGESTIONS = ['torvalds', 'gaearon', 'sindresorhus', 'tj', 'addyosmani', 'yyx990803'];

function SearchBar() {
  const [input, setInput]       = useState('');
  const [error, setError]       = useState('');
  const [focused, setFocused]   = useState(false);
  const navigate                = useNavigate();

  const validate = (value) => {
    if (!value.trim()) return 'Please enter a GitHub username.';
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(value.trim())) {
      return 'Invalid GitHub username format.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = input.trim();
    const err = validate(username);
    if (err) { setError(err); return; }
    setError('');
    navigate(`/report/${username}`);
  };

  const handleSuggestion = (username) => {
    setInput(username);
    setError('');
    navigate(`/report/${username}`);
  };

  return (
    <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Github icon inside input */}
            <span style={{
              position: 'absolute', left: '0.9rem', top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)', fontSize: '1rem', pointerEvents: 'none',
            }}>
              @
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(''); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="GitHub username..."
              autoComplete="off"
              autoFocus
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.8rem 1rem 0.8rem 2rem',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.8rem 1.6rem', fontSize: '1rem', whiteSpace: 'nowrap' }}
            disabled={!input.trim()}
          >
            Analyse →
          </button>
        </div>

        {/* Validation error */}
        {error && (
          <p style={{ color: 'var(--danger)', fontSize: '0.83rem', marginTop: '0.4rem' }}>
            {error}
          </p>
        )}
      </form>

      {/* Suggestion chips */}
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '999px',
              padding: '0.2rem 0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
