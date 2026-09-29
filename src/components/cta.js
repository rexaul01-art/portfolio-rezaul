/* ═══════════════════════════════════════════════════
   CTA COMPONENT — Dynamic CTA with WHITE TEXT, CYAN BG, BLACK BORDER
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';
import { ICONS } from '../utils/icons.js';
import { navigateTo } from '../router.js';

export function initCta() {
  const container = document.getElementById('cta');
  if (!container) return;

  function renderCta() {
    const data = getPortfolioData();
    const contact = data.contact || {};

    container.innerHTML = `
      <div class="cta__browser">
        <div class="browser-chrome browser-chrome--dark" aria-hidden="true">
          <div class="browser-chrome__dots">
            <span class="dot dot--red"></span>
            <span class="dot dot--yellow"></span>
            <span class="dot dot--green"></span>
          </div>
          <div class="browser-chrome__url browser-chrome__url--dark">rezaulkarim.dev/contact</div>
        </div>
        <div class="cta__body">
          <h2 class="cta__heading">${contact.heading || "LET'S TALK"}</h2>
          <p class="cta__sub">${contact.subheading || "Have an idea? Let's make it real."}</p>
          <div class="cta__buttons">
            <a href="#contact" class="btn btn--cta-cyan cta__btn" id="ctaTalkBtn">
              ${contact.ctaText || "LET'S TALK"} <span class="btn-arrow">${ICONS.arrowRight}</span>
            </a>
            <button class="btn btn--navy-outline cta__btn" id="ctaWorkBtn">
              VIEW MY WORK <span class="btn-arrow">${ICONS.arrowRight}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#ctaWorkBtn')?.addEventListener('click', () => {
      navigateTo('/work');
    });
  }

  renderCta();
  subscribeToStore(renderCta);
}
