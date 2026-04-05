function SkeletonBlock({ width = '100%', height = '16px', borderRadius = '6px', style = {} }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-card) 50%, var(--bg-secondary) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      flexShrink: 0,
      ...style,
    }} />
  );
}

export function ScoreCardSkeleton() {
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <SkeletonBlock width="80px" height="80px" borderRadius="50%" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '180px' }}>
          <SkeletonBlock width="180px" height="22px" />
          <SkeletonBlock width="120px" height="14px" />
          <SkeletonBlock width="260px" height="14px" />
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <SkeletonBlock width="80px" height="12px" />
            <SkeletonBlock width="60px" height="12px" />
          </div>
        </div>
        <SkeletonBlock width="130px" height="130px" borderRadius="50%" />
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[100, 80, 90, 70, 85].map((w, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <SkeletonBlock width={`${w}px`} height="13px" />
              <SkeletonBlock width="30px" height="13px" />
            </div>
            <SkeletonBlock width="100%" height="7px" borderRadius="999px" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
      <div className="card">
        <SkeletonBlock width="120px" height="16px" style={{ marginBottom: '1.25rem' }} />
        <SkeletonBlock width="100%" height="280px" borderRadius="8px" />
      </div>
      <div className="card">
        <SkeletonBlock width="160px" height="16px" style={{ marginBottom: '1.1rem' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[90, 60, 75, 45, 55, 35].map((w, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <SkeletonBlock width={`${w}px`} height="13px" />
                <SkeletonBlock width="30px" height="13px" />
              </div>
              <SkeletonBlock width="100%" height="6px" borderRadius="999px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RepoListSkeleton() {
  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <SkeletonBlock width="140px" height="16px" style={{ marginBottom: '1rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <SkeletonBlock width="140px" height="15px" />
            <SkeletonBlock width="100%" height="13px" />
            <SkeletonBlock width="80%" height="13px" />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <SkeletonBlock width="60px" height="18px" borderRadius="999px" />
              <SkeletonBlock width="50px" height="18px" borderRadius="999px" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
              <SkeletonBlock width="70px" height="12px" />
              <SkeletonBlock width="50px" height="12px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonBlock;
