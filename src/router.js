/**
 * router.js — History API router (~35 líneas)
 * Rutas conocidas, sin librería externa.
 */

const routes = {};
let notFoundHandler = null;

export function route(path, handler) {
  routes[path] = handler;
}

export function onNotFound(handler) {
  notFoundHandler = handler;
}

export function navigate(path, state = {}) {
  window.history.pushState(state, '', path);
  dispatch(path, state);
}

export function replace(path, state = {}) {
  window.history.replaceState(state, '', path);
  dispatch(path, state);
}

function dispatch(path, state = {}) {
  // Exact match first
  if (routes[path]) {
    routes[path](state);
    return;
  }
  // Prefix match for dynamic segments (e.g. /categoria/:slug)
  for (const pattern in routes) {
    const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
    const match = path.match(regex);
    if (match) {
      const keys = [...pattern.matchAll(/:([^/]+)/g)].map(m => m[1]);
      const params = Object.fromEntries(keys.map((k, i) => [k, match[i + 1]]));
      routes[pattern]({ ...state, params });
      return;
    }
  }
  if (notFoundHandler) notFoundHandler();
}

export function initRouter() {
  window.addEventListener('popstate', (e) => {
    dispatch(window.location.pathname, e.state || {});
  });

  // Intercept internal link clicks
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a) return;
    e.preventDefault();
    navigate(a.getAttribute('href'));
  });

  // Dispatch current path on init
  dispatch(window.location.pathname, {});
}
