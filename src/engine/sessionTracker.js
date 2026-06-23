/**
 * sessionTracker.js — Captura de huella de sesión.
 * PURO: no toca el DOM ni el store. Recibe datos, devuelve objetos.
 * La huella es la materia prima del sistema secreto.
 */

/**
 * Calcula el hash simple de un string (no criptográfico — solo para comparar).
 * Nunca almacena el texto original.
 */
export function hashText(text) {
  if (!text || typeof text !== 'string') return null;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Evalúa si un texto libre es "sustancial" para el trigger T8/T5.
 * Criterio: >30 palabras Y tiene puntuación compleja (coma, punto, punto y coma).
 */
export function isSubstantialText(text) {
  if (!text || typeof text !== 'string') return false;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const hasComplexPunctuation = /[,;:—]/.test(text);
  return words.length >= 30 && hasComplexPunctuation;
}

/**
 * Evalúa si un texto libre es no-trivial (para T5: al menos algo real escrito).
 * Criterio: >10 palabras.
 */
export function isNonTrivialText(text) {
  if (!text || typeof text !== 'string') return false;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length >= 10;
}

/**
 * Detecta el patrón de "muro" de saltos: todos concentrados en una sola categoría.
 * @param {Object} skips - { questionId: { blockId, timeOnScreen } }
 * @returns {string|null} - blockId si hay muro, null si no
 */
export function detectSkipWall(skips) {
  const skipsByBlock = {};
  Object.values(skips).forEach(({ blockId }) => {
    if (!blockId) return;
    skipsByBlock[blockId] = (skipsByBlock[blockId] || 0) + 1;
  });

  const totalSkips = Object.values(skipsByBlock).reduce((a, b) => a + b, 0);
  if (totalSkips < 2) return null;

  // "Muro" = una categoría concentra el 60%+ de los saltos y tiene ≥2 saltos
  for (const [blockId, count] of Object.entries(skipsByBlock)) {
    if (count >= 2 && count / totalSkips >= 0.6) {
      return blockId;
    }
  }
  return null;
}

/**
 * Detecta "fuga sistemática": saltos dispersos en preguntas de texto libre.
 */
export function detectTextFlight(skips, allQuestions) {
  const textQuestionIds = new Set(
    allQuestions.flatMap(b => b.questions)
      .filter(q => q.type === 'E')
      .map(q => q.id)
  );
  const skippedTextQuestions = Object.keys(skips).filter(id => textQuestionIds.has(id));
  return skippedTextQuestions.length >= 2;
}

/**
 * Construye la huella completa de la sesión.
 * Recibe el estado bruto del diagnóstico y devuelve un objeto estructurado.
 */
export function buildSessionFingerprint({
  openingScore,
  answers,
  skips,
  timing,
  textResponses,
  closingResponse,
  closingSkipped,
  session,
  abandonedAt,
  resumedAt,
}) {
  const now = Date.now();

  // Hora local al inicio del diagnóstico
  const startHour = session.localHour;

  // Tiempo total en el diagnóstico
  const diagnosticDuration = session.diagnosticStartTime
    ? now - session.diagnosticStartTime
    : null;

  // Tiempo de navegación antes de iniciar
  const preStartNavigation = session.siteArrivalTime && session.diagnosticStartTime
    ? (session.diagnosticStartTime - session.siteArrivalTime) / 1000 // en segundos
    : 0;

  // ¿Hubo silencio >90s en alguna pregunta?
  const silentPauses = Object.entries(timing)
    .filter(([_, ms]) => ms >= 90000)
    .map(([id]) => id);

  // ¿Se abandonó y se volvió a completar en <48h?
  const persistence = abandonedAt && resumedAt
    ? (resumedAt - abandonedAt) < 48 * 60 * 60 * 1000
    : false;

  // Total de saltos
  const totalSkips = Object.keys(skips).length;

  // Patrón de muro
  const skipWall = detectSkipWall(skips);

  // Hashes de texto libre (nunca el texto crudo)
  const textHashes = {};
  Object.entries(textResponses).forEach(([id, text]) => {
    textHashes[id] = hashText(text);
  });

  return {
    startHour,
    diagnosticDuration,
    preStartNavigation,
    openingScore,
    totalSkips,
    skipWall,
    silentPauses,
    persistence,
    closingSkipped,
    closingWordCount: closingResponse
      ? closingResponse.trim().split(/\s+/).filter(w => w.length > 0).length
      : 0,
    closingIsSubstantial: isSubstantialText(closingResponse),
    hasNonTrivialTextResponse: Object.values(textResponses).some(isNonTrivialText),
    textHashes,
    answerCount: Object.keys(answers).length,
  };
}
