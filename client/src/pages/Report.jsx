import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchReport } from '../utils/api.js';
import useMeta from '../utils/useMeta.js';
import ScoreCard from '../components/ScoreCard.jsx';
import RadarChart from '../components/RadarChart.jsx';
import RepoList from '../components/RepoList.jsx';
import LanguageChart from '../components/LanguageChart.jsx';
import HeatMap from '../components/HeatMap.jsx';
import ShareCard from '../components/ShareCard.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { ScoreCardSkeleton, ChartsSkeleton, RepoListSkeleton } from '../components/Skeleton.jsx';

function Report() {
  const { username } = useParams();
  const navigate     = useNavigate();
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useMeta({
    title: report
      ? `${report.name} (@${report.username}) — Dev Score ${report.scores.overall}/100`
      : 'Developer Portfolio Evaluator',
    description: report
      ? `${report.name}'s GitHub scorecard. Overall: ${report.scores.overall}/100.`
      : 'Analyse any GitHub profile and get a detailed developer scorecard.',
    imageUrl: report?.avatarUrl || '',
  });

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError('');
    setReport(null);

    fetchReport(username)
      .then((data) => { setReport(data); setLoading(false); })
      .catch((err)  => { setError(err.message); setLoading(false); });
  }, [username]);

  // ── Loading state — show skeletons instead of spinner ──────────────────────
  if (loading) return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Subtle loading label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
        <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
        Analysing <strong style={{ color: 'var(--text-secondary)' }}>@{username}</strong>...
      </div>
      <ScoreCardSkeleton />
      <ChartsSkeleton />
      <RepoListSkeleton />
    </div>
  );

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) return <ErrorState error={error} username={username} />;

  if (!report) return null;

  // ── Empty state — report came back but has no repos ────────────────────────
  if (report.publicRepos === 0) return (
    <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
      <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
        <h2 style={{ marginBottom: '0.5rem' }}>No public repositories</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <strong>@{username}</strong> exists on GitHub but has no public repos to analyse.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>← Search again</button>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>

      {/* Animated score ring + category bars */}
      <ScoreCard report={report} />

      {/* Contribution heatmap */}
      <HeatMap heatmapData={report.heatmapData} />

      {/* Radar + Language chart side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <RadarChart scores={report.scores} />
        <LanguageChart languages={report.languages} />
      </div>

      {/* Repo cards */}
      <RepoList repos={report.topRepos} />

      {/* Share card */}
      <ShareCard username={report.username} scores={report.scores} />

      {/* Cache status */}
      <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        {report.fromCache ? '⚡ Served from cache' : '🔄 Freshly fetched from GitHub'}
        {report.cachedAt && ` · ${new Date(report.cachedAt).toLocaleString()}`}
      </div>
    </div>
  );
}

export default Report;
