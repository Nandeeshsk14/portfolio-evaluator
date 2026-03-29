import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXAMPLE_USERS = ['torvalds', 'gaearon', 'tj', 'sindresorhus', 'addyosmani'];

function Home() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = input.trim();
    if (username) navigate(`/report/${username}`);
  };

  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚡</div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
          Developer Portfolio Evaluator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          Enter any GitHub username to get a detailed scorecard covering activity,
          code quality, diversity, community impact, and hiring readiness.
        </p>

        {/* Search form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a GitHub username..."
            autoFocus
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.2rem',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              width: '320px',
              outline: 'none',
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.8rem', fontSize: '1rem' }} disabled={!input.trim()}>
            Generate Report →
          </button>
        </form>
      </div>

      {/* Example users */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          Try an example
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {EXAMPLE_USERS.map((user) => (
            <button
              key={user}
              onClick={() => navigate(`/report/${user}`)}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
            >
              {user}
            </button>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {[
          { icon: '📊', title: '5 Score Categories', desc: 'Activity, Code Quality, Diversity, Community, and Hiring Readiness — all computed from the free GitHub API.' },
          { icon: '🔗', title: 'Shareable Reports', desc: 'Every report lives at /report/:username — copy the link and send it to recruiters or share on LinkedIn.' },
          { icon: '⚡', title: '24-Hour Caching', desc: 'Reports are cached in MongoDB so repeat lookups are instant and don\'t burn your API rate limit.' },
        ].map((f) => (
          <div key={f.title} className="card">
            <div style={{ fontSize: '1.8rem', marginBottom: '0.6rem' }}>{f.icon}</div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
