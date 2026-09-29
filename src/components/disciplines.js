/* ═══════════════════════════════════════════════════
   DISCIPLINES / WHAT I DO COMPONENT — Numbered editorial layout
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';
import { ICONS } from '../utils/icons.js';

export function initDisciplines() {
  const container = document.getElementById('disciplines');
  if (!container) return;

  function renderDisciplines() {
    const data = getPortfolioData();
    const skills = data.skills || [];

    const gridHtml = skills.map((sk, idx) => {
      const isEven = idx % 2 === 0;
      const iconSvg = ICONS[sk.icon] || ICONS.code;
      const numberStr = String(idx + 1).padStart(2, '0');

      return `
        <div class="discipline-card ${isEven ? 'discipline-card--cyan' : 'discipline-card--pink'} reveal-up">
          <div class="discipline-card__header">
            <span class="discipline-card__num" style="font-family: var(--font-mono); font-weight: 900; font-size: 0.85rem; opacity: 0.8; margin-right: 6px;">${numberStr}</span>
            <span class="discipline-card__icon" aria-hidden="true">${iconSvg}</span>
            <h3 class="discipline-card__title">${sk.name}</h3>
          </div>
          <p class="discipline-card__body">${sk.description}</p>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="disciplines__heading-wrap">
        <h2 class="disciplines__heading">
          <span class="disciplines__heading-cyan">WHAT I </span><span class="disciplines__heading-pink">DO.</span>
        </h2>
      </div>

      <div class="disciplines__grid">
        ${gridHtml}
      </div>
    `;
  }

  renderDisciplines();
  subscribeToStore(renderDisciplines);
}
