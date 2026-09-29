/* ═══════════════════════════════════════════════════
   PROJECT DETAIL PAGE (/work/:id) — Full project case study
═══════════════════════════════════════════════════ */

import { getPortfolioData } from '../data/store.js';
import { ICONS } from '../utils/icons.js';
import { navigateTo } from '../router.js';

export function renderProjectDetailPage(container, projectId) {
  if (!container) return;

  const data = getPortfolioData();
  const proj = (data.projects || []).find((p) => String(p.id) === String(projectId)) || data.projects[0];

  if (!proj) {
    container.innerHTML = `<div class="container" style="padding: 100px 20px;"><h2>Project not found</h2></div>`;
    return;
  }

  const liveBtn = proj.liveUrl
    ? `<a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--cyan">VIEW LIVE SITE ${ICONS.externalLink}</a>`
    : '';
  const codeBtn = proj.codeUrl
    ? `<a href="${proj.codeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--black-outline">VIEW SOURCE CODE ${ICONS.github}</a>`
    : '';

  container.innerHTML = `
    <section class="project-detail-page" style="padding-top: calc(var(--navbar-height) + var(--space-8)); padding-bottom: var(--space-16);">
      <div class="container container--base">
        
        <a href="/work" id="backToWorkBtn" class="btn btn--black-outline" style="margin-bottom: var(--space-6);">
          ← ALL PROJECTS
        </a>

        <div style="border: 3px solid var(--color-black); border-radius: var(--border-radius-lg); background: var(--color-white); overflow: hidden; box-shadow: var(--shadow-xl);">
          <div class="browser-chrome" style="border-bottom: 2px solid var(--color-black);">
            <div class="browser-chrome__dots">
              <span class="dot dot--red"></span>
              <span class="dot dot--yellow"></span>
              <span class="dot dot--green"></span>
            </div>
            <div class="browser-chrome__url">${proj.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.dev</div>
          </div>

          ${proj.image ? `
            <div style="max-height: 420px; overflow: hidden; border-bottom: 3px solid var(--color-black); background: var(--color-offwhite);">
              <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          ` : ''}

          <div style="padding: clamp(1.5rem, 5vw, 3.5rem);">
            <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; margin-bottom: var(--space-4);">
              <span class="tag tag--cyan">${proj.category}</span>
              <span class="tag tag--outline">${proj.year || '2025'}</span>
            </div>

            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 6vw, 4rem); color: var(--color-black); margin-bottom: var(--space-6); line-height: 1.1;">
              ${proj.title}
            </h1>

            <div style="margin-bottom: var(--space-8);">
              <h3 style="font-family: var(--font-body); font-size: var(--text-md); font-weight: 900; text-transform: uppercase; color: var(--color-black); margin-bottom: var(--space-3);">
                OVERVIEW
              </h3>
              <p style="font-family: var(--font-body); font-size: clamp(1rem, 2vw, 1.25rem); line-height: 1.7; color: #222;">
                ${proj.description}
              </p>
            </div>

            ${proj.buildDetails ? `
              <div style="margin-bottom: var(--space-8);">
                <h3 style="font-family: var(--font-body); font-size: var(--text-md); font-weight: 900; text-transform: uppercase; color: var(--color-black); margin-bottom: var(--space-3);">
                  THE BUILD &amp; ARCHITECTURE
                </h3>
                <p style="font-family: var(--font-body); font-size: clamp(0.95rem, 1.8vw, 1.1rem); line-height: 1.7; color: #333;">
                  ${proj.buildDetails}
                </p>
              </div>
            ` : ''}

            <div style="margin-bottom: var(--space-8);">
              <h3 style="font-family: var(--font-body); font-size: var(--text-sm); font-weight: 900; text-transform: uppercase; color: var(--color-black); margin-bottom: var(--space-3);">
                TECH STACK
              </h3>
              <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                ${(proj.technologies || []).map((t) => `<span class="tag tag--outline">${t}</span>`).join('')}
              </div>
            </div>

            ${(liveBtn || codeBtn) ? `
              <div style="display: flex; gap: var(--space-4); flex-wrap: wrap; border-top: 2px solid var(--color-light-grey); padding-top: var(--space-6);">
                ${liveBtn}
                ${codeBtn}
              </div>
            ` : ''}
          </div>
        </div>

      </div>
    </section>
  `;

  container.querySelector('#backToWorkBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/work');
  });
}
