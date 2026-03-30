import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchReport } from '../utils/api.js';

function Report() {
  const { username } = useParams();
  const navigate     = useNavigate();
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError('');
    setReport(null);

    fetchReport(username)
      .then((data) => { setReport(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [username]);

  if (loading) return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <p>Analysing <strong>{username}</strong>'s GitHub profile...</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        First fetch may take up to 10 seconds
      </p>
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

  const scoreColor = (v) => v >= 60 ? 'var(--success)' : v >= 35 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>

      {/* Profile header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <img
          src={report.avatarUrl}
          alt={report.name}
          style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--border)' }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.5rem' }}>{report.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>@{report.username}</p>
          {report.bio && (
            <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {report.bio}
            </p>
          )}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>👥 {report.followers} followers</span>
            <span>📁 {report.publicRepos} repos</span>
            {report.location && <span>📍 {report.location}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 700, color: scoreColor(report.scores.overall) }}>
            {report.scores.overall}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Overall / 100</div>
        </div>
      </div>

      {/* Score grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Activity',     value: report.scores.activity,    weight: '25%' },
          { label: 'Code Quality', value: report.scores.codeQuality, weight: '20%' },
          { label: 'Diversity',    value: report.scores.diversity,    weight: '20%' },
          { label: 'Community',    value: report.scores.community,    weight: '20%' },
          { label: 'Hiring Ready', value: report.scores.hiringReady, weight: '15%' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: scoreColor(s.value) }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>{s.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>weight {s.weight}</div>
          </div>
        ))}
      </div>

      {/* Top repos */}
      {report.topRepos?.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Top Repositories</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {report.topRepos.map((repo, i) => (
              <div
                key={repo.name}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem 0', flexWrap: 'wrap', gap: '0.5rem',
                  borderBottom: i < report.topRepos.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <a href={repo.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {repo.name}
                  </a>
                  {repo.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.15rem' }}>
                      {repo.description.slice(0, 80)}{repo.description.length > 80 ? '…' : ''}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                  {repo.language && (
                    <span style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)' }}>
                      {repo.language}
                    </span>
                  )}
                  <span>⭐ {repo.stars}</span>
                  <span>🍴 {repo.forks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Language distribution */}
      {report.languages?.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Language Distribution</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {report.languages.map((lang) => (
              <div key={lang.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>{lang.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{lang.percent}%</span>
                </div>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${lang.percent}%`, height: '100%', background: 'var(--accent)', borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {report.fromCache ? '⚡ Served from cache' : '🔄 Freshly fetched from GitHub'}
          {report.cachedAt && ` · ${new Date(report.cachedAt).toLocaleString()}`}
        </span>
        <button
          className="btn btn-outline"
          style={{ fontSize: '0.85rem' }}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }}
        >
          🔗 Copy shareable link
        </button>
      </div>
    </div>
  );
}

export default Report;
