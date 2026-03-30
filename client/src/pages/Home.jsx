import SearchBar from '../components/SearchBar.jsx';

function Home() {
  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚡</div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
          Developer Portfolio Evaluator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          Enter any GitHub username and get a detailed scorecard covering activity,
          code quality, diversity, community impact, and hiring readiness.
        </p>

        {/* SearchBar component */}
        <SearchBar />
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '4rem' }}>
        {[
          { icon: '📊', title: '5 Score Categories',  desc: 'Activity, Code Quality, Diversity, Community, and Hiring Readiness — all from the free GitHub API.' },
          { icon: '🔗', title: 'Shareable Reports',   desc: 'Every report lives at /report/:username — copy the link and send it to recruiters or share on LinkedIn.' },
          { icon: '⚡', title: '24-Hour Caching',     desc: 'Reports are cached in MongoDB so repeat lookups are instant and don\'t burn your API rate limit.' },
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
