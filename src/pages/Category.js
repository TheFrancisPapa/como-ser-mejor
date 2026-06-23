/**
 * Category.js — Hub de categoría.
 */

import { COPY } from '../content/copy.js';
import { CATEGORIES } from '../content/categories.js';
import { getState } from '../store.js';
import { navigate } from '../router.js';

export function renderCategory({ params }) {
  const { slug } = params;
  const cat = CATEGORIES[slug];
  if (!cat) { navigate('/'); return; }

  const state = getState();
  const score = state.results.scores[slug];
  const label = state.results.labels[slug];

  const guide = cat.guideStub;
  const app = document.getElementById('app');

  app.innerHTML = `
    <div style="min-height:100vh; padding-top:80px; padding-bottom:var(--space-24);">

      <!-- Nav -->
      <nav class="nav">
        <a href="/" data-link class="nav__logo">¿Cómo ser mejor<span>?</span></a>
        <a href="/resultados" data-link class="btn btn--link" style="font-size:0.85rem;">
          ← Mi Mapa
        </a>
      </nav>

      <!-- Header de categoría -->
      <div class="container" style="padding-top:var(--space-12);">
        <div class="animate-fade-in-up" style="margin-bottom:var(--space-10);">
          <div style="display:flex; align-items:center; gap:var(--space-4); margin-bottom:var(--space-4);">
            <span style="font-size:2.5rem;">${cat.icon}</span>
            <div>
              <h1 style="
                font-size:clamp(1.8rem, 5vw, 3rem);
                color:${cat.color};
                margin-bottom:var(--space-2);
              ">${COPY.categories[slug]?.name ?? slug}</h1>
              <p style="color:var(--text-dim);">${COPY.categories[slug]?.subtitle ?? ''}</p>
            </div>
          </div>

          ${score !== null && score !== undefined ? `
          <div style="display:flex; align-items:center; gap:var(--space-4); flex-wrap:wrap;">
            <div style="display:flex; align-items:baseline; gap:var(--space-2);">
              <span style="
                font-family:var(--font-display);
                font-size:3.5rem;
                font-weight:700;
                color:${cat.color};
                line-height:1;
              ">${score.toFixed(1)}</span>
              <span style="color:var(--text-muted); font-size:1rem;">/10</span>
            </div>
            ${label ? `<span class="badge badge--${label}">${COPY.labels[label] ?? label}</span>` : ''}
          </div>
          ` : `
          <p style="color:var(--text-muted);">${COPY.categoryPage.comingSoon}</p>
          `}
        </div>

        <div class="divider"></div>

        <!-- Guía de contenido -->
        ${cat.fullGuide ? `
        <div style="margin-top:var(--space-10);" class="animate-fade-in-up delay-1">
          ${cat.fullGuide}
        </div>
        ` : guide ? `
        <div style="margin-top:var(--space-10);">

          <div class="card animate-fade-in-up delay-1" style="margin-bottom:var(--space-5); border-color: ${cat.color}22;">
            <h3 style="color:${cat.color}; margin-bottom:var(--space-3);">La realidad</h3>
            <p style="color:var(--text-dim); line-height:1.7;">${guide.reality}</p>
          </div>

          <div class="card animate-fade-in-up delay-2" style="margin-bottom:var(--space-5);">
            <h3 style="margin-bottom:var(--space-3);">Por qué te cuesta</h3>
            <p style="color:var(--text-dim); line-height:1.7;">${guide.why}</p>
          </div>

          <div class="card animate-fade-in-up delay-3" style="margin-bottom:var(--space-5);">
            <h3 style="margin-bottom:var(--space-3);">El sistema</h3>
            <p style="color:var(--text-dim); line-height:1.7; white-space:pre-line;">${guide.system}</p>
          </div>

          <div class="card animate-fade-in-up delay-4" style="
            border-color: ${cat.color}44;
            background: linear-gradient(135deg, var(--surface), ${cat.color}08);
          ">
            <h3 style="margin-bottom:var(--space-3);">🎯 Desafío de 30 días</h3>
            <p style="color:var(--text-dim); line-height:1.7; font-style:italic;">${guide.challenge}</p>
          </div>

        </div>
        ` : `<p style="color:var(--text-muted); margin-top:var(--space-8);">${COPY.categoryPage.comingSoon}</p>`}

        <div style="margin-top:var(--space-10); text-align:center;">
          <a href="/resultados" data-link class="btn btn--ghost">
            ← Volver al Mapa
          </a>
        </div>
      </div>
    </div>
  `;
}
