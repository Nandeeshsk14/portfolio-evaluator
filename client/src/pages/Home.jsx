import SearchBar from '../components/SearchBar.jsx';

const FEATURES = [
  { icon: '📊', title: '5 Score Categories',  desc: 'Activity, Code Quality, Diversity, Community, and Hiring Readiness — all from the free GitHub API.' },
  { icon: '⚔️', title: 'Compare Mode',         desc: 'Enter two usernames side by side and see who wins per category with an overlaid radar chart.' },
  { icon: '🔗', title: 'Shareable Reports',    desc: 'Every report lives at /report/:username — paste the link on LinkedIn or send it to a recruiter.' },
  { icon: '⚡', title: '24-Hour Caching',      desc: 'Reports are cached in MongoDB so repeat lookups are instant and don\'t burn API rate limits.' },
];

function Home() {
  return (
    <div style={{ paddingBottom: '4rem' }}>

      {/* Hero section */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(88,166,255,0.06) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
        paddingTop: '5rem',
        paddingBottom: '4rem',
        textAlign: 'center',
      }}>
        <div className="container">
          <div className="fade-in-up" style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: 1 }}>⚡</div>
          <h1 className="fade-in-up fade-in-up-1" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '1rem' }}>
            Developer Portfolio Evaluator
          </h1>
          <p className="fade-in-up fade-in-up-2" style={{
            color: 'var(--text-secondary)', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
            maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7,
          }}>
            Enter any GitHub username and get a detailed scorecard covering
            activity, code quality, diversity, community impact, and hiring readiness.
          </p>
          <div className="fade-in-up fade-in-up-3">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div className="container" style={{ paddingTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 400, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.78rem' }}>
          What you get
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`card fade-in-up fade-in-up-${i + 1}`}
              style={{ transition: 'border-color 0.2s, transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
