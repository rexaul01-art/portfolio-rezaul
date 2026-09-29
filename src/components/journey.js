/* ═══════════════════════════════════════════════════
   JOURNEY COMPONENT — Dynamic timeline rendering
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';

export function initJourney() {
  const container = document.querySelector('.journey-chapters');
  if (!container) return;

  function renderJourney() {
    const data = getPortfolioData();
    const journey = data.journey || [];

    const html = journey.map((item) => {
      return `
        <article class="journey-chapter" id="chapter-${item.year}" data-year="${item.year}">
          <div class="journey-chapter__year-wrap">
            <span class="journey-chapter__year" aria-label="Year ${item.year}">${item.year}</span>
            <div class="journey-chapter__title-wrap">
              <h3 class="journey-chapter__title">${item.title}</h3>
            </div>
          </div>
          <div class="journey-chapter__body">
            <p>${item.description}</p>
            <div class="journey-chapter__tags" aria-label="Related topics">
              ${(item.technologies || []).map((t) => `<span class="tag tag--outline">${t}</span>`).join('')}
            </div>
          </div>
          <div class="journey-chapter__divider" aria-hidden="true"></div>
        </article>
      `;
    }).join('');

    container.innerHTML = html;
  }

  renderJourney();
  subscribeToStore(renderJourney);
}
