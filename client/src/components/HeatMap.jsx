import { useMemo } from 'react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getColor(count) {
  if (count === 0)  return 'var(--bg-secondary)';
  if (count <= 2)   return '#0e4429';
  if (count <= 5)   return '#006d32';
  if (count <= 10)  return '#26a641';
  return '#39d353';
}

function HeatMap({ heatmapData }) {
  const { weeks, monthLabels, totalCommits, activeDays } = useMemo(() => {
    if (!heatmapData || Object.keys(heatmapData).length === 0) {
      return { weeks: [], monthLabels: [], totalCommits: 0, activeDays: 0 };
    }

    // Build a clean 52-week grid ending today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the Sunday 51 full weeks ago
    const gridEnd = new Date(today);
    const dayOfWeek = gridEnd.getDay(); // 0=Sun
    // Advance to the coming Saturday so the last column is complete
    gridEnd.setDate(gridEnd.getDate() + (6 - dayOfWeek));

    const gridStart = new Date(gridEnd);
    gridStart.setDate(gridStart.getDate() - 52 * 7 + 1);

    const weeksArr     = [];
    const monthLabelsArr = [];
    const seenMonths   = new Set();
    let current        = new Date(gridStart);

    for (let w = 0; w < 52; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const key   = current.toISOString().split('T')[0];
        const count = heatmapData[key] ?? 0;
        const month = current.getMonth();
        const monthKey = `${current.getFullYear()}-${month}`;

        if (d === 0 && !seenMonths.has(monthKey)) {
          seenMonths.add(monthKey);
          monthLabelsArr.push({ week: w, label: MONTHS[month] });
        }

        week.push({ key, count });
        current.setDate(current.getDate() + 1);
      }
      weeksArr.push(week);
    }

    const total  = Object.values(heatmapData).reduce((s, c) => s + c, 0);
    const active = Object.values(heatmapData).filter((c) => c > 0).length;

    return { weeks: weeksArr, monthLabels: monthLabelsArr, totalCommits: total, activeDays: active };
  }, [heatmapData]);

  if (!heatmapData || weeks.length === 0) return null;

  const cellSize = 12;
  const gap      = 3;
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1rem' }}>Contribution Activity</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {totalCommits.toLocaleString()} commits · {activeDays} active days
          <span style={{ marginLeft: '0.3rem', fontSize: '0.75rem' }}>(last 52 weeks, from public push events)</span>
        </span>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'inline-block' }}>

          {/* Month labels row */}
          <div style={{ display: 'flex', marginLeft: 32, marginBottom: 4, position: 'relative', height: 14 }}>
            {monthLabels.map(({ week, label }) => (
              <div
                key={`${week}-${label}`}
                style={{
                  position: 'absolute',
                  left: week * (cellSize + gap),
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Day labels + week columns */}
          <div style={{ display: 'flex', gap: 4 }}>
            {/* Day of week labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap, width: 28 }}>
              {dayLabels.map((label, i) => (
                <div key={i} style={{ height: cellSize, fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4 }}>
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div style={{ display: 'flex', gap }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap }}>
                  {week.map((cell) => (
                    <div
                      key={cell.key}
                      title={`${cell.key}: ${cell.count} commit${cell.count !== 1 ? 's' : ''}`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        borderRadius: 2,
                        background: getColor(cell.count),
                        border: '1px solid rgba(255,255,255,0.04)',
                        cursor: cell.count > 0 ? 'pointer' : 'default',
                        transition: 'transform 0.1s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => { if (cell.count > 0) e.currentTarget.style.transform = 'scale(1.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: '0.75rem', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Less</span>
        {[0, 2, 5, 10, 15].map((v) => (
          <div key={v} style={{ width: cellSize, height: cellSize, borderRadius: 2, background: getColor(v), border: '1px solid rgba(255,255,255,0.04)' }} />
        ))}
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>More</span>
      </div>
    </div>
  );
}

export default HeatMap;
