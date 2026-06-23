/**
 * Reprobado.js — Pantalla para diagnósticos no serios.
 * Se muestra cuando reprobadoDetector activa.
 *
 * NO BLOQUEA el uso del sitio. El usuario puede:
 * 1. Rehacer el diagnóstico (limpia estado)
 * 2. Ver resultados igual (con badge de "no confiable")
 */

import { COPY } from '../content/copy.js';
import { navigate } from '../router.js';
import { resetDiagnostic } from '../store.js';
import { trackEvent, EVENT_TYPES } from '../engine/analytics.js';
import { getReprobadoDescription } from '../engine/reprobadoDetector.js';

/**
 * @param {string[]} reasons — razones de activación del reprobado
 * @param {Function} onContinueAnyway — callback para mostrar resultados con badge
 */
export function renderReprobado(reasons, onContinueAnyway) {
  trackEvent(EVENT_TYPES.REPROBADO_TRIGGERED, { reasons });

  const descriptions = getReprobadoDescription(reasons);
  const app = document.getElementById('app');

  app.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex; align-items:center; justify-content:center;
      padding:var(--space-10) var(--space-6);
    ">
      <div style="max-width:520px; width:100%; text-align:center;">

        <div class="animate-fade-in-up" style="margin-bottom:var(--space-10);">
          <div style="
            font-size:3rem;
            margin-bottom:var(--space-6);
            opacity:0.4;
          ">◌</div>

          <h1 style="
            font-family:var(--font-display);
            font-size:clamp(1.5rem,4vw,2.2rem);
            line-height:1.25;
            margin-bottom:var(--space-6);
          ">${COPY.reprobado.title}</h1>

          <p style="
            color:var(--text-dim);
            font-size:1rem;
            line-height:1.7;
            margin-bottom:var(--space-8);
          ">${COPY.reprobado.subtitle}</p>
        </div>

        <!-- Razones detectadas -->
        <div class="animate-fade-in-up delay-2" style="
          text-align:left;
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:var(--radius-md);
          padding:var(--space-6);
          margin-bottom:var(--space-10);
        ">
          <p style="
            font-size:0.8rem;
            text-transform:uppercase;
            letter-spacing:0.08em;
            color:var(--text-muted);
            margin-bottom:var(--space-4);
          ">${COPY.reprobado.reasonsTitle}</p>

          ${descriptions.map(d => `
            <p style="
              color:var(--text-dim);
              font-size:0.92rem;
              line-height:1.6;
              padding:8px 0;
              border-bottom:1px solid var(--border);
            ">
              <span style="opacity:0.4; margin-right:8px;">›</span> ${d}
            </p>
          `).join('')}
        </div>

        <!-- Acciones -->
        <div class="animate-fade-in-up delay-3" style="
          display:flex; flex-direction:column; gap:var(--space-4); align-items:center;
        ">
          <button id="reprobado-retry" class="btn btn--primary btn--large" style="min-width:280px;">
            ${COPY.reprobado.retryBtn}
          </button>

          <button id="reprobado-continue" class="btn btn--link" style="
            font-size:0.82rem;
            opacity:0.5;
            margin-top:var(--space-2);
          ">
            ${COPY.reprobado.continueBtn}
          </button>
        </div>

        <p class="animate-fade-in-up delay-4" style="
          color:var(--text-muted);
          font-size:0.75rem;
          margin-top:var(--space-10);
          opacity:0.4;
          line-height:1.5;
        ">${COPY.reprobado.footnote}</p>

      </div>
    </div>
  `;

  document.getElementById('reprobado-retry').addEventListener('click', () => {
    resetDiagnostic();
    localStorage.removeItem('csm_abandoned_at');
    navigate('/diagnostico');
  });

  document.getElementById('reprobado-continue').addEventListener('click', () => {
    if (typeof onContinueAnyway === 'function') {
      onContinueAnyway();
    }
  });
}
