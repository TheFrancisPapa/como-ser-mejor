/**
 * Transitions.js — Transiciones entre páginas y pantallas.
 * Controla el overlay negro y las animaciones de entrada/salida.
 */

/** Lazy getter — el DOM no existe cuando el módulo se importa */
function getOverlay() {
  return document.getElementById('transition-overlay');
}

/**
 * Fade to black, ejecuta callback, fade back.
 */
export function crossFade(callback, durationMs = 300) {
  const overlay = getOverlay();
  if (!overlay) return callback();
  overlay.classList.add('active');
  setTimeout(() => {
    callback();
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 80);
  }, durationMs);
}

/**
 * Pantalla negra de 2 segundos para la activación del sistema secreto.
 * No hace fade de vuelta — el callback decide qué mostrar.
 */
export function secretBlackScreen(durationMs = 2000) {
  return new Promise((resolve) => {
    const overlay = getOverlay();
    if (!overlay) return resolve();
    overlay.classList.add('active');
    setTimeout(() => {
      resolve();
    }, durationMs);
  });
}

/**
 * Fade out del overlay (para después del secretBlackScreen).
 */
export function fadeOutOverlay(durationMs = 600) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const overlay = getOverlay();
      if (overlay) overlay.classList.remove('active');
      resolve();
    }, durationMs);
  });
}

/**
 * Anima la entrada de un elemento.
 */
export function animateIn(el, className = 'animate-fade-in-up') {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth; // force reflow
  el.classList.add(className);
}

/**
 * Aplica animaciones con delay en cascada a una lista de elementos.
 */
export function staggerIn(elements, className = 'animate-fade-in-up', baseDelay = 0) {
  elements.forEach((el, i) => {
    if (!el) return;
    el.style.animationDelay = `${baseDelay + i * 80}ms`;
    el.classList.add(className);
  });
}
