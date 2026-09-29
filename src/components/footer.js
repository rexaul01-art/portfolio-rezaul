/* ═══════════════════════════════════════════════════
   FOOTER COMPONENT — Credit, Back-to-Top, Dynamic Info
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';

export function initFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  function renderFooter() {
    const data = getPortfolioData();
    const prof = data.profile || {};

    const metaContainer = footer.querySelector('.footer__meta');
    if (metaContainer) {
      metaContainer.innerHTML = `
        <span class="footer__meta-text">${prof.headline || 'DEVELOPER × DESIGNER'}</span>
        <span class="footer__meta-sep" aria-hidden="true">·</span>
        <span class="footer__meta-text">${prof.location || 'ASSAM, INDIA'}</span>
        <span class="footer__meta-sep" aria-hidden="true">·</span>
        <span class="footer__meta-text">© ${new Date().getFullYear()}</span>
        <span class="footer__meta-sep" aria-hidden="true">·</span>
        <span class="footer__credit">WEBSITE MADE BY ${prof.name || 'REZAUL KARIM'}</span>
      `;
    }
  }

  renderFooter();
  subscribeToStore(renderFooter);

  const backTopBtn = document.getElementById('backToTop');
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
