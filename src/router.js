/* ═══════════════════════════════════════════════════
   ROUTER — Rock-Solid SPA Router for /, /work, /work/:id, /rezaul
═══════════════════════════════════════════════════ */

import { renderAdminApp } from './admin/admin.js';
import { renderAllWorkPage } from './components/allWork.js';
import { renderProjectDetailPage } from './components/projectDetail.js';

let publicInitCallback = null;
let isHomeInitialized = false;

export function initRouter(onPublicRoute) {
  publicInitCallback = onPublicRoute;

  // Intercept all internal navigation clicks globally
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="/"], a[href^="#"], [data-navigate]');
    if (!link) return;

    const navPath = link.getAttribute('data-navigate');
    if (navPath) {
      e.preventDefault();
      navigateTo(navPath);
      return;
    }

    const href = link.getAttribute('href');
    if (!href) return;

    if (href.startsWith('#')) {
      // Hash scroll link
      const currentPath = window.location.pathname.toLowerCase();
      if (currentPath !== '/' && currentPath !== '') {
        e.preventDefault();
        navigateTo('/' + href);
      }
    } else if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigateTo(href);
    }
  });

  window.addEventListener('popstate', () => {
    handleRoute();
  });

  handleRoute();
}

export function navigateTo(path) {
  if (window.location.pathname + window.location.hash !== path) {
    window.history.pushState({}, '', path);
  }
  handleRoute();
}

function handleRoute() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash;
  
  let metaRobots = document.querySelector('meta[name="robots"]');
  if (!metaRobots) {
    metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    document.head.appendChild(metaRobots);
  }

  const appPublic = document.getElementById('appPublic');
  const viewHome = document.getElementById('viewHome');
  const viewAllWork = document.getElementById('viewAllWork');
  const viewProjectDetail = document.getElementById('viewProjectDetail');
  const adminRoot = getOrCreateAdminRoot();
  const navbar = document.getElementById('navbar');

  if (path === '/rezaul' || path === '/rezaul/') {
    metaRobots.content = 'noindex, nofollow, noarchive';
    document.title = 'Admin Dashboard — Rezaul Karim';
    
    if (navbar) navbar.style.display = 'none';
    if (appPublic) appPublic.style.display = 'none';
    adminRoot.style.display = 'block';
    renderAdminApp(adminRoot);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  // Public Routes
  if (navbar) navbar.style.display = 'block';
  adminRoot.style.display = 'none';
  if (appPublic) appPublic.style.display = 'block';

  if (path === '/work' || path === '/work/') {
    metaRobots.content = 'index, follow';
    document.title = 'ALL WORK — Rezaul Karim';

    if (viewHome) viewHome.style.display = 'none';
    if (viewProjectDetail) viewProjectDetail.style.display = 'none';
    if (viewAllWork) {
      viewAllWork.style.display = 'block';
      renderAllWorkPage(viewAllWork);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  } 
  else if (path.startsWith('/work/')) {
    metaRobots.content = 'index, follow';
    const projectId = path.replace('/work/', '').replace(/\/$/, '');
    document.title = 'Project Details — Rezaul Karim';

    if (viewHome) viewHome.style.display = 'none';
    if (viewAllWork) viewAllWork.style.display = 'none';
    if (viewProjectDetail) {
      viewProjectDetail.style.display = 'block';
      renderProjectDetailPage(viewProjectDetail, projectId);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  } 
  else {
    // HOME ROUTE (/)
    metaRobots.content = 'index, follow';
    document.title = 'REZAUL KARIM — Developer × Designer';

    if (viewAllWork) viewAllWork.style.display = 'none';
    if (viewProjectDetail) viewProjectDetail.style.display = 'none';
    if (viewHome) viewHome.style.display = 'block';

    if (!isHomeInitialized && publicInitCallback) {
      isHomeInitialized = true;
      publicInitCallback();
    }

    if (hash) {
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
}

function getOrCreateAdminRoot() {
  let root = document.getElementById('adminRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'adminRoot';
    root.className = 'admin-root';
    document.body.appendChild(root);
  }
  return root;
}
