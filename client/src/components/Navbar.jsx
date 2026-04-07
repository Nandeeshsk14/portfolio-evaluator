import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [input, setInput] = useState('');
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    const username = input.trim();
    if (username) { navigate(`/report/${username}`); setInput(''); }
  };

  const isCompare  = location.pathname === '/compare';
  const isHome     = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" className="navbar-brand">
            ⚡ Dev<span>Score</span>
          </Link>
          <Link
            to="/compare"
            style={{
              fontSize: '0.85rem',
              color: isCompare ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: isCompare ? 600 : 400,
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!isCompare) e.target.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { if (!isCompare) e.target.style.color = 'var(--text-secondary)'; }}
          >
            ⚔️ Compare
          </Link>
        </div>

        {/* Hide search on home page — it already has one */}
        {!isHome && (
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }} className="navbar-search">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="GitHub username..."
              style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '0.45rem 0.9rem',
                color: 'var(--text-primary)', fontSize: '0.88rem',
                width: '180px',
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!input.trim()}
              style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
            >
              Analyse
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
