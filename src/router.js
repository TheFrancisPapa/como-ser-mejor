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
  let matched = false;
  // Exact match first
  if (routes[path]) {
    routes[path](state);
    matched = true;
  } else {
    // Prefix match for dynamic segments
    for (const pattern in routes) {
      const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
      const match = path.match(regex);
      if (match) {
        const keys = [...pattern.matchAll(/:([^/]+)/g)].map(m => m[1]);
        const params = Object.fromEntries(keys.map((k, i) => [k, match[i + 1]]));
        routes[pattern]({ ...state, params });
        matched = true;
        break;
      }
    }
  }

  if (!matched && notFoundHandler) {
    notFoundHandler();
  }

  // Manage focus and scroll
  setTimeout(() => {
    window.scrollTo(0, 0);
    const focusTarget = document.querySelector('main') || document.querySelector('h1') || document.querySelector('h2') || document.getElementById('app');
    if (focusTarget) {
      if (!focusTarget.hasAttribute('tabindex')) {
        focusTarget.setAttribute('tabindex', '-1');
      }
      focusTarget.focus({ preventScroll: true }); // prevent jump if already scrolled
    }
  }, 50);
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
