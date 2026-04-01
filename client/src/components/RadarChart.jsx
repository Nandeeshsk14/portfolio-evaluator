import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function RadarChart({ scores, compareScores = null, compareLabel = null }) {
  if (!scores) return null;

  const labels = ['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Ready'];
  const values = [
    scores.activity,
    scores.codeQuality,
    scores.diversity,
    scores.community,
    scores.hiringReady,
  ];

  const datasets = [
    {
      label: 'Your Score',
      data: values,
      backgroundColor: 'rgba(88, 166, 255, 0.15)',
      borderColor: '#58a6ff',
      borderWidth: 2,
      pointBackgroundColor: '#58a6ff',
      pointBorderColor: '#58a6ff',
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ];

  // Second dataset for compare mode (Day 16)
  if (compareScores) {
    datasets.push({
      label: compareLabel || 'Compare',
      data: [
        compareScores.activity,
        compareScores.codeQuality,
        compareScores.diversity,
        compareScores.community,
        compareScores.hiringReady,
      ],
      backgroundColor: 'rgba(63, 185, 80, 0.15)',
      borderColor: '#3fb950',
      borderWidth: 2,
      pointBackgroundColor: '#3fb950',
      pointBorderColor: '#3fb950',
      pointRadius: 4,
      pointHoverRadius: 6,
    });
  }

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 900,
      easing: 'easeOutQuart',
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          display: false, // hide tick numbers — cleaner look
        },
        grid: {
          color: 'rgba(48, 54, 61, 0.8)',
        },
        angleLines: {
          color: 'rgba(48, 54, 61, 0.8)',
        },
        pointLabels: {
          color: '#8b949e',
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: !!compareScores, // only show legend in compare mode
        labels: {
          color: '#8b949e',
          font: { size: 12 },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: '#1c2128',
        borderColor: '#30363d',
        borderWidth: 1,
        titleColor: '#e6edf3',
        bodyColor: '#8b949e',
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}/100`,
        },
      },
    },
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Score Radar</h2>
      <div style={{ maxWidth: '380px', margin: '0 auto' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}

export default RadarChart;
