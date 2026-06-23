/**
 * Results.js — Dashboard de resultados post-diagnóstico.
 * Incluye la secuencia de activación del sistema secreto.
 */

import { COPY } from '../content/copy.js';
import { CATEGORIES, CATEGORY_ORDER } from '../content/categories.js';
import { getState, setState, saveToStorage } from '../store.js';
import { buildProfile } from '../engine/profileBuilder.js';
import { createRadarChart } from '../components/RadarChart.js';
import { secretBlackScreen, fadeOutOverlay, staggerIn } from '../components/Transitions.js';
import { navigate } from '../router.js';
import { detectReprobado } from '../engine/reprobadoDetector.js';
import { renderReprobado } from './Reprobado.js';
import { trackEvent, EVENT_TYPES } from '../engine/analytics.js';
import { BLOCKS } from '../content/questions.js';

let profile = null;
let isUnreliable = false; // flag para badge visual

export async function renderResults() {
  const state = getState();
  const app = document.getElementById('app');

  // ── Reprobado check (antes de calcular perfil) ──────────────────────────
  const totalQuestions = BLOCKS.reduce((sum, b) => sum + b.questions.length, 0);
  const reprobadoResult = detectReprobado({
    answers: state.diagnostic.answers || {},
    timing: state.diagnostic.timing || {},
    skips: state.diagnostic.skips || {},
    totalQuestions,
  });

  if (reprobadoResult.reprobado && !state.results.reprobado) {
    // Mostrar pantalla de reprobado con opción de continuar
    renderReprobado(reprobadoResult.reasons, () => {
      // El usuario eligió "ver resultados de todos modos"
      setState('results.reprobado', true);
      isUnreliable = true;
      saveToStorage();
      continueToResults(state);
    });
    return;
  }

  // Si ya fue marcado como reprobado pero eligió continuar
  isUnreliable = !!state.results.reprobado;

  await continueToResults(state);
}

async function continueToResults(state) {
  // Construir perfil
  profile = buildProfile(state.diagnostic, state.session);

  // Guardar en store
  setState('results.scores', profile.scores);
  setState('results.labels', profile.labels);
  setState('results.priority', profile.priority);
  setState('results.summary', profile.summary);
  setState('results.secretActivated', profile.secretActivated);
  setState('results.archetype', profile.archetype);
  setState('results.triggersActivated', profile.triggersActivated);
  setState('results.lastCompletedAt', Date.now());
  saveToStorage();

  // Analytics
  trackEvent(EVENT_TYPES.DIAGNOSTIC_COMPLETED, {
    secretActivated: profile.secretActivated,
    reprobado: isUnreliable,
    topPriority: profile.priority?.[0] || null,
  });

  // Mostrar pantalla de procesamiento
  await showProcessingScreen(profile);

  // Mostrar dashboard
  renderDashboard(profile);
}

// ─── Pantalla de procesamiento ────────────────────────────────────────────────

async function showProcessingScreen(profile) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="processing-screen">
      <div class="loading-dots animate-fade-in">
        <span></span><span></span><span></span>
      </div>
      <p class="processing-screen__text animate-fade-in delay-2">
        ${COPY.processing.standard}
      </p>
    </div>
  `;

  if (profile.secretActivated) {
    // Esperar 1.5s en procesamiento, luego pantalla negra
    await new Promise(r => setTimeout(r, 1500));
    await showSecretActivation(profile.archetype);
  } else {
    // Esperar 2s en procesamiento estándar
    await new Promise(r => setTimeout(r, 2000));
  }
}

// ─── Secuencia de activación secreta ─────────────────────────────────────────

async function showSecretActivation(archetype) {
  const app = document.getElementById('app');

  // Pantalla negra de 2 segundos
  await secretBlackScreen(2000);

  // Mostrar texto de activación sobre fondo negro
  app.innerHTML = `
    <div class="secret-activation">
      <p class="secret-activation__line1">${COPY.secret.activationLine1}</p>
      <p class="secret-activation__line2">${archetype.activationMessage || COPY.secret.activationLine2}</p>
    </div>
  `;

  // Aplicar modo secreto al body
  document.body.classList.add('secret-mode');

  // Esperar 2.5s para que el usuario lea
  await new Promise(r => setTimeout(r, 2500));

  // Fade out del overlay
  await fadeOutOverlay(600);
}

// ─── Dashboard principal ──────────────────────────────────────────────────────

function renderDashboard(profile) {
  const app = document.getElementById('app');
  const isSecret = profile.secretActivated;
  const archetype = profile.archetype;

  // Determinar frase de percepción
  let perceptionText = COPY.dashboard.openingContrastMatch;
  if (profile.perceptionContrast === 'over') perceptionText = COPY.dashboard.openingContrastOver;
  if (profile.perceptionContrast === 'under') perceptionText = COPY.dashboard.openingContrastUnder;

  app.innerHTML = `
    <div class="dashboard page-enter">

      <!-- Nav -->
      <nav class="nav">
        <a href="/" data-link class="nav__logo">¿Cómo ser mejor<span>?</span></a>
      </nav>

      <!-- Header -->
      <div class="dashboard__header">
        <h1>${COPY.dashboard.title}</h1>
        ${profile.openingScore ? `
          <p class="perception-contrast__verdict" style="margin-top:var(--space-3);">
            ${COPY.dashboard.openingContrast(profile.openingScore)}
            ${perceptionText}
          </p>
        ` : ''}
      </div>

      ${isUnreliable ? `
      <!-- Badge de resultado no confiable -->
      <div style="
        background:rgba(234,179,8,0.08);
        border:1px solid rgba(234,179,8,0.25);
        border-radius:var(--radius-md);
        padding:var(--space-4) var(--space-6);
        margin:0 auto var(--space-6);
        max-width:var(--max-width);
        text-align:center;
      ">
        <p style="color:#eab308; font-weight:600; font-size:0.9rem; margin-bottom:4px;">
          ${COPY.reprobado.unreliableBadge}
        </p>
        <p style="color:var(--text-muted); font-size:0.8rem; line-height:1.5;">
          ${COPY.reprobado.unreliableNote}
        </p>
      </div>
      ` : ''}

      <div class="container" style="padding-top:0;">


        <!-- Radar -->
        <div class="radar-section" style="padding: var(--space-12) 0;">
          <h3 style="text-align:center; margin-bottom:var(--space-8); color:var(--text-dim);">
            ${COPY.dashboard.radarTitle}
          </h3>
          <div class="radar-wrapper">
            <canvas id="radar-canvas" class="radar-canvas"></canvas>
          </div>
        </div>

        <!-- Las 3 prioridades -->
        <div class="priorities-section" style="padding: var(--space-10) 0;">
          <h2 class="section-title">${COPY.dashboard.prioritiesTitle}</h2>
          <p class="section-sub">${COPY.dashboard.prioritiesSubtitle}</p>
          <div class="priorities-list" id="priorities-list">
            ${renderPriorityCards(profile)}
          </div>
        </div>

        <div class="divider"></div>

        <!-- Otras categorías -->
        <div class="other-section" style="padding: var(--space-8) 0;">
          <h3 class="section-title" style="font-size:1.2rem;">${COPY.dashboard.otherAreasTitle}</h3>
          <div class="other-grid" id="other-grid">
            ${renderOtherCategories(profile)}
          </div>
        </div>

        ${profile.blindSpots.length > 0 ? `
        <div class="divider"></div>
        <div class="blind-spots-section">
          <h3 style="font-size:1.1rem; margin-bottom:var(--space-3);">${COPY.dashboard.blindSpotsTitle}</h3>
          <p style="color:var(--text-dim); font-size:0.9rem; margin-bottom:var(--space-5);">${COPY.dashboard.blindSpotsSubtitle}</p>
          <div class="blind-spots-list">
            ${profile.blindSpots.map(id => {
              const cat = CATEGORIES[id];
              return `<span class="badge badge--desarrollar">${cat?.icon ?? ''} ${COPY.categories[id]?.name ?? id}</span>`;
            }).join('')}
          </div>
        </div>
        ` : ''}

        ${profile.skippedSections.length > 0 ? `
        <div class="divider"></div>
        <div class="skips-section">
          <div class="skips-notice">
            <span class="skips-notice__icon">◦</span>
            <p class="skips-notice__text">${COPY.dashboard.skipsText}</p>
          </div>
        </div>
        ` : ''}

        <div class="divider"></div>

        <!-- Frase resumen -->
        <div class="summary-section">
          <p class="summary-label">${COPY.dashboard.summaryLabel}</p>
          <p class="summary-phrase">"${profile.summary}"</p>
        </div>

        <!-- CTAs -->
        <div class="cta-section">
          <button id="start-top" class="btn btn--primary btn--large">
            Empezar por ${COPY.categories[profile.priority[0]]?.name ?? profile.priority[0]}
          </button>
          <button id="redo-btn" class="btn btn--ghost">
            ${COPY.dashboard.retakeBtn}
          </button>
        </div>

      </div>
    </div>

    ${isSecret && archetype ? `
    <!-- Símbolo del arquetipo (floating, clickeable) -->
    <div class="archetype-symbol visible" id="archetype-symbol" title="Algo distinto fue detectado.">
      ${archetype.symbol}
    </div>
    ` : ''}
  `;

  // Inicializar radar chart
  const canvas = document.getElementById('radar-canvas');
  if (canvas) {
    createRadarChart(canvas, profile.scores, profile.labels, isSecret);
  }

  // Stagger animations
  staggerIn(document.querySelectorAll('.priority-card'), '', 0);
  staggerIn(document.querySelectorAll('.mini-card'), '', 100);

  // CTAs
  document.getElementById('start-top')?.addEventListener('click', () => {
    navigate(`/categoria/${profile.priority[0]}`);
  });

  document.getElementById('redo-btn')?.addEventListener('click', () => {
    navigate('/diagnostico');
  });

  // Mini cards — navegar a categoría
  document.querySelectorAll('.mini-card[data-cat]').forEach(card => {
    card.addEventListener('click', () => {
      navigate(`/categoria/${card.dataset.cat}`);
    });
  });

  // Símbolo del arquetipo — navegar a página secreta
  if (isSecret && archetype) {
    // Guardar token en localStorage para validarlo en Archetype.js
    localStorage.setItem('csm_secret_token', archetype.sessionToken);
    localStorage.setItem('csm_secret_archetype', archetype.id);

    document.getElementById('archetype-symbol')?.addEventListener('click', () => {
      navigate(`/_s/${archetype.sessionToken}`);
    });
  }
}

// ─── Helpers de render ────────────────────────────────────────────────────────

function renderPriorityCards(profile) {
  return profile.topCategories.map((cat, i) => {
    const category = CATEGORIES[cat.id];
    const labelKey = cat.label;
    const labelText = COPY.labels[labelKey] ?? labelKey;

    return `
      <div class="priority-card" style="--cat-color: ${category?.color ?? 'var(--accent)'};">
        <span class="priority-card__number">${i + 1}</span>
        <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-3);">
          <span style="font-size:1.6rem;">${category?.icon ?? ''}</span>
          <div>
            <div class="priority-card__category">${COPY.categories[cat.id]?.name ?? cat.id}</div>
            <span class="badge badge--${labelKey}">${labelText}</span>
          </div>
          ${cat.score !== null ? `
            <span style="
              margin-left:auto;
              font-family:var(--font-display);
              font-size:2rem;
              font-weight:700;
              color:${category?.color ?? 'var(--accent)'};
              opacity:0.85;
            ">${cat.score.toFixed(1)}</span>
          ` : ''}
        </div>
        <p class="priority-card__reason">${cat.reason}</p>
        <button class="btn btn--primary" onclick="window.location.href='/categoria/${cat.id}'">
          ${COPY.dashboard.startHereBtn}
        </button>
      </div>
    `;
  }).join('');
}

function renderOtherCategories(profile) {
  return profile.priority.slice(3).map(catId => {
    const cat = CATEGORIES[catId];
    const score = profile.scores[catId];
    const label = profile.labels[catId];

    return `
      <div class="mini-card" data-cat="${catId}" style="--cat-color: ${cat?.color ?? 'var(--accent)'};">
        <div class="mini-card__icon">${cat?.icon ?? ''}</div>
        <div class="mini-card__name">${COPY.categories[catId]?.name ?? catId}</div>
        <div class="mini-card__score">${score !== null ? score.toFixed(1) : '—'}</div>
        <span class="badge badge--${label}" style="font-size:0.75rem;">${COPY.labels[label] ?? label}</span>
      </div>
    `;
  }).join('');
}
