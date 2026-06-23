/**
 * RadarChart.js — Wrapper de Chart.js para el gráfico radar del dashboard.
 */

import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { CATEGORIES, CATEGORY_ORDER } from '../content/categories.js';
import { COPY } from '../content/copy.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

/**
 * Devuelve el color de punto según la etiqueta de estado.
 */
function pointColor(label) {
  switch (label) {
    case 'critico': return '#ef4444';
    case 'mejorar': return '#f97316';
    case 'desarrollar': return '#eab308';
    case 'solido': return '#22c55e';
    default: return '#71717a';
  }
}

/**
 * Crea y monta el radar chart en el canvas dado.
 * @param {HTMLCanvasElement} canvas
 * @param {Object} scores - { categoryId: 0-10 }
 * @param {Object} labels - { categoryId: label }
 * @param {boolean} secretMode
 * @returns {Chart} instancia
 */
export function createRadarChart(canvas, scores, labels, secretMode = false) {
  const data = CATEGORY_ORDER.map(id => scores[id] ?? 0);
  const pointColors = CATEGORY_ORDER.map(id => pointColor(labels[id]));
  const catLabels = CATEGORY_ORDER.map(id => COPY.categories[id]?.name ?? id);

  const accentColor = secretMode ? '#3d5af1' : '#7c3aed';
  const accentFill = secretMode ? 'rgba(61,90,241,0.12)' : 'rgba(124,58,237,0.12)';
  const accentBorder = secretMode ? 'rgba(61,90,241,0.6)' : 'rgba(124,58,237,0.6)';
  const gridColor = 'rgba(255,255,255,0.05)';
  const labelColor = 'rgba(240,240,248,0.55)';

  return new Chart(canvas, {
    type: 'radar',
    data: {
      labels: catLabels,
      datasets: [{
        data,
        backgroundColor: accentFill,
        borderColor: accentBorder,
        borderWidth: 2,
        pointBackgroundColor: pointColors,
        pointBorderColor: 'transparent',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.2,
      }],
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            color: 'transparent', // ocultar números del eje
            backdropColor: 'transparent',
          },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: {
            color: labelColor,
            font: { family: "'Inter', sans-serif", size: 12 },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(28,28,38,0.95)',
          titleColor: '#f0f0f8',
          bodyColor: 'rgba(240,240,248,0.7)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.r.toFixed(1)} / 10`,
          },
        },
      },
    },
  });
}
