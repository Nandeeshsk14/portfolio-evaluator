import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Language colour map — same as RepoList for consistency
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
  Unknown:     '#8b949e',
};

const DEFAULT_COLOR = '#58a6ff';

function LanguageChart({ languages }) {
  if (!languages || languages.length === 0) return null;

  const labels     = languages.map((l) => l.name);
  const dataValues = languages.map((l) => l.percent);
  const colors     = languages.map((l) => LANG_COLORS[l.name] || DEFAULT_COLOR);

  const data = {
    labels,
    datasets: [
      {
        label: 'Usage %',
        data: dataValues,
        backgroundColor: colors.map((c) => c + 'cc'), // slight transparency
        borderColor: colors,
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: 'y',   // horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c2128',
        borderColor: '#30363d',
        borderWidth: 1,
        titleColor: '#e6edf3',
        bodyColor: '#8b949e',
        callbacks: {
          label: (ctx) => `  ${ctx.raw}% of repos`,
        },
      },
    },
    scales: {
      x: {
        max: 100,
        grid: { color: 'rgba(48,54,61,0.6)' },
        ticks: {
          color: '#8b949e',
          font: { size: 11 },
          callback: (v) => `${v}%`,
        },
        border: { color: 'rgba(48,54,61,0.6)' },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: '#e6edf3',
          font: { size: 12 },
        },
        border: { color: 'rgba(48,54,61,0.6)' },
      },
    },
  };

  // Dynamically size height based on number of languages
  const chartHeight = Math.max(180, languages.length * 36);

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1rem', marginBottom: '1.1rem' }}>
        Language Distribution
        <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          ({languages.length} languages)
        </span>
      </h2>
      <div style={{ height: chartHeight }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default LanguageChart;
