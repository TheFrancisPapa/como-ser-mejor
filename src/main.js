/**
 * main.js — Entry point. Inicializa router, store y monta la app.
 */

// Estilos (importados en orden de cascada)
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/dashboard.css';


// Core
import { route, onNotFound, initRouter } from './router.js';
import { loadFromStorage } from './store.js';

// Pages
import { renderLanding } from './pages/Landing.js';
import { renderDiagnostic } from './pages/Diagnostic.js';
import { renderResults } from './pages/Results.js';
import { renderCategory } from './pages/Category.js';
import { renderArchetype } from './pages/Archetype.js';
import { renderLegal } from './pages/Legal.js';
import { renderNotFound } from './pages/NotFound.js';

// ─── Registrar rutas ──────────────────────────────────────────────────────────

route('/', renderLanding);
route('/diagnostico', renderDiagnostic);
route('/resultados', () => renderResults());

// Categorías
route('/categoria/:slug', renderCategory);

// Legal
route('/privacidad', () => renderLegal({ params: { section: 'privacidad' } }));
route('/terminos', () => renderLegal({ params: { section: 'terminos' } }));

// Sistema secreto (URL dinámica por token de sesión)
route('/_s/:token', renderArchetype);

// 404
onNotFound(renderNotFound);

// ─── Inicializar ──────────────────────────────────────────────────────────────

// Cargar estado persistido (diagnóstico abandonado, etc.)
loadFromStorage();

// Arrancar router
initRouter();
