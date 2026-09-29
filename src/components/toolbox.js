/* ═══════════════════════════════════════════════════
   TOOLBOX COMPONENT — Dynamic Tech Stack Luggage Tags
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';

export function initToolbox() {
  const container = document.getElementById('toolbox');
  if (!container) return;

  function renderToolbox() {
    const data = getPortfolioData();
    const tools = data.tools || [];

    const tagsHtml = tools.map((t) => {
      return `
        <div class="tool-tag tool-tag--${t.color || 'cyan'}" style="transform: rotate(${t.rotation || '0deg'});" aria-label="${t.name}">
          ${t.name}
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="toolbox__heading-wrap">
        <h2 class="toolbox__heading">MY TOOLS.</h2>
      </div>
      <div class="toolbox__wall" aria-label="Technology stack">
        ${tagsHtml}
      </div>
    `;
  }

  renderToolbox();
  subscribeToStore(renderToolbox);
}
