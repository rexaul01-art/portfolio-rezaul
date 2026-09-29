/* ═══════════════════════════════════════════════════
   PROJECTS COMPONENT — Featured projects + VIEW ALL WORK button
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';
import { ICONS } from '../utils/icons.js';
import { navigateTo } from '../router.js';

export function initProjects() {
  const container = document.getElementById('work');
  if (!container) return;

  function renderProjects() {
    const data = getPortfolioData();
    const projects = data.projects || [];
    const featuredProjects = projects.filter((p) => p.featured !== false);

    const listHtml = featuredProjects.map((proj, idx) => {
      const isEven = idx % 2 === 0;
      const liveBtn = proj.liveUrl
        ? `<a href="${proj.liveUrl}" class="btn btn--black-filled project-btn" target="_blank" rel="noopener noreferrer">VIEW LIVE <span class="btn-arrow">${ICONS.arrowRight}</span></a>`
        : '';
      const codeBtn = proj.codeUrl
        ? `<a href="${proj.codeUrl}" class="btn btn--black-outline project-btn" target="_blank" rel="noopener noreferrer">VIEW CODE <span class="btn-arrow">${ICONS.arrowRight}</span></a>`
        : '';

      return `
        <article class="project-item ${!isEven ? 'project-item--reverse' : ''}" id="${proj.id}" aria-label="Project ${idx + 1}: ${proj.title}">
          <div class="project-item__left">
            <div class="project-item__meta">
              <span class="project-item__number">PROJECT ${String(idx + 1).padStart(2, '0')}</span>
              <span class="project-item__category">${proj.category}</span>
            </div>
            <h3 class="project-item__name">${proj.title}</h3>

            <div class="project-item__section">
              <h4 class="project-item__section-title">THE IDEA</h4>
              <p class="project-item__text">${proj.description}</p>
            </div>

            ${proj.buildDetails ? `
              <div class="project-item__section">
                <h4 class="project-item__section-title">THE BUILD</h4>
                <p class="project-item__text">${proj.buildDetails}</p>
              </div>
            ` : ''}

            <div class="project-item__stack" aria-label="Tech stack">
              ${(proj.technologies || []).map((t) => `<span class="tag tag--outline">${t}</span>`).join('')}
            </div>

            ${(liveBtn || codeBtn) ? `
              <div class="project-item__actions">
                ${liveBtn}
                ${codeBtn}
              </div>
            ` : ''}
          </div>

          <div class="project-item__right">
            <div class="project-item__browser-wrap">
              <div class="browser-chrome" aria-hidden="true">
                <div class="browser-chrome__dots">
                  <span class="dot dot--red"></span>
                  <span class="dot dot--yellow"></span>
                  <span class="dot dot--green"></span>
                </div>
                <div class="browser-chrome__url">${proj.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.dev</div>
              </div>
              <div class="project-item__screenshot-wrap">
                ${proj.image ? `
                  <img src="${proj.image}" alt="${proj.title} screenshot" class="project-item__custom-img" loading="eager" />
                ` : `
                  <div class="screenshot-mock">
                    <div class="screenshot-mock__nav">
                      <span class="screenshot-mock__logo">${proj.title.toUpperCase()}</span>
                      <div class="screenshot-mock__nav-links">
                        <span>Home</span><span>Features</span><span>About</span>
                      </div>
                    </div>
                    <div class="screenshot-mock__hero">
                      <div class="screenshot-mock__hero-text">
                        <h4>${proj.title.toUpperCase()}</h4>
                        <p>${proj.description.slice(0, 80)}...</p>
                        <button>Explore Project →</button>
                      </div>
                    </div>
                    <div class="screenshot-mock__cards">
                      <div class="screenshot-mock__card">Performance</div>
                      <div class="screenshot-mock__card">Responsive</div>
                      <div class="screenshot-mock__card">Smart AI</div>
                    </div>
                  </div>
                `}
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = `
      <div class="projects__section-label" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4);">
        <span>02 / WORK</span>
        <button class="btn btn--cyan" id="viewAllWorkBtn" style="font-size: var(--text-xs); padding: 8px 20px;">
          VIEW ALL WORK <span class="btn-arrow">${ICONS.arrowRight}</span>
        </button>
      </div>
      ${listHtml}
    `;

    container.querySelector('#viewAllWorkBtn')?.addEventListener('click', () => {
      navigateTo('/work');
    });
  }

  renderProjects();
  subscribeToStore(renderProjects);
}
