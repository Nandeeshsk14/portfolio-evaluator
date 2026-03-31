import { useEffect, useState } from 'react';

// Animated circular progress ring
function CircleRing({ score, size = 140, strokeWidth = 10 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius      = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset      = circumference - (animatedScore / 100) * circumference;

  const color =
    animatedScore >= 70 ? '#3fb950' :
    animatedScore >= 40 ? '#d29922' : '#f85149';

  useEffect(() => {
    // Animate from 0 to actual score over 1 second
    let start = null;
    const duration = 1000;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setAnimatedScore(Math.round(progress * score));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={strokeWidth}
      />
      {/* Animated foreground */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke 0.3s' }}
      />
      {/* Score text — counter-rotate so it reads normally */}
      <text
        x="50%" y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          transform: `rotate(90deg)`,
          transformOrigin: 'center',
          transformBox: 'fill-box',
          fill: color,
          fontSize: `${size * 0.22}px`,
          fontWeight: 700,
          fontFamily: 'inherit',
          transition: 'fill 0.3s',
        }}
      >
        {animatedScore}
      </text>
    </svg>
  );
}

// Single category score row
function CategoryRow({ label, value, weight }) {
  const [width, setWidth] = useState(0);

  const color =
    value >= 70 ? 'var(--success)' :
    value >= 40 ? 'var(--warning)' : 'var(--danger)';

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.88rem' }}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>weight {weight}</span>
          <span style={{ color, fontWeight: 700, minWidth: '28px', textAlign: 'right' }}>{value}</span>
        </div>
      </div>
      <div style={{ background: 'var(--bg-primary)', borderRadius: '999px', height: '7px', overflow: 'hidden' }}>
        <div style={{
          width: `${width}%`,
          height: '100%',
          background: color,
          borderRadius: '999px',
          transition: 'width 0.9s ease-out',
        }} />
      </div>
    </div>
  );
}

// Main ScoreCard component
function ScoreCard({ report }) {
  if (!report) return null;

  const { scores, name, username, avatarUrl, bio, followers, publicRepos, location, blog } = report;

  const categories = [
    { label: 'Activity',      value: scores.activity,    weight: '25%' },
    { label: 'Code Quality',  value: scores.codeQuality, weight: '20%' },
    { label: 'Diversity',     value: scores.diversity,   weight: '20%' },
    { label: 'Community',     value: scores.community,   weight: '20%' },
    { label: 'Hiring Ready',  value: scores.hiringReady, weight: '15%' },
  ];

  const overallLabel =
    scores.overall >= 70 ? 'Strong Profile' :
    scores.overall >= 50 ? 'Good Profile'   :
    scores.overall >= 30 ? 'Developing'     : 'Getting Started';

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      {/* Top section — avatar + ring + meta */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>

        {/* Avatar */}
        <img
          src={avatarUrl}
          alt={name}
          style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--border)', flexShrink: 0 }}
        />

        {/* Name + bio */}
        <div style={{ flex: 1, minWidth: '180px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.15rem' }}>{name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
            @{username}
          </p>
          {bio && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '0.4rem' }}>
              {bio}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>👥 {followers.toLocaleString()} followers</span>
            <span>📁 {publicRepos} repos</span>
            {location && <span>📍 {location}</span>}
            {blog && (
              <a href={blog.startsWith('http') ? blog : `https://${blog}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                🔗 Website
              </a>
            )}
          </div>
        </div>

        {/* Circle ring */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <CircleRing score={scores.overall} size={130} strokeWidth={10} />
          <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {overallLabel}
          </div>
        </div>
      </div>

      {/* Category bars */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <h3 style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Score Breakdown
        </h3>
        {categories.map((cat) => (
          <CategoryRow key={cat.label} {...cat} />
        ))}
      </div>
    </div>
  );
}

export default ScoreCard;
