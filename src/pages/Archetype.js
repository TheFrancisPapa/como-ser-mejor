/**
 * Archetype.js — Página secreta por arquetipo.
 * Accesible solo desde el símbolo del dashboard, validando el token de sesión.
 * No tiene URL fija — se sirve bajo /_s/:token
 */

import { COPY } from '../content/copy.js';
import { ARCHETYPES } from '../content/archetypes.js';
import { navigate } from '../router.js';

export function renderArchetype({ params }) {
  const { token } = params;

  // Validar token contra el almacenado en localStorage
  const storedToken = localStorage.getItem('csm_secret_token');
  const storedArchetypeId = localStorage.getItem('csm_secret_archetype');

  if (!token || token !== storedToken || !storedArchetypeId) {
    // Token inválido o no existe — redirigir sin explicación
    navigate('/');
    return;
  }

  const archetype = ARCHETYPES[storedArchetypeId];
  if (!archetype) {
    navigate('/');
    return;
  }

  const palette = archetype.palette;

  // Aplicar paleta específica del arquetipo al body
  document.body.style.setProperty('--bg', palette.bg);
  document.body.style.setProperty('--bg-2', palette.surface);
  document.body.style.setProperty('--surface', palette.surface);
  document.body.style.setProperty('--surface-hover', palette.surface);
  document.body.style.setProperty('--text', palette.text);
  document.body.style.setProperty('--accent', palette.accent);
  document.body.style.setProperty('--accent-light', palette.accent);
  document.body.style.setProperty('--border', palette.border);
  document.body.style.backgroundColor = palette.bg;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="
      min-height:100vh;
      background:${palette.bg};
      color:${palette.text};
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      padding: var(--space-16) var(--space-6);
    ">

      <!-- Símbolo -->
      <div class="animate-fade-in" style="
        font-size: 2.5rem;
        color: ${palette.accent};
        margin-bottom: var(--space-8);
        letter-spacing: 0.05em;
        opacity: 0.8;
      ">${archetype.symbol}</div>

      <!-- Mensaje de activación -->
      <div style="max-width:520px; text-align:center;" class="animate-fade-in-up delay-1">
        <h1 style="
          font-family:var(--font-display);
          font-size:clamp(1.4rem, 4vw, 2.2rem);
          font-weight:400;
          font-style:italic;
          color:${palette.text};
          margin-bottom:var(--space-3);
          line-height:1.3;
        ">${archetype.activationMessage}</h1>

        ${archetype.activationSub ? `
        <p style="
          font-size:1rem;
          color:${palette.text};
          opacity:0.55;
          margin-bottom:var(--space-12);
        ">${archetype.activationSub}</p>
        ` : '<div style="margin-bottom:var(--space-12);"></div>'}
      </div>

      <!-- Divider -->
      <div class="animate-fade-in delay-2" style="
        width:40px; height:1px;
        background:${palette.accent};
        opacity:0.3;
        margin-bottom:var(--space-12);
      "></div>

      <!-- Contenido stub -->
      <div style="max-width:560px; width:100%;" class="animate-fade-in-up delay-3">

        ${archetype.contentStub.intro ? `
        <div style="
          margin-bottom:var(--space-8);
          padding: var(--space-6);
          border:1px solid ${palette.border};
          border-radius:var(--radius-lg);
          background:rgba(255,255,255,0.02);
        ">
          <p style="
            font-family:var(--font-display);
            font-size:1.1rem;
            line-height:1.7;
            color:${palette.text};
            opacity:0.85;
          ">${archetype.contentStub.intro}</p>
        </div>
        ` : ''}

        ${archetype.contentStub.approach ? `
        <div style="
          margin-bottom:var(--space-8);
          padding: var(--space-6);
          border:1px solid ${palette.border};
          border-radius:var(--radius-lg);
          background:rgba(255,255,255,0.02);
        ">
          <p style="
            font-size:0.9rem;
            color:${palette.text};
            opacity:0.6;
            text-transform:uppercase;
            letter-spacing:0.08em;
            margin-bottom:var(--space-3);
          ">El enfoque</p>
          <p style="
            font-size:1rem;
            line-height:1.7;
            color:${palette.text};
            opacity:0.8;
          ">${archetype.contentStub.approach}</p>
        </div>
        ` : ''}

        ${archetype.contentStub.firstStep ? `
        <div style="
          padding: var(--space-6);
          border:1px solid ${palette.accent};
          border-radius:var(--radius-lg);
          background:rgba(255,255,255,0.03);
        ">
          <p style="
            font-size:0.9rem;
            color:${palette.accent};
            opacity:0.8;
            text-transform:uppercase;
            letter-spacing:0.08em;
            margin-bottom:var(--space-3);
          ">Primer paso</p>
          <p style="
            font-size:1.05rem;
            line-height:1.7;
            color:${palette.text};
            font-style:italic;
          ">"${archetype.contentStub.firstStep}"</p>
        </div>
        ` : ''}
      </div>

      <!-- Tono -->
      <div class="animate-fade-in delay-4" style="
        margin-top:var(--space-12);
        text-align:center;
        max-width:360px;
      ">
        <p style="
          font-size:0.8rem;
          color:${palette.text};
          opacity:0.35;
          font-style:italic;
          line-height:1.6;
        ">${archetype.tone}</p>
      </div>

      <!-- Volver (discreto) -->
      <div style="margin-top:var(--space-16);" class="animate-fade-in delay-5">
        <button id="back-btn" style="
          background:transparent;
          border:none;
          color:${palette.text};
          opacity:0.3;
          font-size:0.8rem;
          cursor:pointer;
          font-family:var(--font-ui);
          letter-spacing:0.05em;
          transition:opacity 200ms;
        " onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=0.3">
          ← volver
        </button>
      </div>

    </div>
  `;

  document.getElementById('back-btn')?.addEventListener('click', () => {
    // Resetear estilos del body al volver
    document.body.removeAttribute('style');
    history.back();
  });
}
