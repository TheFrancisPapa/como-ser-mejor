/**
 * quizEngine.js — Lógica pura de evaluación de quizzes y exámenes finales
 * Independiente del DOM y estado.
 */

// Función utilitaria para mezclar arrays
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Selecciona 5 preguntas al azar de un banco de preguntas de un subtema.
 */
export function generateSubtopicQuiz(questionBank, count = 5) {
  if (!questionBank || questionBank.length === 0) return [];
  return shuffle(questionBank).slice(0, count);
}

/**
 * Evalúa las respuestas de un quiz de subtema.
 * @param {Array} questions - Las preguntas generadas para el quiz.
 * @param {Object} answers - Objeto con { questionId: selectedOptionId }
 * @returns {Object} { score, passed, correctCount, total }
 */
export function evaluateSubtopicQuiz(questions, answers) {
  let correctCount = 0;
  const total = questions.length;
  
  questions.forEach(q => {
    if (answers[q.id] === q.correctOptionId) {
      correctCount++;
    }
  });

  const score = total > 0 ? (correctCount / total) * 100 : 0;
  const passed = score >= 70; // 70-75% passing threshold

  return { score, passed, correctCount, total };
}

/**
 * Genera el examen final de la categoría seleccionando 2 preguntas al azar
 * de cada subtema de la categoría.
 */
export function generateFinalExam(categoryBanks) {
  // categoryBanks = { subtopicId: [question1, question2, ...] }
  let examQuestions = [];
  
  for (const [subtopicId, bank] of Object.entries(categoryBanks)) {
    const selected = shuffle(bank).slice(0, 2);
    // Agregamos el subtopicId a la pregunta para el análisis posterior
    const taggedQuestions = selected.map(q => ({ ...q, subtopicId }));
    examQuestions = examQuestions.concat(taggedQuestions);
  }
  
  return shuffle(examQuestions);
}

/**
 * Evalúa el examen final y determina el cooldown o los subtemas a repasar.
 * @param {Array} questions - Preguntas del examen final (con subtopicId)
 * @param {Object} answers - { questionId: selectedOptionId }
 * @param {Boolean} isSensitive - Si la categoría es sensible (ej. Emocional)
 * @param {Number} previousAttempts - Cantidad de veces que ya reprobó el examen
 * @returns {Object} Resultado detallado
 */
export function evaluateFinalExam(questions, answers, isSensitive = false, previousAttempts = 0) {
  let correctCount = 0;
  const total = questions.length;
  const subtopicErrors = {}; // { subtopicId: errorCount }

  questions.forEach(q => {
    if (answers[q.id] === q.correctOptionId) {
      correctCount++;
    } else {
      subtopicErrors[q.subtopicId] = (subtopicErrors[q.subtopicId] || 0) + 1;
    }
  });

  const score = total > 0 ? (correctCount / total) * 100 : 0;
  const passed = score >= 80; // 80% passing threshold for final exam
  
  let cooldownDuration = 0;
  let toReview = [];
  let resetAll = false;

  if (!passed) {
    // Si no pasa, determinamos cooldown
    const attempt = previousAttempts + 1;
    if (attempt === 1) {
      cooldownDuration = 0; // Reintento inmediato disponible
    } else if (attempt === 2) {
      cooldownDuration = 24 * 60 * 60 * 1000; // 24 horas
    } else if (attempt === 3) {
      cooldownDuration = 72 * 60 * 60 * 1000; // 72 horas
    } else {
      cooldownDuration = 7 * 24 * 60 * 60 * 1000; // 7 días
    }

    // Determinamos subtemas a repasar o si reseteamos todo
    if (isSensitive) {
      // En sensibles, solo los 2-3 con más errores
      const sortedErrors = Object.entries(subtopicErrors)
        .sort((a, b) => b[1] - a[1])
        .filter(entry => entry[1] > 0);
      
      toReview = sortedErrors.slice(0, 3).map(entry => entry[0]);
    } else {
      // En estándar, se resetea todo
      resetAll = true;
    }
  }

  return {
    score,
    passed,
    correctCount,
    total,
    cooldownDuration,
    toReview,
    resetAll,
    newAttemptsCount: passed ? 0 : previousAttempts + 1
  };
}
