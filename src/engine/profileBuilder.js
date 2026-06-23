/**
 * profileBuilder.js — Ensambla el perfil final del usuario.
 * PURO: combina scores, triggers y fingerprint en el perfil visible + secreto.
 */

import { COPY } from '../content/copy.js';
import { runAlgorithm, getRedAlerts, countLowScores } from './algorithm.js';
import { buildSessionFingerprint } from './sessionTracker.js';
import { evaluateSecretSystem, generateSessionToken } from './secretSystem.js';
import { BLOCKS } from '../content/questions.js';

/**
 * Genera la frase resumen del perfil basada en combinaciones de scores.
 */
function buildSummary(scores, labels, priority) {
  const top = priority[0]; // categoría más urgente

  // Chequeos específicos de combinaciones
  if (labels.fisico === 'critico' && labels.mental !== 'critico' && labels.emocional !== 'critico') {
    return COPY.profileSummaries.bodyBlocks;
  }
  if (labels.emocional === 'critico' && (labels.mental !== 'critico' || labels.profesional !== 'critico')) {
    return COPY.profileSummaries.emotionalBlock;
  }
  if (labels.proposito === 'critico') {
    return COPY.profileSummaries.noDirection;
  }
  if (labels.habitos === 'critico' || labels.habitos === 'mejorar') {
    if (Object.values(labels).filter(l => l === 'solido').length >= 3) {
      return COPY.profileSummaries.habitLoop;
    }
  }
  if (labels.social === 'critico' || labels.social === 'mejorar') {
    if (Object.values(labels).filter(l => l === 'solido').length >= 4) {
      return COPY.profileSummaries.socialDrain;
    }
  }
  if (countLowScores(scores) >= 6) {
    return COPY.profileSummaries.scattered;
  }
  if (Object.values(labels).filter(l => l === 'solido').length >= 5) {
    return COPY.profileSummaries.highPerformer;
  }
  if (labels.profesional === 'mejorar' || labels.profesional === 'critico') {
    return COPY.profileSummaries.executionGap;
  }

  return COPY.profileSummaries.default;
}

/**
 * Genera las frases explicativas de por qué cada categoría es prioritaria.
 */
function buildPriorityReason(categoryId, label, score) {
  const reasons = {
    fisico: {
      critico: 'Tu energía y sueño están afectando todo lo demás.',
      mejorar: 'Tu base física está por debajo de donde debería estar.',
      desarrollar: 'Hay margen concreto de mejora en tu cuerpo.',
    },
    mental: {
      critico: 'Tu capacidad de concentración está comprometida.',
      mejorar: 'El foco y la claridad mental necesitan trabajo.',
      desarrollar: 'Podés sacarle más partido a cómo usás tu mente.',
    },
    emocional: {
      critico: 'Tu mundo interior está en un punto crítico que frena todo lo demás.',
      mejorar: 'Hay algo emocional sin resolver que pesa más de lo que parece.',
      desarrollar: 'La regulación emocional tiene espacio para crecer.',
    },
    social: {
      critico: 'Tus vínculos te cuestan más energía de la que te dan.',
      mejorar: 'Hay patrones relacionales que te limitan.',
      desarrollar: 'Tus vínculos pueden ser más genuinos y satisfactorios.',
    },
    proposito: {
      critico: 'No tenés dirección clara. Todo el esfuerzo se dispersa.',
      mejorar: 'La falta de claridad sobre adónde vas te frena.',
      desarrollar: 'Definir mejor tu dirección multiplicaría tu esfuerzo.',
    },
    financiero: {
      critico: 'Tu situación financiera genera estrés que se filtra en todo lo demás.',
      mejorar: 'El control del dinero necesita atención urgente.',
      desarrollar: 'Podés mejorar tu relación con el dinero.',
    },
    profesional: {
      critico: 'Lo que hacés para vivir te drena en vez de energizarte.',
      mejorar: 'Tu desarrollo profesional está estancado.',
      desarrollar: 'Hay espacio para crecer más en lo profesional.',
    },
    habitos: {
      critico: 'Tus hábitos actuales te frenan activamente.',
      mejorar: 'Los hábitos son el punto de palanca más importante ahora.',
      desarrollar: 'Afinar tus hábitos va a amplificar todo lo demás.',
    },
  };

  return reasons[categoryId]?.[label] ?? 'Esta área tiene margen claro de mejora.';
}

/**
 * Determina qué categorías tuvieron muchos saltos (para "Lo que no respondiste").
 */
function findSkippedSections(skips, minSkips = 2) {
  const byBlock = {};
  Object.values(skips).forEach(({ blockId }) => {
    if (!blockId) return;
    byBlock[blockId] = (byBlock[blockId] || 0) + 1;
  });
  return Object.entries(byBlock)
    .filter(([_, count]) => count >= minSkips)
    .map(([id]) => id);
}

/**
 * Función principal: ensambla el perfil completo.
 */
export function buildProfile(diagnosticState, sessionState) {
  const {
    openingScore,
    answers,
    skips,
    timing,
    textResponses,
    closingResponse,
    closingSkipped,
    abandonedAt,
    resumedAt,
  } = diagnosticState;

  // 1. Fingerprint de sesión
  const fingerprint = buildSessionFingerprint({
    openingScore,
    answers,
    skips,
    timing,
    textResponses,
    closingResponse,
    closingSkipped,
    session: sessionState,
    abandonedAt,
    resumedAt,
  });

  // 2. Algoritmo de scoring y priorización
  const { scores, labels, confidence, priority, blindSpots, priorities } = runAlgorithm({
    answers,
    skips,
    openingScore,
    skipWall: fingerprint.skipWall,
  });

  // 3. Sistema secreto
  const { archetype, triggersActivated } = evaluateSecretSystem(
    fingerprint,
    scores,
    confidence,
    false // isSecondDiagnosis — V1 siempre false
  );

  // 4. Token de sesión para página secreta
  const sessionToken = archetype ? generateSessionToken(fingerprint) : null;
  const archetypeWithToken = archetype
    ? { ...archetype, sessionToken }
    : null;

  // 5. Secciones salteadas
  const skippedSections = findSkippedSections(skips);

  // 6. Frase resumen
  const summary = buildSummary(scores, labels, priority);

  // 7. Razones de prioridad para las top 3
  const topCategories = priority.slice(0, 3).map(catId => ({
    id: catId,
    score: scores[catId],
    label: labels[catId],
    reason: buildPriorityReason(catId, labels[catId], scores[catId]),
    priority: priorities[catId],
  }));

  // 8. Contraste de percepción
  let perceptionContrast = 'match';
  if (openingScore >= 7) {
    const lowCount = Object.values(scores).filter(s => s !== null && s < 4).length;
    if (lowCount >= 3) perceptionContrast = 'over';
  } else if (openingScore <= 4) {
    const highCount = Object.values(scores).filter(s => s !== null && s >= 7).length;
    if (highCount >= 4) perceptionContrast = 'under';
  }

  return {
    scores,
    labels,
    confidence,
    priority,
    priorities,
    blindSpots,
    topCategories,
    summary,
    skippedSections,
    fingerprint,
    secretActivated: !!archetype,
    archetype: archetypeWithToken,
    triggersActivated,
    perceptionContrast,
    openingScore,
  };
}
