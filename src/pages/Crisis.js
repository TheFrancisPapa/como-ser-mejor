/**
 * Crisis.js — Pantalla de ayuda en casos de detección de señales de crisis.
 *
 * DISEÑO DELIBERADO:
 * - Fondo neutro (no negro dramático, no colores de marca). Blanco roto cálido.
 * - Sin gráficos, sin UI de diagnóstico, sin puntajes.
 * - Tono de cuidado genuino, ni clínico ni alarmista.
 * - La persona puede continuar el diagnóstico si así lo decide, sin presión.
 * - Esta interacción no persiste de forma identificable ni alimenta el perfil.
 */

import { navigate } from '../router.js';

// Recursos de ayuda — Argentina como mercado primario (rioplatense).
// Antes de publicar en producción: verificar que todos los números siguen activos.
const RESOURCES = [
  {
    country: 'Argentina',
    name: 'Centro de Asistencia al Suicida (CABA / GBA)',
    contact: '135',
    type: 'Atención de 8:00 a 0:00 hs',
    url: null,
  },
  {
    country: 'Argentina',
    name: 'Centro de Asistencia al Suicida (Resto del país)',
    contact: '0800 345 1435',
    type: 'Línea gratuita - Atención de 8:00 a 0:00 hs',
    url: null,
  },
  {
    country: 'Argentina',
    name: 'SAME (Sistema de Atención Médica de Emergencias)',
    contact: '107',
    type: 'Emergencias médicas 24h',
    url: null,
  },
  {
    country: 'Latinoamérica',
    name: 'ASISTE Internacional — directorio de líneas por país',
    contact: null,
    type: 'Web',
    url: 'https://www.asiste.life',
  },
  {
    country: 'España',
    name: 'Teléfono de la Esperanza',
    contact: '717 003 717',
    type: 'Teléfono 24h',
    url: null,
  },
];

/**
 * Renderiza la pantalla de crisis y bloquea el flujo normal del diagnóstico.
 * @param {Function} onContinue - callback para que el usuario retome el cuestionario
 * @param {'high'|'medium'} level - nivel de riesgo detectado
 */
export function renderCrisis(onContinue, level = 'medium') {
  const app = document.getElementById('app');

  const isHigh = level === 'high';

  app.innerHTML = `
    <div role="main" aria-labelledby="crisis-title" style="
      min-height:100vh;
      background: #faf9f7;
      color: #1a1a1a;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      padding: 48px 24px;
      font-family: 'Inter', system-ui, sans-serif;
    ">
      <div style="max-width:520px; width:100%;">

        <!-- Sin logo de marca aquí — solo texto -->
        <div class="animate-fade-in-up" style="margin-bottom:32px;">
          <p style="
            font-size:0.8rem;
            letter-spacing:0.08em;
            text-transform:uppercase;
            color:#888;
            margin-bottom:16px;
          ">Antes de continuar</p>

          <h2 id="crisis-title" tabindex="-1" style="
            font-family:'Fraunces', Georgia, serif;
            font-size:clamp(1.4rem, 4vw, 1.9rem);
            font-weight:600;
            line-height:1.3;
            color:#111;
            margin-bottom:16px;
          ">Lo que escribiste nos importa.</h2>

          <p style="
            font-size:1rem;
            line-height:1.7;
            color:#444;
            margin-bottom:${isHigh ? '24px' : '32px'};
          ">
            ${isHigh
              ? 'Notamos que estás pasando por algo muy difícil en este momento. No tenés que atravesarlo solo/a.'
              : 'Notamos que estás pasando por un momento muy difícil. Hay personas preparadas para escucharte.'}
          </p>

          ${isHigh ? `
          <p style="
            font-size:0.95rem;
            line-height:1.7;
            color:#333;
            padding:16px;
            background:#fff;
            border-left:3px solid #6b7280;
            border-radius:0 8px 8px 0;
            margin-bottom:32px;
          ">
            El diagnóstico puede esperar. Esta pantalla puede esperar. Primero, si podés, hablá con alguien.
          </p>
          ` : ''}
        </div>

        <!-- Recursos de ayuda -->
        <div class="animate-fade-in-up delay-2" style="margin-bottom:40px;">
          <p style="
            font-size:0.85rem;
            font-weight:600;
            color:#555;
            text-transform:uppercase;
            letter-spacing:0.06em;
            margin-bottom:16px;
          ">Podés hablar con alguien ahora</p>

          <div style="display:flex; flex-direction:column; gap:12px;">
            ${RESOURCES.map(r => `
              <div style="
                background:#fff;
                border:1px solid #e5e5e5;
                border-radius:10px;
                padding:16px 20px;
                display:flex;
                flex-direction:column;
                gap:4px;
              ">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
                  <div>
                    <span style="font-size:0.75rem; color:#888;">${r.country}</span>
                    <p style="font-size:0.95rem; font-weight:500; color:#111; margin-top:2px;">${r.name}</p>
                  </div>
                  ${r.contact ? `
                  <a href="tel:${r.contact.replace(/\s/g, '')}" style="
                    font-size:1.1rem;
                    font-weight:700;
                    color:#1a1a1a;
                    text-decoration:none;
                    white-space:nowrap;
                    padding:4px 0;
                  ">${r.contact}</a>
                  ` : ''}
                  ${r.url ? `
                  <a href="${r.url}" target="_blank" rel="noopener noreferrer" style="
                    font-size:0.85rem;
                    color:#555;
                    text-decoration:underline;
                  ">${r.url.replace('https://', '')}</a>
                  ` : ''}
                </div>
                <p style="font-size:0.78rem; color:#aaa;">${r.type}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Disclaimer de salud mental -->
        <div class="animate-fade-in-up delay-3" style="
          background:#f5f5f3;
          border-radius:8px;
          padding:16px;
          margin-bottom:40px;
        ">
          <p style="font-size:0.8rem; color:#666; line-height:1.6;">
            Este sitio no es un servicio de salud mental ni reemplaza la atención profesional.
            Si estás atravesando una crisis, por favor contactá a un profesional o a alguna de las líneas de arriba.
          </p>
        </div>

        <!-- Opciones para el usuario -->
        <div class="animate-fade-in-up delay-4" style="display:flex; flex-direction:column; gap:12px; align-items:center;">

          <button id="crisis-continue" style="
            width:100%;
            max-width:340px;
            padding:14px 24px;
            background:#1a1a1a;
            color:#fff;
            border:none;
            border-radius:999px;
            font-family:'Inter', sans-serif;
            font-size:0.95rem;
            font-weight:500;
            cursor:pointer;
            transition:opacity 200ms;
          "
          onmouseover="this.style.opacity=0.85"
          onmouseout="this.style.opacity=1"
          >
            Quiero continuar con el diagnóstico
          </button>

          <p style="font-size:0.8rem; color:#aaa; text-align:center; max-width:320px; line-height:1.5;">
            Podés volver a esto cuando quieras. No va a haber juicios de este lado.
          </p>
        </div>

      </div>
    </div>
  `;

  document.getElementById('crisis-continue').addEventListener('click', () => {
    if (typeof onContinue === 'function') onContinue();
  });

  // Focus management for accessibility
  setTimeout(() => {
    const title = document.getElementById('crisis-title');
    if (title) title.focus();
  }, 50);
}
