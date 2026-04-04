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

function Report() {
  const { username } = useParams();
  const navigate     = useNavigate();
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

 useMeta({
  title: report
    ? `${report.name} (@${report.username}) — Dev Score ${report.scores.overall}/100`
    : `Developer Portfolio Evaluator`,
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

  if (loading) return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <p>Analysing <strong>{username}</strong>'s GitHub profile...</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>First fetch may take up to 10 seconds</p>
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

      {/* Repo cards grid */}
      <RepoList repos={report.topRepos} />

      {/* Share card */}
      <ShareCard username={report.username} scores={report.scores} />

      {/* Cache status footer */}
      <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        {report.fromCache ? '⚡ Served from cache' : '🔄 Freshly fetched from GitHub'}
        {report.cachedAt && ` · ${new Date(report.cachedAt).toLocaleString()}`}
      </div>
    </div>
  );
}

export default Report;
