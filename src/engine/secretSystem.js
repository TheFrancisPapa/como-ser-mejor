/**
 * secretSystem.js — Detección de triggers y asignación de arquetipos.
 * PURO: recibe la huella de sesión + scores, devuelve arquetipo o null.
 * La lógica nunca llega al navegador en producción (backend en V2).
 */

import { ARCHETYPES, ARCHETYPE_PRIORITY } from '../content/archetypes.js';

// ─── Evaluación de los 9 triggers ────────────────────────────────────────────

/**
 * T1 — El fondo honesto:
 * Score menor a 3 en 6+ categorías, con alta consistencia interna.
 */
function evalT1({ scores, confidence }) {
  const lowCount = Object.values(scores).filter(s => s !== null && s < 3).length;
  const highConfidence = Object.values(confidence).filter(c => c === 'high').length;
  return lowCount >= 4 && highConfidence >= 5;
}

/**
 * T2 — La paradoja de la confianza:
 * Autocalificación alta (7-10) + scores bajos (<4) en 5+ categorías.
 */
function evalT2({ openingScore, scores }) {
  // Spec 12.2: autocalificación 7-10 + scores <4 en 5 o más categorías
  if (!openingScore || openingScore < 7) return false;
  const lowCount = Object.values(scores).filter(s => s !== null && s < 4).length;
  return lowCount >= 5;
}

/**
 * T3 — El reloj:
 * Sesión iniciada entre las 00:30 y las 05:00.
 */
function evalT3({ startHour }) {
  if (startHour === null || startHour === undefined) return false;
  return startHour >= 0 && startHour < 5 || startHour === 0 && startHour >= 0.5;
  // Simplificado: hora >= 0 y < 5, con minutos >=30 para la media noche
}

/**
 * T3 — versión corregida.
 */
function evalT3Clean({ startHour, startMinute }) {
  if (startHour === null) return false;
  const totalMinutes = startHour * 60 + (startMinute || 0);
  return totalMinutes >= 30 && totalMinutes < 300; // 00:30 a 05:00
}

/**
 * T4 — La perseverancia:
 * Abandonó y volvió dentro de las 48 horas.
 */
function evalT4({ persistence }) {
  return persistence === true;
}

/**
 * T5 — La respuesta que nadie escribe:
 * Texto real (>10 palabras) en al menos una pregunta opcional.
 */
function evalT5({ hasNonTrivialTextResponse }) {
  return hasNonTrivialTextResponse === true;
}

/**
 * T6 — El detective:
 * Más de 3 minutos navegando el sitio antes de iniciar.
 */
function evalT6({ preStartNavigation }) {
  return preStartNavigation >= 180; // 3 minutos en segundos
}

/**
 * T7 — El silencio:
 * Pausa >90 segundos en al menos una pregunta sensible.
 */
function evalT7({ silentPauses }) {
  return silentPauses && silentPauses.length >= 1;
}

/**
 * T8 — La pregunta de cierre:
 * Respuesta sustancial (>30 palabras, puntuación compleja).
 */
function evalT8({ closingIsSubstantial, closingSkipped }) {
  return !closingSkipped && closingIsSubstantial === true;
}

/**
 * T9 — El área protegida:
 * Patrón de muro de saltos en una categoría.
 */
function evalT9({ skipWall }) {
  return skipWall !== null && skipWall !== undefined;
}

// ─── Evaluación de triggers especiales para arquetipos ───────────────────────

function evalPhysicalHigh({ scores }) {
  return scores.fisico !== null && scores.fisico >= 8;
}

function evalEmotionalLow({ scores }) {
  return scores.emocional !== null && scores.emocional < 3;
}

function evalPurposeZero({ scores }) {
  return scores.proposito !== null && scores.proposito < 3;
}

function evalHighTextQuality({ closingWordCount }) {
  return closingWordCount >= 50;
}

// ─── Asignación de arquetipos ─────────────────────────────────────────────────

/**
 * Evalúa todos los triggers y determina qué arquetipo activar.
 * Regla de activación:
 * - Mínimo 3 triggers simultáneos
 * - Entre ellos debe estar T8 (cierre) O T9 (área protegida)
 * @returns {{ archetype: Object|null, triggersActivated: string[] }}
 */
export function evaluateSecretSystem(fingerprint, scores, confidence, isSecondDiagnosis = false) {
  const ctx = { ...fingerprint, scores, confidence };

  // Evaluar los 9 triggers base
  const triggered = [];
  if (evalT1(ctx)) triggered.push('T1');
  if (evalT2(ctx)) triggered.push('T2');
  if (evalT3Clean({ startHour: fingerprint.startHour, startMinute: fingerprint.startMinute })) triggered.push('T3');
  if (evalT4(ctx)) triggered.push('T4');
  if (evalT5(ctx)) triggered.push('T5');
  if (evalT6(ctx)) triggered.push('T6');
  if (evalT7(ctx)) triggered.push('T7');
  if (evalT8(ctx)) triggered.push('T8');
  if (evalT9(ctx)) triggered.push('T9');

  // Triggers especiales
  const physicalHigh = evalPhysicalHigh(ctx);
  const emotionalLow = evalEmotionalLow(ctx);
  const highTextQuality = evalHighTextQuality(ctx);

  // Regla de activación: ≥3 triggers, incluyendo T8 o T9
  const hasT8orT9 = triggered.includes('T8') || triggered.includes('T9');
  if (triggered.length < 3 || !hasT8orT9) {
    return { archetype: null, triggersActivated: triggered };
  }

  // ─── Arquetipo EVOLVED (solo en segundo diagnóstico) ─────────────────────
  if (isSecondDiagnosis && triggered.length >= 3) {
    return { archetype: ARCHETYPES.EVOLVED, triggersActivated: triggered };
  }

  // ─── Asignación por arquetipo en orden de prioridad ──────────────────────

  // ZERO: T1 + T8 + muchas categorías bajas
  if (triggered.includes('T1') && triggered.includes('T8')) {
    return { archetype: ARCHETYPES.ZERO, triggersActivated: triggered };
  }

  // OPERATOR: T2 + T9 + calidad de texto alta
  if (triggered.includes('T2') && triggered.includes('T9') && highTextQuality) {
    return { archetype: ARCHETYPES.OPERATOR, triggersActivated: triggered };
  }

  // PHYSICAL: físico muy alto + emocional muy bajo
  if (physicalHigh && emotionalLow && triggered.length >= 3) {
    return { archetype: ARCHETYPES.PHYSICAL, triggersActivated: triggered };
  }

  // INVERSE: propósito muy bajo con todo lo demás OK + T7 (silencio)
  if (evalPurposeZero(ctx) && triggered.includes('T7') && !triggered.includes('T1')) {
    return { archetype: ARCHETYPES.INVERSE, triggersActivated: triggered };
  }

  // UNNAMED: resto de combinaciones que superan el umbral
  return { archetype: ARCHETYPES.UNNAMED, triggersActivated: triggered };
}

/**
 * Genera un token de sesión único para la URL de la página secreta.
 * No es criptográfico — solo opaco para la URL.
 */
export function generateSessionToken(fingerprint) {
  const raw = JSON.stringify({
    h: fingerprint.textHashes,
    t: fingerprint.startHour,
    s: fingerprint.totalSkips,
    ts: Date.now(),
  });
  // Simple base64-like encoding
  return btoa(raw).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_').slice(0, 32);
}
