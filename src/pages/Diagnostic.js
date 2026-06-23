/**
 * Diagnostic.js — El cuestionario completo.
 * Gestiona todo el flujo: apertura → pre-selección → 8 bloques → checkpoints → cierre.
 * Captura huella de sesión en tiempo real.
 */

import { COPY } from '../content/copy.js';
import { BLOCKS, PRE_SELECT_OPTIONS, TYPE_D_SCORES, CHECKPOINT_MAP } from '../content/questions.js';
import { getState, setState, mergeState, saveToStorage, resetDiagnostic } from '../store.js';
import { navigate } from '../router.js';
import { detectCrisis } from '../engine/crisisDetector.js';
import { renderCrisis } from './Crisis.js';
import { trackEvent, EVENT_TYPES } from '../engine/analytics.js';

// ─── Estado interno del diagnóstico ─────────────────────────────────────────

let phase = 'opening'; // opening | system-response | pre-select | block | checkpoint | closing
let currentBlock = 0;
let currentQuestionIdx = 0;
let questionStartTime = Date.now();
let preSelectedAreas = [];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getApp() { return document.getElementById('app'); }

function recordQuestionStart() {
  questionStartTime = Date.now();
  mergeState('diagnostic', { questionStartTime });
}

function recordAnswer(questionId, value) {
  const elapsed = Date.now() - questionStartTime;
  const state = getState();
  const answers = { ...state.diagnostic.answers, [questionId]: value };
  const timing = { ...state.diagnostic.timing, [questionId]: elapsed };
  mergeState('diagnostic', { answers, timing });
  saveToStorage();
  trackEvent(EVENT_TYPES.QUESTION_ANSWERED, { questionId, timeMs: elapsed });
}

function recordSkip(questionId, blockId) {
  const elapsed = Date.now() - questionStartTime;
  const state = getState();
  const skips = { ...state.diagnostic.skips, [questionId]: { blockId, timeOnScreen: elapsed } };
  mergeState('diagnostic', { skips });
  saveToStorage();
  trackEvent(EVENT_TYPES.QUESTION_SKIPPED, { questionId, blockId, timeMs: elapsed });
}

function recordTextResponse(questionId, text) {
  const state = getState();
  const textResponses = { ...state.diagnostic.textResponses, [questionId]: text };
  mergeState('diagnostic', { textResponses });
  saveToStorage();

  // Crisis detection corre en paralelo — prioridad absoluta sobre cualquier otro flujo
  // No alimenta puntaje ni huella de sesión
  if (text && text.trim().length > 10) {
    const { detected, level } = detectCrisis(text);
    if (detected) {
      renderCrisis(() => {
        // El usuario elige continuar — re-render de la pantalla donde estaba
        renderPhase();
      }, level);
    }
  }
}

// Determina si una pregunta condicional debe mostrarse basado en respuestas actuales
function isConditionalVisible(question) {
  if (!question.conditional) return true;
  const state = getState();
  const { dependsOn, operator, value } = question.conditional;
  const depAnswer = state.diagnostic.answers[dependsOn];
  if (depAnswer === undefined || depAnswer === null) return false;

  switch (operator) {
    case 'lt': return depAnswer < value;
    case 'lte': return depAnswer <= value;
    case 'gt': return depAnswer > value;
    case 'gte': return depAnswer >= value;
    case 'eq': return depAnswer === value;
    case 'lte_d': // para tipo D: respuesta negativa
      return ['disagree', 'dont_know', 'unsure'].includes(depAnswer);
    default: return true;
  }
}

// Filtra las preguntas visibles del bloque actual
function getVisibleQuestions(blockIndex) {
  return BLOCKS[blockIndex].questions.filter(isConditionalVisible);
}

// Progreso total estimado (para la barra)
function calcProgress() {
  const totalBlocks = BLOCKS.length;
  const blockProgress = currentBlock / totalBlocks;
  const questionProgress = currentBlock < totalBlocks
    ? (currentQuestionIdx / Math.max(getVisibleQuestions(currentBlock).length, 1)) / totalBlocks
    : 0;
  return Math.min((blockProgress + questionProgress) * 100, 97);
}

// ─── Render principal ─────────────────────────────────────────────────────────

export function renderDiagnostic() {
  const state = getState();

  // ── Cooldown de 72 horas ────────────────────────────────────────────────
  const lastCompleted = state.results.lastCompletedAt;
  const COOLDOWN_MS = 72 * 60 * 60 * 1000; // 72 horas
  if (lastCompleted && (Date.now() - lastCompleted < COOLDOWN_MS)) {
    const hoursRemaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastCompleted)) / (60 * 60 * 1000));
    renderCooldownScreen(hoursRemaining);
    return;
  }

  // Inicializar estado si es primera vez
  if (!state.session.diagnosticStartTime) {
    const now = Date.now();
    const localHour = new Date().getHours();
    const localMinute = new Date().getMinutes();
    mergeState('session', { diagnosticStartTime: now, localHour, localMinute });
    mergeState('diagnostic', { phase: 'opening' });
  }

  // T4 — La perseverancia: detectar si el usuario volvió después de abandonar
  const savedAbandon = localStorage.getItem('csm_abandoned_at');
  if (savedAbandon && !state.diagnostic.resumedAt) {
    const abandonedAt = parseInt(savedAbandon);
    const resumedAt = Date.now();
    mergeState('diagnostic', { abandonedAt, resumedAt });
    localStorage.removeItem('csm_abandoned_at');
    saveToStorage();
  }

  // Registrar abandono si el usuario cierra/recarga mientras está en diagnóstico
  const beforeUnloadHandler = () => {
    if (phase !== 'idle') {
      localStorage.setItem('csm_abandoned_at', Date.now().toString());
      saveToStorage();
    }
  };
  window.removeEventListener('beforeunload', beforeUnloadHandler);
  window.addEventListener('beforeunload', beforeUnloadHandler);

  renderPhase();
}


function renderPhase() {
  switch (phase) {
    case 'opening': renderOpening(); break;
    case 'system-response': renderSystemResponse(); break;
    case 'pre-select': renderPreSelect(); break;
    case 'block': renderBlock(); break;
    case 'checkpoint': renderCheckpoint(); break;
    case 'closing': renderClosing(); break;
  }
}

// ─── FASE: Pregunta de apertura ───────────────────────────────────────────────

function renderOpening() {
  recordQuestionStart();
  const app = getApp();
  app.innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      padding: var(--space-12) var(--space-6);
      text-align:center;
    ">
      <div style="max-width:520px; width:100%;" class="animate-fade-in-up">
        <p style="color:var(--text-muted); font-size:0.8rem; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:var(--space-8);">
          Antes de empezar
        </p>
        <h2 style="font-size:clamp(1.4rem, 4vw, 2rem); margin-bottom:var(--space-10); line-height:1.3;">
          ${COPY.opening.question}
        </h2>

        <!-- Slider -->
        <div class="slider-wrapper" style="margin-bottom: var(--space-10);">
          <div class="slider-track">
            <div class="slider-fill" id="slider-fill" style="width:40%;"></div>
            <input
              type="range" class="slider" id="opening-slider"
              min="1" max="10" value="4" step="1"
            />
          </div>
          <div class="slider-labels">
            <span>1 — Poco</span>
            <span>10 — Muchísimo</span>
          </div>
          <div class="slider-value" id="slider-display">4</div>
        </div>

        <button id="opening-continue" class="btn btn--primary btn--large" style="width:100%; max-width:320px;">
          ${COPY.opening.continueBtn}
        </button>
      </div>
    </div>
  `;

  const slider = document.getElementById('opening-slider');
  const display = document.getElementById('slider-display');
  const fill = document.getElementById('slider-fill');

  function updateSlider(val) {
    display.textContent = val;
    fill.style.width = `${(val - 1) / 9 * 100}%`;
  }

  slider.addEventListener('input', () => updateSlider(slider.value));

  document.getElementById('opening-continue').addEventListener('click', () => {
    const val = parseInt(slider.value);
    setState('diagnostic.openingScore', val);
    recordAnswer('opening', val);
    phase = 'system-response';
    renderSystemResponse(val);
  });
}

// ─── FASE: Respuesta del sistema ──────────────────────────────────────────────

function renderSystemResponse(score) {
  const stateScore = score ?? getState().diagnostic.openingScore;
  let response;
  if (stateScore <= 3) response = COPY.opening.systemResponses.low;
  else if (stateScore <= 6) response = COPY.opening.systemResponses.mid;
  else if (stateScore <= 9) response = COPY.opening.systemResponses.high;
  else response = COPY.opening.systemResponses.perfect;

  const app = getApp();
  app.innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      padding: var(--space-12) var(--space-6);
      text-align:center;
    ">
      <div style="max-width:480px;" class="animate-fade-in-scale">
        <p style="
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 4vw, 1.8rem);
          font-style: italic;
          color: var(--text);
          margin-bottom: var(--space-10);
          line-height: 1.4;
        ">"${response}"</p>
        <button id="continue-to-preselect" class="btn btn--ghost" style="min-width:200px;">
          Empezar
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('continue-to-preselect')?.addEventListener('click', () => {
      phase = 'pre-select';
      renderPreSelect();
    });
  }, 100);
}

// ─── FASE: Pre-selección de áreas ────────────────────────────────────────────

function renderPreSelect() {
  preSelectedAreas = [];
  const app = getApp();
  app.innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      padding: 80px var(--space-6) var(--space-16);
    ">
      <!-- Progress bar top -->
      <div style="padding: var(--space-4) 0 var(--space-8);">
        <div class="progress-bar"><div class="progress-bar__fill" style="width:2%;"></div></div>
      </div>

      <div style="max-width:var(--max-width); width:100%; margin:0 auto; flex:1;">
        <p class="animate-fade-in-up" style="color:var(--text-muted); font-size:0.8rem; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:var(--space-4);">
          Paso previo
        </p>
        <h2 class="animate-fade-in-up delay-1" style="margin-bottom:var(--space-3);">
          ${COPY.preSelect.question}
        </h2>
        <p class="animate-fade-in-up delay-2" style="color:var(--text-dim); font-size:0.9rem; margin-bottom:var(--space-8);">
          ${COPY.preSelect.subtext}
        </p>

        <div class="multi-grid animate-fade-in-up delay-3" id="area-grid">
          ${PRE_SELECT_OPTIONS.map(opt => `
            <div class="multi-item" data-value="${opt.value}" id="area-${opt.value}">
              <span class="multi-item__icon">${opt.icon}</span>
              <span class="multi-item__label">${opt.label}</span>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: var(--space-10); text-align:center;">
          <button id="preselect-continue" class="btn btn--primary btn--large" style="min-width:280px;">
            ${COPY.preSelect.continueBtn}
          </button>
        </div>
      </div>
    </div>
  `;

  // Multi-select logic (max 3)
  document.querySelectorAll('.multi-item').forEach(item => {
    item.addEventListener('click', () => {
      const val = item.dataset.value;
      if (item.classList.contains('selected')) {
        item.classList.remove('selected');
        preSelectedAreas = preSelectedAreas.filter(v => v !== val);
      } else {
        if (preSelectedAreas.length >= 3) {
          // Deselect first selected
          const firstSelected = document.querySelector('.multi-item.selected');
          if (firstSelected) {
            preSelectedAreas = preSelectedAreas.filter(v => v !== firstSelected.dataset.value);
            firstSelected.classList.remove('selected');
          }
        }
        item.classList.add('selected');
        preSelectedAreas.push(val);
      }
    });
  });

  document.getElementById('preselect-continue').addEventListener('click', () => {
    mergeState('diagnostic', { preSelectedAreas });
    currentBlock = 0;
    currentQuestionIdx = 0;
    phase = 'block';
    renderBlock();
  });
}

// ─── FASE: Bloque de preguntas ────────────────────────────────────────────────

function renderBlock() {
  const block = BLOCKS[currentBlock];
  const questions = getVisibleQuestions(currentBlock);
  const question = questions[currentQuestionIdx];

  if (!question) {
    // Fin del bloque
    advanceBlock();
    return;
  }

  recordQuestionStart();

  const progress = calcProgress();
  const app = getApp();

  app.innerHTML = `
    <div style="min-height:100vh; display:flex; flex-direction:column; padding-top:60px;">

      <!-- Progress top -->
      <div style="padding: var(--space-4) var(--space-6) 0;">
        <div class="progress-meta">
          <span class="progress-label">${COPY.diagnostic.blockOfTotal(currentBlock + 1, BLOCKS.length)} — ${block.title}</span>
          <span class="progress-label">${Math.round(progress)}%</span>
        </div>
        <div class="progress-bar"><div class="progress-bar__fill" style="width:${progress}%;"></div></div>
      </div>

      <!-- Question area -->
      <div style="
        flex:1; display:flex; align-items:center; justify-content:center;
        padding: var(--space-10) var(--space-6) var(--space-8);
      ">
        <div style="max-width:var(--max-width); width:100%;" class="question-enter">

          ${(block.id === 'emocional' && currentQuestionIdx === 0) ? `
            <div style="
              background:var(--surface); border:1px solid var(--border);
              border-radius:var(--radius-sm); padding:10px 14px;
              margin-bottom:var(--space-6);
              display:flex; align-items:flex-start; gap:10px;
            ">
              <span style="font-size:0.85rem; opacity:0.5; flex-shrink:0; margin-top:1px;">◦</span>
              <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.6; margin:0;">
                Este bloque puede tocar temas sensibles. Si en algún momento necesitás ayuda,
                en Argentina podés llamar al <strong style="color:var(--text-dim);">135</strong> (gratuito, 24h).
                <a href="/privacidad" data-link style="color:var(--text-muted);">Este sitio no reemplaza atención profesional.</a>
              </p>
            </div>
          ` : ''}

          ${question.subtext ? `
            <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:var(--space-4); font-style:italic;">
              ${question.subtext}

            </p>
          ` : ''}

          <h2 style="
            font-size:clamp(1.2rem, 3.5vw, 1.7rem);
            margin-bottom:var(--space-8);
            line-height:1.35;
          ">${question.text}</h2>

          ${renderQuestionInput(question)}

          <!-- Skip -->
          <span id="skip-btn" class="skip-label">
            ${COPY.diagnostic.skipLabel}
          </span>
        </div>
      </div>

      <!-- Nav bottom -->
      <div style="
        padding: var(--space-5) var(--space-6) var(--space-8);
        display:flex; justify-content:space-between; align-items:center;
        border-top:1px solid var(--border);
      ">
        <button id="prev-btn" class="btn btn--ghost" ${(currentBlock === 0 && currentQuestionIdx === 0) ? 'disabled' : ''}>
          ← ${COPY.diagnostic.prevBtn}
        </button>
        <button id="next-btn" class="btn btn--primary" id="next-btn" disabled>
          ${COPY.diagnostic.nextBtn} →
        </button>
      </div>
    </div>
  `;

  // Init question inputs
  initQuestionInputs(question);

  // Skip
  document.getElementById('skip-btn').addEventListener('click', () => {
    recordSkip(question.id, block.id);
    advanceQuestion();
  });

  // Next
  document.getElementById('next-btn').addEventListener('click', () => {
    advanceQuestion();
  });

  // Prev
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIdx > 0) {
      currentQuestionIdx--;
    } else if (currentBlock > 0) {
      currentBlock--;
      const prevQuestions = getVisibleQuestions(currentBlock);
      currentQuestionIdx = prevQuestions.length - 1;
    }
    renderBlock();
  });
}

function renderQuestionInput(question) {
  switch (question.type) {
    case 'A': return renderTypeA(question);
    case 'B': return renderTypeB(question);
    case 'C': return renderTypeC(question);
    case 'D': return renderTypeD(question);
    case 'E': return renderTypeE(question);
    default: return '';
  }
}

function renderTypeA(q) {
  return `
    <div class="slider-wrapper">
      <div class="slider-track">
        <div class="slider-fill" id="q-slider-fill" style="width:40%;"></div>
        <input type="range" class="slider" id="q-slider" min="1" max="10" value="4" step="1" />
      </div>
      <div class="slider-labels">
        <span>${q.scaleMin || COPY.diagnostic.scaleMin}</span>
        <span>${q.scaleMax || COPY.diagnostic.scaleMax}</span>
      </div>
      <div class="slider-value" id="q-slider-display">4</div>
    </div>
  `;
}

function renderTypeB(q) {
  return `
    <div class="option-list">
      ${q.options.map((opt, i) => `
        <div class="option-item" data-value="${opt.value}" data-idx="${i}">
          <div class="option-check"></div>
          <span class="option-label">${opt.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTypeC(q) {
  return `
    <div class="choice-pair">
      ${q.options.map(opt => `
        <button class="choice-btn" data-value="${opt.value}">${opt.label}</button>
      `).join('')}
    </div>
  `;
}

function renderTypeD(q) {
  const opts = [
    { k: 'strongly_agree', label: COPY.diagnostic.typeD_options.strongly_agree },
    { k: 'agree', label: COPY.diagnostic.typeD_options.agree },
    { k: 'unsure', label: COPY.diagnostic.typeD_options.unsure },
    { k: 'disagree', label: COPY.diagnostic.typeD_options.disagree },
    { k: 'dont_know', label: COPY.diagnostic.typeD_options.dont_know },
  ];
  return `
    <div class="option-list likert-list" role="radiogroup" aria-label="Escala de acuerdo">
      ${opts.map((opt, i) => `
        <div class="option-item" data-value="${opt.k}" tabindex="0" role="radio" aria-checked="false">
          <div class="option-check" aria-hidden="true"></div>
          <span class="option-label">${opt.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTypeE(q) {
  return `
    <div class="textarea-wrapper">
      <textarea
        id="q-textarea"
        class="textarea-free"
        placeholder="${COPY.closing.placeholder}"
        rows="4"
      ></textarea>
    </div>
  `;
}

function enableNext() {
  const btn = document.getElementById('next-btn');
  if (btn) btn.disabled = false;
}

/** Selecciona una opción tipo B/D y actualiza ARIA + estado */
function selectOptionItem(item, allItems, question, doRecord = true) {
  allItems.forEach(i => {
    i.classList.remove('selected');
    i.setAttribute('aria-checked', 'false');
  });
  item.classList.add('selected');
  item.setAttribute('aria-checked', 'true');
  if (doRecord) {
    recordAnswer(question.id, item.dataset.value);
    enableNext();
  }
}

/** Selecciona una opción tipo C */
function selectChoiceBtn(btn, question) {
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.classList.remove('selected');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('selected');
  btn.setAttribute('aria-pressed', 'true');
  recordAnswer(question.id, btn.dataset.value);
  enableNext();
}

function initQuestionInputs(question) {
  const nextBtn = document.getElementById('next-btn');

  if (question.type === 'A') {
    const slider = document.getElementById('q-slider');
    const display = document.getElementById('q-slider-display');
    const fill = document.getElementById('q-slider-fill');
    // Slider starts with a value — enable next immediately
    enableNext();
    slider.addEventListener('input', () => {
      display.textContent = slider.value;
      fill.style.width = `${(slider.value - 1) / 9 * 100}%`;
      // Save live
      recordAnswer(question.id, parseInt(slider.value));
    });
    // Save default value
    recordAnswer(question.id, parseInt(slider.value));
  }

  if (question.type === 'B' || question.type === 'D') {
    const items = document.querySelectorAll('.option-item');
    items.forEach(item => {
      // Mouse click
      item.addEventListener('click', () => selectOptionItem(item, items, question));
      // Keyboard: Enter or Space
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectOptionItem(item, items, question);
        }
      });
    });
    // Restore previous answer if exists
    const prev = getState().diagnostic.answers[question.id];
    if (prev !== undefined) {
      const prevEl = document.querySelector(`.option-item[data-value="${prev}"]`);
      if (prevEl) { selectOptionItem(prevEl, items, question, false); enableNext(); }
    }
  }

  if (question.type === 'C') {
    document.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => selectChoiceBtn(btn, question));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectChoiceBtn(btn, question);
        }
      });
    });
    const prev = getState().diagnostic.answers[question.id];
    if (prev) {
      const prevEl = document.querySelector(`.choice-btn[data-value="${prev}"]`);
      if (prevEl) { prevEl.classList.add('selected'); enableNext(); }
    }
  }

  if (question.type === 'E') {
    const textarea = document.getElementById('q-textarea');
    enableNext(); // siempre habilitado (es opcional)
    const prev = getState().diagnostic.textResponses[question.id];
    if (prev) textarea.value = prev;
    textarea.addEventListener('input', () => {
      recordTextResponse(question.id, textarea.value);
    });
  }
}

function advanceQuestion() {
  const questions = getVisibleQuestions(currentBlock);
  currentQuestionIdx++;
  if (currentQuestionIdx >= questions.length) {
    advanceBlock();
  } else {
    renderBlock();
  }
}

function advanceBlock() {
  currentBlock++;

  // ¿Hay checkpoint después de este bloque?
  if (CHECKPOINT_MAP[currentBlock] !== undefined) {
    phase = 'checkpoint';
    renderCheckpoint(CHECKPOINT_MAP[currentBlock]);
    return;
  }

  if (currentBlock >= BLOCKS.length) {
    phase = 'closing';
    renderClosing();
    return;
  }

  currentQuestionIdx = 0;
  phase = 'block';
  renderBlock();
}

// ─── FASE: Checkpoint ─────────────────────────────────────────────────────────

function renderCheckpoint(cpIndex) {
  const cp = COPY.checkpoints[cpIndex] || COPY.checkpoints[0];
  const app = getApp();
  app.innerHTML = `
    <div class="checkpoint hero-gradient">
      <div style="max-width:480px; text-align:center;" class="animate-fade-in-scale">
        <div class="checkpoint__line"></div>
        <p class="checkpoint__text">"${cp.text}"</p>
        ${cp.sub ? `<p class="checkpoint__sub">${cp.sub}</p>` : ''}
        <div style="margin-top: var(--space-10);">
          <button id="cp-continue" class="btn btn--ghost" style="min-width:200px;">
            ${cp.continueBtn}
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('cp-continue').addEventListener('click', () => {
    if (currentBlock >= BLOCKS.length) {
      phase = 'closing';
      renderClosing();
    } else {
      currentQuestionIdx = 0;
      phase = 'block';
      renderBlock();
    }
  });
}

// ─── FASE: Pregunta de cierre ─────────────────────────────────────────────────

function renderClosing() {
  const app = getApp();
  app.innerHTML = `
    <div style="
      min-height:100vh; display:flex; align-items:center; justify-content:center;
      background:#050508; padding:var(--space-12) var(--space-6);
    ">
      <div style="max-width:520px; width:100%; text-align:center;">
        <p class="animate-fade-in-up" style="
          font-family:var(--font-display);
          font-size:clamp(1rem,3vw,1.3rem);
          color:rgba(240,240,248,0.6);
          font-style:italic;
          margin-bottom:var(--space-4);
        ">${COPY.closing.line1}</p>

        <h2 class="animate-fade-in-up delay-2" style="
          font-size:clamp(1.6rem,5vw,2.5rem);
          color:#fff;
          margin-bottom:var(--space-8);
          line-height:1.2;
        ">${COPY.closing.line2}</h2>

        <div class="animate-fade-in-up delay-3">
          <p style="color:rgba(240,240,248,0.4); font-size:0.85rem; margin-bottom:var(--space-4);">
            ${COPY.closing.hint}
          </p>
          <textarea
            id="closing-textarea"
            class="textarea-free"
            style="min-height:160px; background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.1);"
            placeholder=""
          ></textarea>
        </div>

        <div class="animate-fade-in-up delay-4" style="margin-top:var(--space-8); display:flex; flex-direction:column; gap:var(--space-4); align-items:center;">
          <button id="closing-continue" class="btn btn--primary btn--large" style="min-width:280px;">
            ${COPY.closing.continueBtn}
          </button>
          <button id="closing-skip" class="btn btn--link">
            ${COPY.closing.skipLabel}
          </button>
        </div>
      </div>
    </div>
  `;

  const textarea = document.getElementById('closing-textarea');

  document.getElementById('closing-continue').addEventListener('click', () => {
    const response = textarea.value.trim();

    // Crisis check en la pregunta de cierre — antes de cualquier otra acción
    if (response) {
      const { detected, level } = detectCrisis(response);
      if (detected) {
        renderCrisis(() => {
          // Usuario elige continuar después de ver los recursos
          mergeState('diagnostic', { closingResponse: response, closingSkipped: false });
          saveToStorage();
          navigate('/resultados');
        }, level);
        return; // no navegar todavía
      }
    }

    mergeState('diagnostic', {
      closingResponse: response || null,
      closingSkipped: !response,
    });
    saveToStorage();
    navigate('/resultados');
  });

  document.getElementById('closing-skip').addEventListener('click', () => {
    mergeState('diagnostic', { closingResponse: null, closingSkipped: true });
    saveToStorage();
    navigate('/resultados');
  });
}

// ─── COOLDOWN SCREEN ────────────────────────────────────────────────────────

function renderCooldownScreen(hoursRemaining) {
  trackEvent(EVENT_TYPES.COOLDOWN_SHOWN, { hoursRemaining });

  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex; align-items:center; justify-content:center;
      padding:var(--space-10) var(--space-6);
    ">
      <div style="max-width:480px; width:100%; text-align:center;">

        <div class="animate-fade-in-up" style="margin-bottom:var(--space-10);">
          <div style="
            font-size:3.5rem;
            margin-bottom:var(--space-6);
            opacity:0.3;
          ">◷</div>

          <h1 style="
            font-family:var(--font-display);
            font-size:clamp(1.6rem,5vw,2.4rem);
            line-height:1.2;
            margin-bottom:var(--space-6);
          ">${COPY.cooldown.title}</h1>

          <p style="
            color:var(--text-dim);
            font-size:1rem;
            line-height:1.7;
          ">${COPY.cooldown.subtitle(hoursRemaining)}</p>
        </div>

        <div class="animate-fade-in-up delay-2" style="
          display:flex; flex-direction:column; gap:var(--space-4); align-items:center;
        ">
          <button id="cooldown-results" class="btn btn--primary btn--large" style="min-width:280px;">
            ${COPY.cooldown.viewResultsBtn}
          </button>

          <button id="cooldown-bypass" class="btn btn--link" style="
            font-size:0.8rem;
            opacity:0.35;
            margin-top:var(--space-4);
          ">
            ${COPY.cooldown.bypassBtn}
          </button>

          <p id="cooldown-bypass-note" style="
            display:none;
            color:var(--text-muted);
            font-size:0.78rem;
            max-width:300px;
            line-height:1.5;
            margin-top:var(--space-2);
          ">${COPY.cooldown.bypassNote}</p>
        </div>

      </div>
    </div>
  `;

  document.getElementById('cooldown-results').addEventListener('click', () => {
    navigate('/resultados');
  });

  document.getElementById('cooldown-bypass').addEventListener('click', () => {
    const note = document.getElementById('cooldown-bypass-note');
    if (note.style.display === 'none') {
      // Primer click: mostrar advertencia
      note.style.display = 'block';
      document.getElementById('cooldown-bypass').textContent = 'Sí, hacerlo igual';
    } else {
      // Segundo click: confirmar bypass
      trackEvent(EVENT_TYPES.COOLDOWN_BYPASSED, {});
      resetDiagnostic();
      localStorage.removeItem('csm_abandoned_at');
      // Resetear estado interno del módulo
      phase = 'opening';
      currentBlock = 0;
      currentQuestionIdx = 0;
      renderDiagnostic();
    }
  });
}

