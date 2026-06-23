/**
 * Landing.js — Página de inicio "¿De verdad te conocés?"
 */

import { COPY } from '../content/copy.js';
import { navigate } from '../router.js';
import { getState, setState, resetDiagnostic } from '../store.js';
import { staggerIn } from '../components/Transitions.js';
import { trackEvent, EVENT_TYPES } from '../engine/analytics.js';

export function renderLanding() {
  // Registrar tiempo de llegada al sitio
  const state = getState();
  if (!state.session.siteArrivalTime) {
    setState('session.siteArrivalTime', Date.now());
  }

  // Detectar si hay diagnóstico parcial guardado
  const hasPartialDiagnostic = (
    state.diagnostic &&
    state.diagnostic.answers &&
    Object.keys(state.diagnostic.answers).length > 2 &&
    (!state.results.scores || Object.keys(state.results.scores).length === 0)
  );

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="hero-gradient" style="min-height:100vh; display:flex; flex-direction:column;">

      <!-- Nav mínima -->
      <nav class="nav">
        <a href="/" data-link class="nav__logo">¿Cómo ser mejor<span>?</span></a>
      </nav>

      <!-- Hero -->
      <main style="flex:1; display:flex; align-items:center; justify-content:center; padding: 120px var(--space-6) var(--space-16);">
        <div style="max-width:640px; width:100%; text-align:center;">

          <!-- Headline -->
          <div class="landing-headline animate-fade-in-up">
            <h1 style="
              font-size: clamp(3rem, 8vw, 5.5rem);
              font-weight: 700;
              line-height: 1.05;
              letter-spacing: -0.03em;
              margin-bottom: var(--space-6);
              background: linear-gradient(135deg, #f0f0f8 30%, rgba(157,92,245,0.9));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            ">
              ${COPY.landing.headline}
            </h1>
          </div>

          <!-- Subheadline -->
          <div class="animate-fade-in-up delay-2">
            <p style="
              font-size: clamp(1rem, 2.5vw, 1.2rem);
              color: var(--text-dim);
              line-height: 1.7;
              max-width: 480px;
              margin: 0 auto var(--space-10);
              white-space: pre-line;
            ">${COPY.landing.subheadline}</p>
          </div>

          <!-- CTA -->
          <div class="animate-fade-in-up delay-3">
            <button id="cta-start" class="btn btn--primary btn--large animate-glow" style="margin-bottom: var(--space-5);">
              ${COPY.landing.cta}
            </button>
            <p style="font-size:0.82rem; color:var(--text-muted); font-style:italic; margin-bottom:var(--space-8);">
              ${COPY.landing.disclaimer}
            </p>
          </div>

          <!-- Meta info -->
          <div class="animate-fade-in-up delay-4" style="
            display:flex;
            gap:var(--space-6);
            justify-content:center;
            flex-wrap:wrap;
          ">
            <div class="meta-chip">
              <span style="opacity:0.5;">⏱</span>
              ${COPY.landing.timeEstimate}
            </div>
            <div class="meta-chip">
              <span style="opacity:0.5;">🔒</span>
              Sin registro
            </div>
          </div>

        </div>
      </main>

      <!-- Footer note -->
      <footer class="animate-fade-in delay-5" style="
        text-align:center;
        padding: var(--space-8) var(--space-6) var(--space-10);
        border-top: 1px solid var(--border);
      ">
        <p style="font-size:0.78rem; color:var(--text-muted); max-width:480px; margin:0 auto var(--space-3);">
          ${COPY.landing.privacy}
        </p>
        <p style="font-size:0.73rem; color:var(--text-muted); opacity:0.6;">
          ${COPY.landing.skipNote}
        </p>
        <div style="
          display:flex; gap:var(--space-5); justify-content:center; flex-wrap:wrap;
          margin-top:var(--space-5);
        ">
          <a href="/privacidad" data-link style="font-size:0.73rem; color:var(--text-muted); opacity:0.5; text-decoration:none;">
            Privacidad
          </a>
          <a href="/terminos" data-link style="font-size:0.73rem; color:var(--text-muted); opacity:0.5; text-decoration:none;">
            Términos
          </a>
          <span style="font-size:0.73rem; color:var(--text-muted); opacity:0.4;">+16 años</span>
        </div>
      </footer>

    </div>

    <!-- Background decoration -->
    <div style="
      position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden;
    ">
      <div style="
        position:absolute; top:-20%; left:50%; transform:translateX(-50%);
        width:600px; height:600px; border-radius:50%;
        background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
        animation: floatUp 8s ease-in-out infinite;
      "></div>
      <div style="
        position:absolute; bottom:-10%; right:-10%;
        width:400px; height:400px; border-radius:50%;
        background: radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%);
      "></div>
    </div>
  `;

  // Styles for meta chips (inline to keep self-contained)
  const style = document.createElement('style');
  style.textContent = `
    .meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 0.82rem;
      color: var(--text-dim);
    }
    .resume-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--surface);
      border: 1px solid var(--accent-border);
      border-radius: var(--radius-lg);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      z-index: 200;
      box-shadow: var(--shadow-accent);
      animation: fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
      max-width: calc(100vw - 48px);
    }
    .resume-banner p {
      font-size: 0.9rem;
      color: var(--text-dim);
      margin: 0;
    }
    .resume-banner__actions {
      display: flex;
      gap: 8px;
    }
  `;
  document.head.appendChild(style);

  // Event listeners
  document.getElementById('cta-start').addEventListener('click', () => {
    navigate('/diagnostico');
  });

  // Resume banner — si hay diagnóstico parcial
  if (hasPartialDiagnostic) {
    const banner = document.createElement('div');
    banner.className = 'resume-banner';
    banner.innerHTML = `
      <p>Tenés un diagnóstico incompleto guardado.</p>
      <div class="resume-banner__actions">
        <button id="resume-yes" class="btn btn--primary" style="padding:10px 20px; font-size:0.85rem;">
          Continuar
        </button>
        <button id="resume-no" class="btn btn--ghost" style="padding:10px 20px; font-size:0.85rem;">
          Empezar de nuevo
        </button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('resume-yes').addEventListener('click', () => {
      trackEvent(EVENT_TYPES.RESUME_ACCEPTED, {});
      banner.remove();
      navigate('/diagnostico');
    });

    document.getElementById('resume-no').addEventListener('click', () => {
      trackEvent(EVENT_TYPES.RESUME_REJECTED, {});
      resetDiagnostic();
      localStorage.removeItem('csm_state');
      localStorage.removeItem('csm_abandoned_at');
      banner.remove();
    });
  }

  // Stagger animation on elements
  staggerIn(
    document.querySelectorAll('.animate-fade-in-up'),
    'animate-fade-in-up',
    0
  );
}

