/**
 * Legal.js — Política de privacidad y términos de uso.
 * Tono: directo, llano, sin lenguaje de abogados.
 * Param: { params: { section } } → 'privacidad' | 'terminos'
 */

import { navigate } from '../router.js';

export function renderLegal({ params } = {}) {
  const section = params?.section || 'privacidad';
  const isPrivacy = section !== 'terminos';

  document.getElementById('app').innerHTML = `
    <div style="min-height:100vh; padding-top:80px; padding-bottom:80px;">

      <!-- Nav -->
      <nav class="nav">
        <a href="/" data-link class="nav__logo">¿Cómo ser mejor<span>?</span></a>
      </nav>

      <div class="container" style="max-width:640px; padding-top:var(--space-12);">

        <!-- Tabs -->
        <div style="
          display:flex; gap:var(--space-2); margin-bottom:var(--space-10);
          border-bottom:1px solid var(--border); padding-bottom:var(--space-4);
        ">
          <a href="/privacidad" data-link style="
            padding:8px 16px; border-radius:var(--radius-sm);
            font-size:0.9rem; font-weight:500; text-decoration:none;
            background:${isPrivacy ? 'var(--accent-dim)' : 'transparent'};
            color:${isPrivacy ? 'var(--accent-light)' : 'var(--text-dim)'};
            border:1px solid ${isPrivacy ? 'var(--accent-border)' : 'transparent'};
          ">Privacidad</a>
          <a href="/terminos" data-link style="
            padding:8px 16px; border-radius:var(--radius-sm);
            font-size:0.9rem; font-weight:500; text-decoration:none;
            background:${!isPrivacy ? 'var(--accent-dim)' : 'transparent'};
            color:${!isPrivacy ? 'var(--accent-light)' : 'var(--text-dim)'};
            border:1px solid ${!isPrivacy ? 'var(--accent-border)' : 'transparent'};
          ">Términos</a>
        </div>

        ${isPrivacy ? renderPrivacy() : renderTerms()}

        <div style="margin-top:var(--space-12);">
          <a href="/" data-link class="btn btn--ghost">← Volver al inicio</a>
        </div>

      </div>
    </div>
  `;
}

function renderPrivacy() {
  return `
    <div class="animate-fade-in-up">
      <h1 style="margin-bottom:var(--space-3);">Política de privacidad</h1>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:var(--space-10);">
        Última actualización: junio 2025
      </p>

      ${section(`¿Qué datos se guardan?`, `
        <p>En la versión actual del sitio, <strong>todos los datos viven en tu propio dispositivo</strong> (localStorage del navegador). No se envía nada a ningún servidor de terceros.</p>
        <p>Lo que se guarda localmente:</p>
        <ul>
          <li>Tus respuestas al diagnóstico (en tu dispositivo, no en servidores nuestros).</li>
          <li>Los tiempos que tardaste en responder cada pregunta.</li>
          <li>Qué preguntas decidiste saltear y cuánto tardaste en hacerlo.</li>
          <li>Un resumen (hash) de lo que escribiste en los campos de texto libre. El texto original nunca se almacena completo — solo una huella que no permite reconstruirlo.</li>
          <li>Tu puntaje en cada área y el perfil resultante.</li>
        </ul>
        <p>Ninguno de estos datos sale de tu dispositivo sin tu acción explícita.</p>
      `)}

      ${section(`¿Qué no se guarda?`, `
        <p>No guardamos ni procesamos:</p>
        <ul>
          <li>Tu nombre, correo electrónico ni ningún identificador personal (a menos que crees una cuenta — funcionalidad no disponible aún en esta versión).</li>
          <li>El contenido literal de tus respuestas abiertas. Solo el hash.</li>
          <li>Tu dirección IP ni tu ubicación.</li>
          <li>Cookies de seguimiento de terceros.</li>
        </ul>
      `)}

      ${section(`El comportamiento de sesión`, `
        <p>El sitio registra tu comportamiento durante el diagnóstico — no solo qué respondés sino cómo: qué pausas tomás, qué evitás responder, qué tardás en cada pregunta. Esto se usa para generar un perfil más preciso y para el funcionamiento interno del sistema de diagnóstico.</p>
        <p>Esta información también vive solo en tu dispositivo y no se comparte.</p>
      `)}

      ${section(`Detección de crisis`, `
        <p>El sitio analiza automáticamente los textos que escribís en los campos libres para detectar señales de angustia severa. Si el sistema detecta algo, te muestra una pantalla con recursos de ayuda.</p>
        <p>Esta detección corre localmente en tu navegador. <strong>No se registra ni se envía a ningún servidor</strong>. Si se activa, no queda ningún rastro en tu perfil ni en ningún sistema.</p>
      `)}

      ${section(`Edad mínima`, `
        <p>Este sitio está diseñado para personas de <strong>16 años o más</strong>. El contenido emocional es intenso y requiere cierta madurez para procesarlo de forma productiva. Si tenés menos de 16, te pedimos que no lo uses.</p>
      `)}

      ${section(`Tus derechos`, `
        <p>Dado que todos los datos viven en tu dispositivo, podés borrarlos en cualquier momento limpiando el localStorage de tu navegador. No hay nada nuestro que borrar porque no guardamos nada.</p>
        <p>Cuando en el futuro haya sistema de cuentas, se agregarán opciones explícitas para exportar y eliminar tu perfil completo.</p>
      `)}

      ${section(`Cambios a esta política`, `
        <p>Si cambiamos algo relevante, lo vamos a comunicar de forma visible en el sitio. No te vamos a enterrar en texto legal que nadie lee.</p>
      `)}
    </div>
  `;
}

function renderTerms() {
  return `
    <div class="animate-fade-in-up">
      <h1 style="margin-bottom:var(--space-3);">Términos de uso</h1>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:var(--space-10);">
        Última actualización: junio 2025
      </p>

      ${section(`Qué es este sitio`, `
        <p>Una herramienta de autoconocimiento y diagnóstico personal. No es un servicio médico, psicológico ni de salud mental. No reemplaza la atención de un profesional.</p>
        <p>El sitio te hace preguntas, analiza tus respuestas y te da una perspectiva ordenada sobre áreas de tu vida. Eso es todo lo que hace.</p>
      `)}

      ${section(`Disclaimer de salud mental`, `
        <p><strong>Este sitio no es una herramienta clínica.</strong> Los resultados del diagnóstico son una perspectiva basada en tus propias respuestas — no son un diagnóstico médico, psicológico ni de ningún otro tipo profesional.</p>
        <p>Si estás atravesando una crisis emocional o de salud mental, por favor buscá ayuda profesional o contactá una línea de crisis. En Argentina: <strong>135</strong> (Centro de Asistencia al Suicida, gratuito, 24h).</p>
      `)}

      ${section(`Quién puede usar el sitio`, `
        <p>Personas de 16 años o más. Al usar el sitio, confirmás que tenés esa edad.</p>
      `)}

      ${section(`Límites del sistema`, `
        <p>El algoritmo que genera tu perfil se basa en tus respuestas. Sus resultados son orientativos, no absolutos. Podés tener una percepción distinta a lo que muestra el diagnóstico — eso también es información válida.</p>
        <p>El sitio no garantiza ningún resultado específico ni mejora concreta. Es una herramienta de reflexión, no una solución.</p>
      `)}

      ${section(`El Sistema Secreto`, `
        <p>Existe una capa adicional del sitio que se activa en base al comportamiento durante el diagnóstico — no a ningún pago ni elección. Si se activa en tu sesión, lo vas a notar. No está diseñado para explicarse antes de que ocurra.</p>
        <p>Esta capa procesa el comportamiento de sesión (tiempos, pausas, patrones) de la misma forma que el resto del diagnóstico: localmente, en tu dispositivo.</p>
      `)}

      ${section(`Propiedad intelectual`, `
        <p>El contenido del sitio (textos, algoritmos, estructura del diagnóstico) es propiedad de los creadores. No está permitido copiarlo ni reproducirlo sin autorización.</p>
      `)}

      ${section(`Contacto`, `
        <p>Para cualquier consulta sobre estos términos, podés escribirnos. El medio de contacto se va a publicar próximamente.</p>
      `)}
    </div>
  `;
}

function section(title, content) {
  return `
    <div style="margin-bottom:var(--space-10);">
      <h3 style="
        font-size:1.05rem;
        margin-bottom:var(--space-4);
        color:var(--text);
        font-family:var(--font-ui);
        font-weight:600;
      ">${title}</h3>
      <div style="color:var(--text-dim); line-height:1.8; font-size:0.95rem;">
        ${content}
      </div>
    </div>
  `;
}
