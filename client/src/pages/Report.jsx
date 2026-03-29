import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Placeholder — full components get built Days 8-14
function Report() {
  const { username } = useParams();
  const navigate     = useNavigate();
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError('');
    setReport(null);

    fetch(`${API_URL}/profile/${username}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(d.error || 'Failed to fetch'); });
        return res.json();
      })
      .then((data) => { setReport(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [username]);

  if (loading) return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <p>Analysing <strong>{username}</strong>'s GitHub profile...</p>
    </div>
  );

  if (error) return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <div className="error-box">❌ {error}</div>
      <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
        ← Back to search
      </button>
    </div>
  );

  if (!report) return null;

  // Temporary display — replaced with full ScoreCard component from Day 9 onwards
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>

      {/* Profile header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <img src={report.avatarUrl} alt={report.name} style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--border)' }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.5rem' }}>{report.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>@{report.username}</p>
          {report.bio && <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{report.bio}</p>}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)' }}>{report.scores.overall}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall Score</div>
        </div>
      </div>

      {/* Score grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Activity',       value: report.scores.activity,     weight: '25%' },
          { label: 'Code Quality',   value: report.scores.codeQuality,  weight: '20%' },
          { label: 'Diversity',      value: report.scores.diversity,     weight: '20%' },
          { label: 'Community',      value: report.scores.community,     weight: '20%' },
          { label: 'Hiring Ready',   value: report.scores.hiringReady,  weight: '15%' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.value >= 60 ? 'var(--success)' : s.value >= 35 ? 'var(--warning)' : 'var(--danger)' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>{s.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>weight {s.weight}</div>
          </div>
        ))}
      </div>

      {/* Top repos */}
      {report.topRepos?.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Top Repositories</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {report.topRepos.slice(0, 6).map((repo) => (
              <div key={repo.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <a href={repo.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600, fontSize: '0.95rem' }}>{repo.name}</a>
                  {repo.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.1rem' }}>{repo.description}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {repo.language && <span style={{ background: 'var(--bg-secondary)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>{repo.language}</span>}
                  <span>⭐ {repo.stars}</span>
                  <span>🍴 {repo.forks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cache status + share */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {report.fromCache ? '⚡ Served from cache' : '🔄 Freshly fetched from GitHub'}
        </span>
        <button
          className="btn btn-outline"
          style={{ fontSize: '0.85rem' }}
          onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}
        >
          🔗 Copy shareable link
        </button>
      </div>
    </div>
  );
}

export default Report;
