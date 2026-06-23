/**
 * reprobadoDetector.js — Detecta respuestas no serias en el diagnóstico.
 * PURO: recibe datos, devuelve resultado. Sin DOM, sin store, sin side effects.
 *
 * SEÑALES:
 * 1. Velocidad excesiva — ≥60% de preguntas respondidas en <3s
 * 2. Patrón lineal — misma respuesta en ≥70% de preguntas de escala
 * 3. Skip masivo — ≥50% de preguntas salteadas
 * 4. Combinación — 2 de los 3 criterios anteriores a nivel menor
 *
 * NO BLOQUEA. NO ALIMENTA EL SISTEMA SECRETO. NO GENERA EVENTO DE CRISIS.
 */

const THRESHOLDS = {
  // Umbrales principales (activación individual)
  speedRatio: 0.60,        // 60% respondidas en <3s
  speedMinMs: 3000,        // menos de 3 segundos = sospechoso
  linearRatio: 0.70,       // 70% misma respuesta en escalas
  skipRatio: 0.50,         // 50% de preguntas salteadas

  // Umbrales de combinación (2 de 3 a nivel menor)
  comboSpeedRatio: 0.40,
  comboLinearRatio: 0.50,
  comboSkipRatio: 0.35,
  comboMinSignals: 2,
};

/**
 * Detecta si el diagnóstico fue respondido sin seriedad.
 * @param {Object} params
 * @param {Object} params.answers - { questionId: value }
 * @param {Object} params.timing - { questionId: milliseconds }
 * @param {Object} params.skips - { questionId: { blockId, timeOnScreen } }
 * @param {number} params.totalQuestions - total de preguntas visibles durante la sesión
 * @returns {{ reprobado: boolean, reasons: string[], details: Object }}
 */
export function detectReprobado({ answers, timing, skips, totalQuestions }) {
  const reasons = [];
  const details = {};

  const answeredCount = Object.keys(answers).length;
  const skippedCount = Object.keys(skips).length;
  const total = totalQuestions || (answeredCount + skippedCount) || 1;

  // ── 1. Velocidad excesiva ──────────────────────────────────────────────────
  const fastAnswers = Object.entries(timing).filter(
    ([, ms]) => ms < THRESHOLDS.speedMinMs
  );
  const speedRatio = answeredCount > 0 ? fastAnswers.length / answeredCount : 0;
  details.speedRatio = speedRatio;
  details.fastCount = fastAnswers.length;
  details.answeredCount = answeredCount;

  const speedFail = speedRatio >= THRESHOLDS.speedRatio;
  const speedSoft = speedRatio >= THRESHOLDS.comboSpeedRatio;
  if (speedFail) {
    reasons.push('speed');
  }

  // ── 2. Patrón lineal ──────────────────────────────────────────────────────
  // Solo aplica a respuestas numéricas o de escala (tipo A, B, D)
  const scaleValues = Object.values(answers).filter(
    v => typeof v === 'number' || ['never', 'sometimes', 'usually', 'always',
      'strongly_agree', 'agree', 'unsure', 'disagree', 'dont_know'].includes(v)
  );

  let linearRatio = 0;
  if (scaleValues.length >= 5) {
    // Contar la respuesta más frecuente
    const freq = {};
    scaleValues.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    linearRatio = maxFreq / scaleValues.length;
  }
  details.linearRatio = linearRatio;
  details.scaleAnswerCount = scaleValues.length;

  const linearFail = linearRatio >= THRESHOLDS.linearRatio;
  const linearSoft = linearRatio >= THRESHOLDS.comboLinearRatio;
  if (linearFail) {
    reasons.push('linear');
  }

  // ── 3. Skip masivo ────────────────────────────────────────────────────────
  const skipRatio = total > 0 ? skippedCount / total : 0;
  details.skipRatio = skipRatio;
  details.skippedCount = skippedCount;
  details.totalQuestions = total;

  const skipFail = skipRatio >= THRESHOLDS.skipRatio;
  const skipSoft = skipRatio >= THRESHOLDS.comboSkipRatio;
  if (skipFail) {
    reasons.push('skips');
  }

  // ── 4. Combinación ────────────────────────────────────────────────────────
  if (!reasons.length) {
    const softSignals = [speedSoft, linearSoft, skipSoft].filter(Boolean).length;
    if (softSignals >= THRESHOLDS.comboMinSignals) {
      reasons.push('combo');
      details.comboSignals = softSignals;
    }
  }

  return {
    reprobado: reasons.length > 0,
    reasons,
    details,
  };
}

/**
 * Genera un texto descriptivo para el usuario según las razones.
 * No revela umbrales exactos — solo la observación.
 */
export function getReprobadoDescription(reasons) {
  const descriptions = {
    speed: 'Respondiste demasiado rápido. El diagnóstico necesita que pienses cada respuesta.',
    linear: 'Respondiste casi todo con el mismo valor. Eso no refleja una evaluación real.',
    skips: 'Salteaste la mayoría de las preguntas. No hay suficiente material para un diagnóstico.',
    combo: 'La combinación de velocidad, respuestas repetitivas y preguntas salteadas no permite un diagnóstico confiable.',
  };

  return reasons.map(r => descriptions[r] || '').filter(Boolean);
}
