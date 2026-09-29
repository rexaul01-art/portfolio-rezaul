/* ═══════════════════════════════════════════════════
   ALL WORK PAGE (/work) — Complete project list with category filter
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';
import { ICONS } from '../utils/icons.js';
import { navigateTo } from '../router.js';

let activeCategory = 'ALL';

export function renderAllWorkPage(container) {
  if (!container) return;

  function render() {
    const data = getPortfolioData();
    const allProjects = data.projects || [];

    // Extract unique active categories
    const categories = ['ALL', ...new Set(allProjects.map((p) => (p.category || 'WEB').trim().toUpperCase()))];

    const filteredProjects = activeCategory === 'ALL'
      ? allProjects
      : allProjects.filter((p) => (p.category || '').toUpperCase().includes(activeCategory));

    container.innerHTML = `
      <section class="all-work-page" style="padding-top: calc(var(--navbar-height) + var(--space-8)); padding-bottom: var(--space-16);">
        <div class="container container--wide">
          
          <div style="margin-bottom: var(--space-8);">
            <a href="/" class="btn btn--black-outline" style="margin-bottom: var(--space-4);" id="backToHomeBtn">
              ← BACK TO HOME
            </a>
            <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 6vw, 4.5rem); color: var(--color-black); margin-bottom: var(--space-3);">
              ALL WORK.
            </h1>
            <p style="font-family: var(--font-body); font-size: var(--text-lg); color: var(--color-text-grey); font-weight: 500;">
              Explore the complete portfolio of digital projects, web platforms, and mobile applications.
            </p>
          </div>

          <!-- Category Filter Bar -->
          <div class="all-work__filter-bar" style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-12);">
            ${categories.map((cat) => `
              <button class="tag ${activeCategory === cat ? 'tag--cyan' : 'tag--outline'}" data-cat="${cat}" style="cursor: pointer; font-size: var(--text-xs); padding: 8px 16px;">
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- Projects Grid -->
          <div class="all-work__grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-8);">
            ${filteredProjects.map((proj) => `
              <div class="all-work__card" style="border: 3px solid var(--color-black); border-radius: var(--border-radius); background: var(--color-white); overflow: hidden; display: flex; flex-direction: column; box-shadow: var(--shadow-md); transition: transform 0.2s ease;">
                <div class="browser-chrome" style="border-bottom: 2px solid var(--color-black);">
                  <div class="browser-chrome__dots">
                    <span class="dot dot--red"></span>
                    <span class="dot dot--yellow"></span>
                    <span class="dot dot--green"></span>
                  </div>
                  <div class="browser-chrome__url">${proj.year || '2025'}</div>
                </div>

                ${proj.image ? `
                  <div style="height: 190px; overflow: hidden; border-bottom: 2px solid var(--color-black); background: var(--color-offwhite);">
                    <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />
                  </div>
                ` : ''}

                <div style="padding: var(--space-6); flex: 1; display: flex; flex-direction: column;">
                  <span class="tag tag--outline" style="align-self: flex-start; margin-bottom: var(--space-3);">${proj.category}</span>
                  <h3 style="font-family: var(--font-display); font-size: var(--text-xl); color: var(--color-black); margin-bottom: var(--space-3); line-height: 1.2;">
                    ${proj.title}
                  </h3>
                  <p style="font-family: var(--font-body); font-size: var(--text-sm); color: #333; margin-bottom: var(--space-6); flex: 1; line-height: 1.6;">
                    ${proj.description.slice(0, 140)}...
                  </p>
                  
                  <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-6);">
                    ${(proj.technologies || []).map((t) => `<span class="tag tag--cyan" style="font-size: 0.65rem;">${t}</span>`).join('')}
                  </div>

                  <div style="display: flex; gap: var(--space-3);">
                    <button class="btn btn--black-filled" data-view-detail="${proj.id}" style="flex: 1; font-size: var(--text-xs); padding: 8px 12px;">
                      VIEW DETAILS ${ICONS.arrowRight}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

        </div>
      </section>
    `;

    // Attach Event Listeners
    container.querySelector('#backToHomeBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/');
    });

    container.querySelectorAll('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        render();
      });
    });

    container.querySelectorAll('[data-view-detail]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-view-detail');
        navigateTo(`/work/${id}`);
      });
    });
  }

  render();
  subscribeToStore(render);
}
