/**
 * Quiz.js — Componente visual para los quizzes de cada subtema.
 * Maneja la UI de renderizado de preguntas, selección, y feedback.
 */
import { trackEvent, EVENT_TYPES } from '../engine/analytics.js';
import { evaluateSubtopicQuiz } from '../engine/quizEngine.js';

export function createQuizUI(categoryId, subtopicId, questions, onComplete) {
  const container = document.createElement('div');
  container.className = 'quiz-container p-6 bg-base-800 rounded-xl border border-base-700 mt-8 mb-12 shadow-lg';
  
  let currentStep = 0;
  const answers = {}; // { questionId: selectedOptionId }

  function renderStep() {
    container.innerHTML = '';
    
    if (currentStep < questions.length) {
      const q = questions[currentStep];
      
      const header = document.createElement('div');
      header.className = 'mb-6 flex justify-between items-center text-sm text-base-400 font-medium tracking-wide';
      header.innerHTML = `<span>Pregunta ${currentStep + 1} de ${questions.length}</span><span class="text-accent-500">Prueba de comprensión</span>`;
      
      const title = document.createElement('h3');
      title.className = 'text-lg font-bold text-base-100 mb-6 leading-relaxed';
      title.textContent = q.text;
      
      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'space-y-3';
      
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-4 rounded-lg border border-base-600 bg-base-900 hover:border-accent-500 hover:bg-base-800 transition-all text-base-200';
        btn.textContent = opt.text;
        btn.onclick = () => handleSelect(q.id, opt.id);
        optionsContainer.appendChild(btn);
      });
      
      container.appendChild(header);
      container.appendChild(title);
      container.appendChild(optionsContainer);
      
    } else {
      renderResults();
    }
  }

  function handleSelect(questionId, optionId) {
    answers[questionId] = optionId;
    currentStep++;
    renderStep();
  }

  function renderResults() {
    const result = evaluateSubtopicQuiz(questions, answers);
    const { passed, score, correctCount, total } = result;
    
    trackEvent(passed ? EVENT_TYPES.QUIZ_PASSED : EVENT_TYPES.QUIZ_FAILED, {
      categoryId,
      subtopicId,
      score,
    });

    const isSuccess = passed;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'text-center animate-fade-in-up';
    
    const icon = document.createElement('div');
    icon.className = `inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${isSuccess ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`;
    icon.innerHTML = isSuccess 
      ? '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      : '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
      
    const title = document.createElement('h3');
    title.className = 'text-xl font-bold text-base-100 mb-2';
    title.textContent = isSuccess ? '¡Comprendido!' : 'Necesitas repasar este tema';
    
    const desc = document.createElement('p');
    desc.className = 'text-base-300 mb-8';
    desc.textContent = isSuccess 
      ? `Has acertado ${correctCount} de ${total} preguntas. Puedes continuar con el siguiente tema.`
      : `Has acertado ${correctCount} de ${total} preguntas. Te recomendamos volver a leer la sección antes de avanzar.`;
      
    const btn = document.createElement('button');
    btn.className = `px-6 py-3 rounded-lg font-bold transition-all ${isSuccess ? 'bg-accent-600 hover:bg-accent-500 text-white' : 'bg-base-700 hover:bg-base-600 text-base-100'}`;
    btn.textContent = isSuccess ? 'Continuar' : 'Reintentar Quiz';
    btn.onclick = () => {
      if (isSuccess) {
        if (onComplete) onComplete(result);
      } else {
        currentStep = 0;
        // Limpiamos respuestas
        for (let key in answers) delete answers[key];
        renderStep();
      }
    };
    
    wrapper.appendChild(icon);
    wrapper.appendChild(title);
    wrapper.appendChild(desc);
    wrapper.appendChild(btn);
    
    container.appendChild(wrapper);
  }

  renderStep();
  return container;
}
