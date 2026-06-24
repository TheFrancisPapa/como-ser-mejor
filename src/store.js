/**
 * store.js — Pub-sub state store (~55 líneas)
 * Estado centralizado sin librería. Funciones subscribe/emit.
 * Separado del DOM — solo datos.
 */

const listeners = {};

const initialState = {
  // Sesión antes del diagnóstico
  session: {
    siteArrivalTime: null,    // timestamp cuando llegó al sitio
    diagnosticStartTime: null, // timestamp cuando arrancó el cuestionario
    localHour: null,           // hora local al iniciar
  },

  // Diagnóstico en curso
  diagnostic: {
    phase: 'idle', // idle | opening | pre-select | questions | checkpoint | closing | processing
    openingScore: null,         // 1-10 (pregunta de apertura)
    preSelectedAreas: [],       // áreas elegidas en multiselección
    currentBlock: 0,            // 0-7
    currentQuestionIdx: 0,
    answers: {},                // { questionId: value }
    skips: {},                  // { questionId: { timeOnScreen, returnedToRead, blockId } }
    timing: {},                 // { questionId: milliseconds }
    textResponses: {},          // { questionId: string }
    questionStartTime: null,    // timestamp de cuando apareció la pregunta actual
    closingResponse: null,
    closingSkipped: false,
    abandonedAt: null,          // para trigger T4
    resumedAt: null,
  },

  // Resultados
  results: {
    scores: {},         // { categoryId: 0-10 }
    priority: [],       // categorías ordenadas por urgencia
    labels: {},         // { categoryId: 'critico'|'mejorar'|'desarrollar'|'solido'|'incompleto' }
    summary: '',        // frase resumen del perfil
    blindSpots: [],     // categorías con discrepancia percepción vs realidad
    skippedSections: [],// categorías con muchos saltos
    secretActivated: false,
    archetype: null,    // null | { id, symbol, palette, tone, sessionToken }
    triggersActivated: [],
    lastCompletedAt: null, // timestamp de última completación (para cooldown 72h)
    reprobado: false,      // si el diagnóstico fue marcado como no confiable
  },

  // Sistema de aprendizaje (Quizzes y exámenes)
  learning: {
    progress: {}, // { categoryId: { passedSubtopics: ['id1', 'id2'], finalAttempts: 0, cooldownUntil: null, toReview: [] } }
  },
};

let state = deepClone(initialState);

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function getState() {
  return deepClone(state);
}

export function setState(path, value) {
  const keys = path.split('.');
  let target = state;
  for (let i = 0; i < keys.length - 1; i++) {
    target = target[keys[i]];
  }
  target[keys[keys.length - 1]] = value;
  emit('change', { path, value });
  emit(`change:${path}`, value);
}

export function mergeState(path, value) {
  const keys = path.split('.');
  let target = state;
  for (let i = 0; i < keys.length - 1; i++) {
    target = target[keys[i]];
  }
  const leaf = keys[keys.length - 1];
  target[leaf] = { ...target[leaf], ...value };
  emit('change', { path, value });
  emit(`change:${path}`, target[leaf]);
}

export function subscribe(event, fn) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
  return () => {
    listeners[event] = listeners[event].filter(f => f !== fn);
  };
}

function emit(event, data) {
  (listeners[event] || []).forEach(fn => fn(data));
}

export function resetDiagnostic() {
  state.diagnostic = deepClone(initialState.diagnostic);
  state.results = deepClone(initialState.results);
  saveToStorage();
  emit('change', { path: 'diagnostic', value: state.diagnostic });
}

// Persistencia en localStorage
export function saveToStorage() {
  try {
    localStorage.setItem('csm_state', JSON.stringify({
      diagnostic: state.diagnostic,
      results: state.results,
      session: state.session,
      learning: state.learning,
    }));
  } catch (_) {}
}

export function loadFromStorage() {
  try {
    const saved = localStorage.getItem('csm_state');
    if (!saved) return false;
    const parsed = JSON.parse(saved);
    if (parsed.diagnostic) state.diagnostic = { ...deepClone(initialState.diagnostic), ...parsed.diagnostic };
    if (parsed.results) state.results = { ...deepClone(initialState.results), ...parsed.results };
    if (parsed.session) state.session = { ...deepClone(initialState.session), ...parsed.session };
    if (parsed.learning) state.learning = { ...deepClone(initialState.learning), ...parsed.learning };
    return true;
  } catch (_) {
    return false;
  }
}

