/* ═══════════════════════════════════════════════════
   HERO COMPONENT — Dynamic profile image, titles & stickers
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';

export function initHero() {
  const section = document.getElementById('hero');
  if (!section) return;

  function renderHero() {
    const data = getPortfolioData();
    const prof = data.profile || {};
    const avatarUrl = prof.avatarUrl || '/rezaullogo.png';

    const avatarHtml = `
      <img src="${avatarUrl}" alt="${prof.name || 'Rezaul Karim'}" class="hero__portrait-img" loading="eager" fetchpriority="high" decoding="sync" onerror="this.onerror=null; this.src='/rezaullogo.png';" />
    `;

    section.innerHTML = `
      <div class="hero__bg-arrows" aria-hidden="true">
        <span class="hero__arrow hero__arrow--tl">‹‹</span>
        <span class="hero__arrow hero__arrow--tr">›</span>
        <span class="hero__arrow hero__arrow--br">↓</span>
        <span class="hero__arrow hero__arrow--bl">∧</span>
        <span class="hero__arrow hero__arrow--r">→</span>
      </div>

      <div class="sticker sticker--ai hero__sticker-ai" aria-hidden="true">AI</div>
      <div class="sticker sticker--uiux hero__sticker-uiux1" aria-hidden="true">UI/UX</div>
      <div class="sticker sticker--fullstack hero__sticker-fullstack" aria-hidden="true">FULL-STACK</div>
      <div class="sticker sticker--uiux2 hero__sticker-uiux2" aria-hidden="true">BUILDER</div>

      <div class="hero__browser" role="img" aria-label="Portfolio hero window">
        <div class="browser-chrome" aria-hidden="true">
          <div class="browser-chrome__dots">
            <span class="dot dot--red"></span>
            <span class="dot dot--yellow"></span>
            <span class="dot dot--green"></span>
          </div>
          <div class="browser-chrome__url">rezaulkarim.dev</div>
        </div>
        <div class="hero__browser-body">
          <h1 class="hero__name" aria-label="${prof.name || 'Rezaul Karim'}">
            <span class="hero__name-line1">REZAUL</span>
            <span class="hero__name-line2">KARIM</span>
          </h1>
          <p class="hero__subtitle">${prof.headline || 'DEVELOPER × DESIGNER'}</p>
          <div class="hero__portrait-wrap" aria-label="Rezaul Karim portrait">
            <div class="hero__portrait-circle">
              ${avatarHtml}
            </div>
            <span class="hero__portrait-label">that's me →</span>
          </div>
          <div class="hero__scroll-hint" aria-label="Scroll down">
            <span>SCROLL</span>
            <span class="hero__scroll-arrow">↓</span>
          </div>
        </div>
      </div>
    `;
  }

  renderHero();
  subscribeToStore(renderHero);
}
