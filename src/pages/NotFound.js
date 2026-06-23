/**
 * NotFound.js — 404
 */
import { COPY } from '../content/copy.js';
import { navigate } from '../router.js';

export function renderNotFound() {
  document.getElementById('app').innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      text-align:center; padding:var(--space-12) var(--space-6);
      gap:var(--space-6);
    " class="animate-fade-in-up">
      <p style="font-size:5rem; line-height:1;">?</p>
      <h1 style="font-size:clamp(1.4rem, 4vw, 2rem);">${COPY.notFound.title}</h1>
      <p style="color:var(--text-muted); font-style:italic;">${COPY.notFound.sub}</p>
      <button class="btn btn--primary" id="not-found-home">${COPY.notFound.btn}</button>
    </div>
  `;
  document.getElementById('not-found-home').addEventListener('click', () => navigate('/'));
}
