/* ═══════════════════════════════════════════════════
   MAIN ENTRY POINT — Component & Router Initialization
═══════════════════════════════════════════════════ */

import { initRouter }          from './router.js';
import { loadPortfolioData }   from './data/store.js';
import { initNavbar }          from './components/navbar.js';
import { initMobileMenu }      from './components/mobileMenu.js';
import { initHero }            from './components/hero.js';
import { initAbout }           from './components/about.js';
import { initJourney }         from './components/journey.js';
import { initDisciplines }     from './components/disciplines.js';
import { initToolbox }         from './components/toolbox.js';
import { initProjects }        from './components/projects.js';
import { initCta }             from './components/cta.js';
import { initContactForm }     from './components/contact.js';
import { initFooter }          from './components/footer.js';
import { initScrollAnimations } from './animations/scrollAnimations.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Load dynamic content from store / backend API
  await loadPortfolioData();

  // Initialize SPA Router
  initRouter(() => {
    // Renders on public routes
    initNavbar();
    initMobileMenu();
    initHero();
    initAbout();
    initJourney();
    initDisciplines();
    initToolbox();
    initProjects();
    initCta();
    initContactForm();
    initFooter();
    initScrollAnimations();
  });
});
