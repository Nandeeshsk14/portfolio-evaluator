import { useState } from 'react';
import { compareProfiles } from '../utils/api.js';
import RadarChart from '../components/RadarChart.jsx';

const CATEGORIES = [
  { key: 'activity',    label: 'Activity',      weight: '25%' },
  { key: 'codeQuality', label: 'Code Quality',  weight: '20%' },
  { key: 'diversity',   label: 'Diversity',      weight: '20%' },
  { key: 'community',   label: 'Community',      weight: '20%' },
  { key: 'hiringReady', label: 'Hiring Ready',   weight: '15%' },
];

function ProfileHeader({ report, side }) {
  const isLeft  = side === 'left';
  const color   = isLeft ? '#58a6ff' : '#3fb950';

  return (
    <div style={{ textAlign: 'center', padding: '1.25rem' }}>
      <img
        src={report.avatarUrl}
        alt={report.name}
        style={{ width: 64, height: 64, borderRadius: '50%', border: `3px solid ${color}`, marginBottom: '0.6rem' }}
      />
      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{report.name}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>@{report.username}</div>
      <div style={{
        fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem',
        color: color,
      }}>
        {report.scores.overall}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall / 100</div>
    </div>
  );
}

function ScoreRow({ label, weight, v1, v2, winner, u1, u2 }) {
  const max = Math.max(v1, v2, 1);

  return (
    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
        <span>{weight}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Left score */}
        <span style={{
          minWidth: 32, textAlign: 'right', fontWeight: 700, fontSize: '0.9rem',
          color: winner === u1 ? '#58a6ff' : 'var(--text-secondary)',
        }}>
          {v1}
          {winner === u1 && <span style={{ marginLeft: 3, fontSize: 10 }}>▲</span>}
        </span>

        {/* Bar comparison */}
        <div style={{ flex: 1, position: 'relative', height: 8, background: 'var(--bg-primary)', borderRadius: 999 }}>
          {/* Left bar — grows from centre to left */}
          <div style={{
            position: 'absolute', right: '50%', top: 0, height: '100%',
            width: `${(v1 / max) * 50}%`,
            background: winner === u1 ? '#58a6ff' : 'rgba(88,166,255,0.4)',
            borderRadius: '999px 0 0 999px',
            transition: 'width 0.8s ease-out',
          }} />
          {/* Right bar — grows from centre to right */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, height: '100%',
            width: `${(v2 / max) * 50}%`,
            background: winner === u2 ? '#3fb950' : 'rgba(63,185,80,0.4)',
            borderRadius: '0 999px 999px 0',
            transition: 'width 0.8s ease-out',
          }} />
          {/* Centre divider */}
          <div style={{ position: 'absolute', left: '50%', top: -2, width: 2, height: 12, background: 'var(--border)', borderRadius: 1 }} />
        </div>

        {/* Right score */}
        <span style={{
          minWidth: 32, fontWeight: 700, fontSize: '0.9rem',
          color: winner === u2 ? '#3fb950' : 'var(--text-secondary)',
        }}>
          {winner === u2 && <span style={{ marginRight: 3, fontSize: 10 }}>▲</span>}
          {v2}
        </span>
      </div>
    </div>
  );
}

function Compare() {
  const [u1, setU1]         = useState('');
  const [u2, setU2]         = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!u1.trim() || !u2.trim()) return;
    if (u1.trim().toLowerCase() === u2.trim().toLowerCase()) {
      setError('Please enter two different usernames.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await compareProfiles(u1.trim(), u2.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const p1 = result?.profiles?.[0];
  const p2 = result?.profiles?.[1];
  const winners = result?.winners || {};

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>⚔️ Compare Developers</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Enter two GitHub usernames to compare their scores side by side.
        </p>
      </div>

      {/* Input form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleCompare}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              value={u1}
              onChange={(e) => setU1(e.target.value)}
              placeholder="First GitHub username"
              style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
                color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
                borderColor: u1 ? '#58a6ff' : 'var(--border)',
              }}
            />
            <span style={{ color: 'var(--text-muted)', fontWeight: 700, textAlign: 'center' }}>vs</span>
            <input
              type="text"
              value={u2}
              onChange={(e) => setU2(e.target.value)}
              placeholder="Second GitHub username"
              style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
                color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
                borderColor: u2 ? '#3fb950' : 'var(--border)',
              }}
            />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.6rem' }}>❌ {error}</p>}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.7rem 2rem', fontSize: '0.95rem' }}
              disabled={!u1.trim() || !u2.trim() || loading}
            >
              {loading ? 'Comparing...' : 'Compare →'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div className="spinner-wrap">
          <div className="spinner" />
          <p>Fetching both profiles from GitHub...</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>This may take up to 15 seconds</p>
        </div>
      )}

      {/* Results */}
      {result && p1 && p2 && (
        <>
          {/* Profile headers */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}>
              <ProfileHeader report={p1} side="left" />
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.1rem' }}>
                vs
              </div>
              <ProfileHeader report={p2} side="right" />
            </div>

            {/* Overall winner banner */}
            {winners.overall !== 'tie' ? (
              <div style={{
                textAlign: 'center', padding: '0.6rem',
                background: winners.overall === p1.username ? 'rgba(88,166,255,0.08)' : 'rgba(63,185,80,0.08)',
                borderTop: '1px solid var(--border)',
                fontSize: '0.85rem', color: 'var(--text-secondary)',
              }}>
                🏆 <strong style={{ color: winners.overall === p1.username ? '#58a6ff' : '#3fb950' }}>
                  @{winners.overall}
                </strong> wins overall
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.6rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                🤝 It's a tie!
              </div>
            )}
          </div>

          {/* Overlaid radar chart */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Score Radar</h2>
            <div style={{ maxWidth: '420px', margin: '0 auto' }}>
              <RadarChart
                scores={p1.scores}
                compareScores={p2.scores}
                compareLabel={`@${p2.username}`}
                primaryLabel={`@${p1.username}`}
              />
            </div>
          </div>

          {/* Category breakdown */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', marginBottom: '0.25rem', fontSize: '0.82rem', fontWeight: 600 }}>
              <span style={{ color: '#58a6ff' }}>@{p1.username}</span>
              <span style={{ color: 'var(--text-muted)', minWidth: 80, textAlign: 'center' }}>Category</span>
              <span style={{ color: '#3fb950', textAlign: 'right' }}>@{p2.username}</span>
            </div>
            {CATEGORIES.map((cat) => (
              <ScoreRow
                key={cat.key}
                label={cat.label}
                weight={cat.weight}
                v1={p1.scores[cat.key]}
                v2={p2.scores[cat.key]}
                winner={winners[cat.key]}
                u1={p1.username}
                u2={p2.username}
              />
            ))}
          </div>

          {/* Top repos side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[p1, p2].map((p, idx) => (
              <div key={p.username} className="card">
                <h2 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: idx === 0 ? '#58a6ff' : '#3fb950' }}>
                  @{p.username}'s top repos
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(p.topRepos || []).slice(0, 4).map((repo) => (
                    <div key={repo.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', alignItems: 'center' }}>
                      <a href={repo.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                        {repo.name}
                      </a>
                      <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>⭐ {repo.stars}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Compare;
