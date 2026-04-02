// Language colour map — matches GitHub's colours
const LANG_COLORS = {
  JavaScript:  '#f1e05a',
  TypeScript:  '#3178c6',
  Python:      '#3572A5',
  Java:        '#b07219',
  'C++':       '#f34b7d',
  C:           '#555555',
  'C#':        '#178600',
  Go:          '#00ADD8',
  Rust:        '#dea584',
  Ruby:        '#701516',
  PHP:         '#4F5D95',
  Swift:       '#F05138',
  Kotlin:      '#A97BFF',
  Dart:        '#00B4AB',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  Shell:       '#89e051',
  Vue:         '#41b883',
  Svelte:      '#ff3e00',
  R:           '#198CE7',
  Scala:       '#c22d40',
  Haskell:     '#5e5086',
  Elixir:      '#6e4a7e',
  Lua:         '#000080',
  MATLAB:      '#e16737',
  Unknown:     '#8b949e',
};

function LanguageDot({ language }) {
  const color = LANG_COLORS[language] || LANG_COLORS.Unknown;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
      {language}
    </span>
  );
}

function TopicPill({ topic }) {
  return (
    <span style={{
      background: 'rgba(88,166,255,0.1)',
      border: '1px solid rgba(88,166,255,0.3)',
      color: 'var(--accent)',
      borderRadius: '999px',
      padding: '0.1rem 0.55rem',
      fontSize: '0.72rem',
      fontWeight: 500,
    }}>
      {topic}
    </span>
  );
}

function RepoCard({ repo }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '1rem 1.1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      transition: 'border-color 0.15s',
      cursor: 'default',
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Repo name */}
      <div>
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent)' }}
        >
          📁 {repo.name}
        </a>
      </div>

      {/* Description */}
      {repo.description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.5, margin: 0 }}>
          {repo.description.length > 100 ? repo.description.slice(0, 100) + '…' : repo.description}
        </p>
      )}

      {/* Topics */}
      {repo.topics?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {repo.topics.slice(0, 4).map((t) => <TopicPill key={t} topic={t} />)}
        </div>
      )}

      {/* Footer row — language + stars + forks */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', paddingTop: '0.25rem' }}>
        {repo.language && repo.language !== 'Unknown' && (
          <LanguageDot language={repo.language} />
        )}
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          ⭐ {repo.stars.toLocaleString()}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          🍴 {repo.forks.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function RepoList({ repos }) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        Top Repositories
        <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          ({repos.length})
        </span>
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '0.85rem',
      }}>
        {repos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  );
}

export default RepoList;
