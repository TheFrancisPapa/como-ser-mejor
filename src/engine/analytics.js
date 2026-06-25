/**
 * analytics.js — Instrumentación de eventos para calibración del producto.
 * PURO en su core: genera objetos de evento. El guardado en localStorage
 * es el único side-effect, deliberado para V1 sin backend.
 *
 * V2: reemplazar persistEvents() por envío a Plausible/Umami/endpoint propio.
 */

const STORAGE_KEY = 'csm_analytics';
const MAX_EVENTS = 500; // Límite para no reventar localStorage

/**
 * Tipos de evento soportados.
 */
const EVENT_TYPES = {
  QUESTION_ANSWERED: 'question_answered',
  QUESTION_SKIPPED: 'question_skipped',
  BLOCK_COMPLETED: 'block_completed',
  DIAGNOSTIC_COMPLETED: 'diagnostic_completed',
  DIAGNOSTIC_ABANDONED: 'diagnostic_abandoned',
  CRISIS_DETECTED: 'crisis_detected',  // sin texto — solo que ocurrió
  SECRET_ACTIVATED: 'secret_activated',
  ARCHETYPE_ASSIGNED: 'archetype_assigned',
  REPROBADO_TRIGGERED: 'reprobado_triggered',
  COOLDOWN_SHOWN: 'cooldown_shown',
  COOLDOWN_BYPASSED: 'cooldown_bypassed',
  RESUME_ACCEPTED: 'resume_accepted',
  RESUME_REJECTED: 'resume_rejected',
  QUIZ_PASSED: 'quiz_passed',
  QUIZ_FAILED: 'quiz_failed',
  FINAL_EXAM_PASSED: 'final_exam_passed',
  FINAL_EXAM_FAILED: 'final_exam_failed',
};

/**
 * Genera un evento de analytics.
 * @param {string} type - uno de EVENT_TYPES
 * @param {Object} payload - datos específicos del evento (sin PII)
 */
export function trackEvent(type, payload = {}) {
  const event = {
    type,
    ts: Date.now(),
    ...payload,
  };

  persistEvent(event);
  return event;
}

// ─── Persistence (V1: localStorage) ──────────────────────────────────────────

function persistEvent(event) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let events = raw ? JSON.parse(raw) : [];

    events.push(event);

    // Rotate: mantener solo los últimos MAX_EVENTS
    if (events.length > MAX_EVENTS) {
      events = events.slice(-MAX_EVENTS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (_) {
    // localStorage lleno o inaccesible — silenciar
  }
}

/**
 * Lee todos los eventos acumulados (para panel de analytics futuro).
 */
export function getEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

/**
 * Limpia todos los eventos.
 */
export function clearEvents() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

/**
 * Calcula métricas agregadas sobre los eventos almacenados.
 * Útil para un panel interno de producto.
 */
export function getAggregatedMetrics() {
  const events = getEvents();
  if (!events.length) return null;

  const answered = events.filter(e => e.type === EVENT_TYPES.QUESTION_ANSWERED);
  const skipped = events.filter(e => e.type === EVENT_TYPES.QUESTION_SKIPPED);
  const completed = events.filter(e => e.type === EVENT_TYPES.DIAGNOSTIC_COMPLETED);
  const crises = events.filter(e => e.type === EVENT_TYPES.CRISIS_DETECTED);
  const secrets = events.filter(e => e.type === EVENT_TYPES.SECRET_ACTIVATED);
  const reprobados = events.filter(e => e.type === EVENT_TYPES.REPROBADO_TRIGGERED);

  // Skip rate por pregunta
  const skipsByQuestion = {};
  skipped.forEach(e => {
    const qId = e.questionId;
    if (qId) skipsByQuestion[qId] = (skipsByQuestion[qId] || 0) + 1;
  });

  const finalExamsFailed = events.filter(e => e.type === EVENT_TYPES.FINAL_EXAM_FAILED);

  return {
    totalEvents: events.length,
    diagnosticsCompleted: completed.length,
    questionsAnswered: answered.length,
    questionsSkipped: skipped.length,
    overallSkipRate: (answered.length + skipped.length) > 0
      ? (skipped.length / (answered.length + skipped.length) * 100).toFixed(1) + '%'
      : '0%',
    crisisDetections: crises.length,
    secretActivations: secrets.length,
    reprobadoTriggers: reprobados.length,
    finalExamsFailed: finalExamsFailed.length,
    skipsByQuestion,
  };
}

export { EVENT_TYPES };
