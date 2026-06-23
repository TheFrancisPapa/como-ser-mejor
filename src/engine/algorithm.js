/**
 * algorithm.js — Motor de scoring y priorización.
 * PURO: recibe respuestas, devuelve scores y ranking. Cero DOM.
 * Migrable a un endpoint de servidor sin reescribir.
 */

import { BLOCKS, TYPE_D_SCORES } from '../content/questions.js';
import { CATEGORIES, CATEGORY_ORDER } from '../content/categories.js';

// ─── Conversión de respuestas a scores (0-10) ────────────────────────────────

/**
 * Convierte una respuesta de tipo B (frecuencia con opciones custom) a score.
 * Las opciones ya tienen score definido en el bloque de preguntas.
 */
function scoreTypeB(question, answer) {
  if (answer === null || answer === undefined) return null;
  const option = question.options.find(o => o.value === answer);
  return option ? option.score : null;
}

/**
 * Convierte una respuesta de tipo A (escala 1-10) a score.
 */
function scoreTypeA(question, answer) {
  if (answer === null || answer === undefined) return null;
  const val = Number(answer);
  if (isNaN(val)) return null;
  // Si framing es negative (e.g. "cuánto te importa lo que piensan"), invertir
  return question.framing === 'negative' ? 10 - val : val;
}

/**
 * Convierte una respuesta de tipo D (Likert) a score.
 */
function scoreTypeD(question, answer) {
  if (!answer) return null;
  const table = TYPE_D_SCORES[question.framing === 'negative' ? 'negative' : 'positive'];
  return table[answer] ?? null;
}

/**
 * Tipos C, E, F no generan score numérico directo (orientan contenido).
 */
function scoreNeutral() {
  return null;
}

/**
 * Obtiene el score de una sola respuesta según el tipo de pregunta.
 */
export function scoreQuestion(question, answer) {
  switch (question.type) {
    case 'A': return scoreTypeA(question, answer);
    case 'B': return scoreTypeB(question, answer);
    case 'D': return scoreTypeD(question, answer);
    default: return scoreNeutral();
  }
}

// ─── Score por categoría ──────────────────────────────────────────────────────

/**
 * Calcula el score de una categoría a partir de las respuestas dadas.
 * Retorna: { score: 0-10 | null, confidence: 'high'|'medium'|'low', answeredCount, totalCount }
 */
export function scoreCategoryFromAnswers(block, answers, skips) {
  const questions = block.questions;
  const scoreable = questions.filter(q => ['A', 'B', 'D'].includes(q.type));

  let total = 0;
  let count = 0;
  let skippedCount = 0;

  scoreable.forEach(q => {
    const answer = answers[q.id];
    const skipped = skips[q.id];

    if (skipped) {
      skippedCount++;
      return;
    }
    if (answer === undefined || answer === null) return;

    const s = scoreQuestion(q, answer);
    if (s !== null) {
      total += s;
      count++;
    }
  });

  if (count === 0) {
    return {
      score: null,
      confidence: 'low',
      answeredCount: 0,
      totalCount: scoreable.length,
      skippedCount,
    };
  }

  const score = total / count;
  const ratio = count / scoreable.length;
  const confidence = ratio >= 0.7 ? 'high' : ratio >= 0.4 ? 'medium' : 'low';

  return {
    score: Math.round(score * 10) / 10,
    confidence,
    answeredCount: count,
    totalCount: scoreable.length,
    skippedCount,
  };
}

// ─── Algoritmo de priorización ────────────────────────────────────────────────

/**
 * Etiqueta de estado según score.
 */
export function getLabel(score, confidence) {
  if (confidence === 'low' || score === null) return 'incompleto';
  if (score < 3) return 'critico';
  if (score < 5) return 'mejorar';
  if (score < 7) return 'desarrollar';
  return 'solido';
}

/**
 * Fórmula de prioridad:
 * Priority = (10 - score) × multiplier × urgency + protectedBonus
 */
function calcPriority(score, categoryId, label, isProtected) {
  if (score === null) {
    // Sin datos: prioridad media si es protected, baja si no
    return isProtected ? 8 : 3;
  }

  const cat = CATEGORIES[categoryId];
  const multiplier = cat?.impactMultiplier ?? 1.0;
  const urgency = label === 'critico' ? 2 : 1;
  const protectedBonus = isProtected ? 5 : 0;

  return (10 - score) * multiplier * urgency + protectedBonus;
}

/**
 * Factor de discrepancia: si el usuario se calificó alto pero el score es bajo,
 * boost de prioridad para ese punto ciego.
 */
function blindSpotBoost(openingScore, categoryScore) {
  if (!openingScore || !categoryScore) return 0;
  if (openingScore >= 7 && categoryScore < 4) return 2;
  return 0;
}

/**
 * Función principal: calcula todos los scores y el ranking de prioridad.
 * @param {Object} answers - { questionId: value }
 * @param {Object} skips - { questionId: { blockId, ... } }
 * @param {number|null} openingScore - 1-10
 * @param {string|null} skipWall - blockId del muro de saltos o null
 * @returns {Object} - { scores, labels, confidence, priority, blindSpots }
 */
export function runAlgorithm({ answers, skips, openingScore, skipWall }) {
  const scores = {};
  const labels = {};
  const confidence = {};
  const priorities = {};
  const blindSpots = [];

  BLOCKS.forEach(block => {
    const { score, confidence: conf } = scoreCategoryFromAnswers(block, answers, skips);
    const isProtected = skipWall === block.id;
    const label = getLabel(score, conf);

    scores[block.id] = score;
    labels[block.id] = label;
    confidence[block.id] = conf;

    const boost = blindSpotBoost(openingScore, score);
    priorities[block.id] = calcPriority(score, block.id, label, isProtected) + boost;

    if (boost > 0) {
      blindSpots.push(block.id);
    }
  });

  // Ordenar por prioridad descendente
  const priority = CATEGORY_ORDER
    .slice()
    .sort((a, b) => (priorities[b] ?? 0) - (priorities[a] ?? 0));

  return { scores, labels, confidence, priority, blindSpots, priorities };
}

// ─── Detección de áreas críticas ─────────────────────────────────────────────

/**
 * Detecta categorías con alerta roja (score < 3).
 */
export function getRedAlerts(scores, labels) {
  return Object.entries(labels)
    .filter(([_, label]) => label === 'critico')
    .map(([id]) => id);
}

/**
 * Cuántas categorías tienen score bajo (<5).
 */
export function countLowScores(scores) {
  return Object.values(scores).filter(s => s !== null && s < 5).length;
}
