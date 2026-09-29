/* ═══════════════════════════════════════════════════
   ABOUT COMPONENT — Restored dynamic About Me section
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';

export function initAbout() {
  const section = document.getElementById('about');
  if (!section) return;

  function renderAbout() {
    const data = getPortfolioData();
    const prof = data.profile || {};
    const about = data.about || {};

    section.innerHTML = `
      <div class="about__dot-grid" aria-hidden="true"></div>

      <!-- Floating stickers -->
      <div class="sticker sticker--self-taught about__sticker-1" aria-hidden="true">${about.stickers?.[0] || 'SELF-TAUGHT'}</div>
      <div class="sticker sticker--builder about__sticker-2" aria-hidden="true">${about.stickers?.[1] || 'BUILDER'}</div>
      <div class="sticker sticker--designer about__sticker-3" aria-hidden="true">${about.stickers?.[2] || 'DESIGNER'}</div>

      <!-- SVG arrows decoration -->
      <svg class="about__arrows" aria-hidden="true" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 180 80 Q 230 60 280 90" stroke="#0A0A0A" stroke-width="2.5" stroke-dasharray="4 3" marker-end="url(#arrowhead)" fill="none"/>
        <path d="M 300 160 Q 340 190 320 240" stroke="#0A0A0A" stroke-width="2.5" stroke-dasharray="4 3" marker-end="url(#arrowhead)" fill="none"/>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#0A0A0A"/>
          </marker>
        </defs>
      </svg>

      <div class="about__content">
        <div class="about__label">${about.label || '01 / HELLO'}</div>
        
        <h2 class="about__heading" aria-label="${about.title || "Hey. I'm Rezaul."}">
          <span class="about__heading-line">${about.title || "HEY.<br>I'M REZAUL."}</span>
        </h2>

        <p class="about__body">
          ${about.intro || "I'm a <strong>self-taught developer and designer</strong> who likes turning ideas into things people can actually use."}
        </p>

        <div style="margin-top: var(--space-6); display: flex; gap: var(--space-4); flex-wrap: wrap;">
          <div style="background: var(--color-offwhite); border: 2.5px solid var(--color-black); border-radius: var(--border-radius-sm); padding: var(--space-3) var(--space-5); font-size: var(--text-xs); font-weight: 700; box-shadow: 2px 2px 0 var(--color-black);">
            <span style="color: var(--color-text-grey); text-transform: uppercase;">LOCATION:</span> ${prof.location || 'Assam, India'}
          </div>
          <div style="background: var(--color-yellow); border: 2.5px solid var(--color-black); border-radius: var(--border-radius-sm); padding: var(--space-3) var(--space-5); font-size: var(--text-xs); font-weight: 800; box-shadow: 2px 2px 0 var(--color-black);">
            <span style="text-transform: uppercase;">STATUS:</span> ${prof.availability || 'Available for Projects'}
          </div>
        </div>

        ${(about.paragraphs || [
          "I build high-performance web applications, modern mobile apps, and intelligent AI tools with a focus on bold design, clean architecture, and delightful user experience."
        ]).map((p) => `<p style="font-family: var(--font-body); font-size: clamp(1rem, 2vw, 1.25rem); color: #222; margin-top: var(--space-5); line-height: 1.7; max-width: 680px;">${p}</p>`).join('')}
      </div>
    `;
  }

  renderAbout();
  subscribeToStore(renderAbout);
}
