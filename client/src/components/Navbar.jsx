import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const username = input.trim();
    if (username) {
      navigate(`/report/${username}`);
      setInput('');
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          ⚡ Dev<span>Score</span>
        </Link>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="GitHub username..."
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.9rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              width: '200px',
              outline: 'none',
            }}
          />
          <button type="submit" className="btn btn-primary" disabled={!input.trim()}>
            Analyse
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
