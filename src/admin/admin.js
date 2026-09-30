/* ═══════════════════════════════════════════════════
   ADMIN DASHBOARD APP — 100% Dynamic Content Control
═══════════════════════════════════════════════════ */

import '../styles/admin.css';
import { getPortfolioData, saveLocalData } from '../data/store.js';

let activeTab = 'overview';
let isAuthenticated = false;
let authError = '';

export function renderAdminApp(container) {
  checkAuthSession().then((authed) => {
    isAuthenticated = authed;
    render(container);
  });
}

async function checkAuthSession() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      return !!data.authenticated;
    }
  } catch (e) {}
  return false;
}

function showToast(message) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.backgroundColor = '#10B981';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '8px';
    toast.style.fontWeight = '700';
    toast.style.fontSize = '0.9rem';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
    toast.style.zIndex = '999999';
    toast.style.transition = 'all 0.3s ease';
    toast.style.border = '2px solid #0A0A0A';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    if (toast) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }
  }, 4000);
}

function render(container) {
  if (!container) return;

  if (!isAuthenticated) {
    container.innerHTML = renderLoginScreen();
    attachLoginEvents(container);
    return;
  }

  container.innerHTML = `
    <div class="admin-app">
      <!-- SIDEBAR -->
      <aside class="admin-sidebar">
        <div class="admin-sidebar__header">
          <div class="admin-sidebar__brand">REZAUL KARIM</div>
          <div style="font-size: 0.7rem; color: #64748B; margin-top: 4px;">ADMIN DASHBOARD</div>
        </div>
        <nav class="admin-sidebar__nav">
          <button class="admin-sidebar__item ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
          <button class="admin-sidebar__item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">Profile &amp; Photo</button>
          <button class="admin-sidebar__item ${activeTab === 'about' ? 'active' : ''}" data-tab="about">About Me</button>
          <button class="admin-sidebar__item ${activeTab === 'services' ? 'active' : ''}" data-tab="services">What I Do (Services)</button>
          <button class="admin-sidebar__item ${activeTab === 'journey' ? 'active' : ''}" data-tab="journey">Journey Timeline</button>
          <button class="admin-sidebar__item ${activeTab === 'projects' ? 'active' : ''}" data-tab="projects">Projects (${getPortfolioData().projects?.length || 0})</button>
          <button class="admin-sidebar__item ${activeTab === 'tech' ? 'active' : ''}" data-tab="tech">Tech Stack</button>
          <button class="admin-sidebar__item ${activeTab === 'contact' ? 'active' : ''}" data-tab="contact">Contact Info</button>
          <button class="admin-sidebar__item ${activeTab === 'socials' ? 'active' : ''}" data-tab="socials">Social Links</button>
          <button class="admin-sidebar__item ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">Site Settings</button>
        </nav>
        <div class="admin-sidebar__footer">
          <a href="/" style="color: var(--color-cyan); font-size: 0.8rem; font-weight: 700; text-decoration: none;">← View Live Portfolio</a>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="admin-main">
        <header class="admin-topbar">
          <div class="admin-topbar__title">${getTabTitle(activeTab)}</div>
          <div class="admin-topbar__actions">
            <span style="font-size: 0.75rem; color: #10B981; font-weight: 700; display: flex; align-items: center; gap: 6px;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10B981;"></span>
              Auto-Save to Source Files Active
            </span>
            <button class="admin-btn admin-btn--secondary" id="logoutBtn">Logout</button>
          </div>
        </header>

        <div class="admin-body">
          ${renderTabContent(activeTab)}
        </div>
      </main>
    </div>
  `;

  attachDashboardEvents(container);
}

function getTabTitle(tab) {
  const titles = {
    overview: 'Dashboard Overview',
    profile: 'Profile & Profile Photo Management',
    about: 'About Me Section Control',
    services: 'What I Do (Services) Management',
    journey: 'Journey Timeline Management',
    projects: 'Projects Management',
    tech: 'Tech Stack (Toolbox)',
    contact: 'Contact Section Settings',
    socials: 'Social Links (Instagram, WhatsApp, GitHub, Email)',
    settings: 'Global Site Settings',
  };
  return titles[tab] || 'Admin Portal';
}

function renderLoginScreen() {
  return `
    <div class="admin-login">
      <div class="admin-login__card">
        <h1 class="admin-login__title">REZAUL KARIM</h1>
        <p class="admin-login__subtitle">ADMIN AUTHENTICATION</p>

        ${authError ? `<div class="admin-login__error">${authError}</div>` : ''}

        <form id="loginForm">
          <div class="admin-login__field">
            <label for="adminEmail">Admin ID / Email</label>
            <input type="email" id="adminEmail" class="admin-login__input" value="rexaul01@gmail.com" placeholder="rexaul01@gmail.com" required autofocus />
          </div>
          <div class="admin-login__field">
            <label for="adminPass">Security Password</label>
            <input type="password" id="adminPass" class="admin-login__input" placeholder="Enter admin password" required />
          </div>
          <button type="submit" class="admin-login__btn">Unlock Dashboard →</button>
        </form>
      </div>
    </div>
  `;
}

function attachLoginEvents(container) {
  const form = container.querySelector('#loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#adminEmail').value;
    const pass = container.querySelector('#adminPass').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        isAuthenticated = true;
        authError = '';
        render(container);
      } else {
        authError = data.error || 'Authentication failed';
        render(container);
      }
    } catch (err) {
      authError = 'Network error authenticating';
      render(container);
    }
  });
}

function renderTabContent(tab) {
  const data = getPortfolioData();

  if (tab === 'overview') {
    return `
      <div class="admin-grid-2">
        <div class="admin-card">
          <div class="admin-card__title">Portfolio Projects</div>
          <div style="font-size: 2.2rem; font-weight: 800; color: #FFF;">${data.projects.length}</div>
          <p style="font-size: 0.85rem; color: #94A3B8; margin-top: 0.25rem;">${data.projects.filter(p => p.featured !== false).length} Featured on Homepage</p>
        </div>
        <div class="admin-card">
          <div class="admin-card__title">Journey Timeline</div>
          <div style="font-size: 2.2rem; font-weight: 800; color: var(--color-cyan);">${data.journey.length} Chapters</div>
          <p style="font-size: 0.85rem; color: #94A3B8; margin-top: 0.25rem;">Years: ${data.journey.map(j => j.year).join(', ')}</p>
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-card__title">Quick Management Actions</div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="admin-btn admin-btn--primary" id="btnQuickAddProject">+ Add Project</button>
          <button class="admin-btn admin-btn--secondary" id="btnQuickAddService">+ Add Service</button>
          <button class="admin-btn admin-btn--secondary" id="btnQuickAddYear">+ Add Journey Year</button>
          <button class="admin-btn admin-btn--secondary" id="btnExportJson">📥 Export data.json Backup</button>
        </div>
      </div>
    `;
  }

  if (tab === 'profile') {
    const prof = data.profile || {};
    const avatarImg = prof.avatarUrl || '/rezaullogo.png';

    return `
      <form id="profileForm" class="admin-card">
        <div class="admin-card__title">Profile &amp; Profile Photo</div>

        <div class="admin-form-group">
          <label class="admin-label">Profile Photo (Upload file or enter image link)</label>
          <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem;">
            <div style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--color-cyan); overflow: hidden; background: #111; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); flex-shrink: 0;">
              <img id="avatarPreview" src="${avatarImg}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='/rezaullogo.png';" />
            </div>
            <div style="flex: 1;">
              <input type="file" id="avatarFileInput" accept="image/*" style="margin-bottom: 0.5rem; color: #94A3B8; font-size: 0.85rem;" />
              <input type="text" name="avatarUrl" id="avatarUrlInput" class="admin-input" value="${prof.avatarUrl || '/rezaullogo.png'}" placeholder="Enter image URL (/rezaullogo.png or https://...)" />
            </div>
          </div>
        </div>

        <div class="admin-form-group">
          <label class="admin-label">Full Name</label>
          <input type="text" name="name" class="admin-input" value="${prof.name || ''}" required />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Headline</label>
          <input type="text" name="headline" class="admin-input" value="${prof.headline || ''}" required />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Short Bio / Tagline</label>
          <textarea name="shortBio" class="admin-textarea">${prof.shortBio || ''}</textarea>
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Location</label>
          <input type="text" name="location" class="admin-input" value="${prof.location || ''}" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Availability Status</label>
          <input type="text" name="availability" class="admin-input" value="${prof.availability || ''}" />
        </div>
        <button type="submit" class="admin-btn admin-btn--primary">Save Profile Settings</button>
      </form>
    `;
  }

  if (tab === 'about') {
    const about = data.about || {};
    return `
      <form id="aboutForm" class="admin-card">
        <div class="admin-card__title">About Me Section Content</div>

        <div class="admin-form-group">
          <label class="admin-label">Section Title</label>
          <input type="text" name="title" class="admin-input" value="${about.title || "HEY.<br>I'M REZAUL."}" required />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Label Tag</label>
          <input type="text" name="label" class="admin-input" value="${about.label || "01 / HELLO"}" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Intro Statement (Large bold text)</label>
          <textarea name="intro" class="admin-textarea" rows="3" required>${about.intro || "I'm a self-taught developer and designer who likes turning ideas into things people can actually use."}</textarea>
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Detailed Biography Paragraph</label>
          <textarea name="paragraph" class="admin-textarea" rows="4">${(about.paragraphs && about.paragraphs[0]) || "I build high-performance web applications, modern mobile apps, and intelligent AI tools with a focus on bold design, clean architecture, and delightful user experience."}</textarea>
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Stickers (Comma separated)</label>
          <input type="text" name="stickers" class="admin-input" value="${(about.stickers || ['SELF-TAUGHT', 'BUILDER', 'DESIGNER']).join(', ')}" />
        </div>
        <button type="submit" class="admin-btn admin-btn--primary">Save About Me</button>
      </form>
    `;
  }

  if (tab === 'services') {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.1rem; font-weight: 700;">What I Do (Services &amp; Disciplines)</h2>
        <button class="admin-btn admin-btn--primary" id="btnAddService">+ Add Service</button>
      </div>

      <div class="admin-grid-2">
        ${data.skills.map((sk) => `
          <div class="admin-card" style="margin-bottom:0;">
            <div style="font-weight: 800; font-size: 1.05rem; color: var(--color-cyan);">${sk.name}</div>
            <div style="font-size: 0.85rem; color: #94A3B8; margin-top: 6px; line-height: 1.5;">${sk.description}</div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
              <button class="admin-btn admin-btn--danger" data-delete-skill="${sk.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (tab === 'projects') {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.1rem; font-weight: 700;">Projects (${data.projects.length})</h2>
        <button class="admin-btn admin-btn--primary" id="btnAddProject">+ Add Project</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${data.projects.map((proj) => `
          <div class="admin-card" style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0;">
            ${proj.image ? `
              <div style="width: 70px; height: 50px; border-radius: 4px; overflow: hidden; border: 1.5px solid #444; flex-shrink: 0; background: #111;">
                <img src="${proj.image}" style="width:100%; height:100%; object-fit:cover;" />
              </div>
            ` : ''}
            <div style="flex: 1;">
              <div style="font-weight: 800; font-size: 1.05rem;">${proj.title} ${proj.featured ? `<span style="font-size:0.7rem; background:var(--color-cyan); color:#000; padding:2px 6px; border-radius:4px; margin-left:6px;">FEATURED</span>` : ''}</div>
              <div style="font-size: 0.8rem; color: #94A3B8; margin-top: 2px;">${proj.category} · ${proj.year}</div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="admin-btn admin-btn--secondary" data-toggle-featured="${proj.id}">${proj.featured ? 'Unfeature' : 'Set Featured'}</button>
              <button class="admin-btn admin-btn--secondary" data-edit-project="${proj.id}">Edit</button>
              <button class="admin-btn admin-btn--danger" data-delete-project="${proj.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (tab === 'journey') {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.1rem; font-weight: 700;">Journey Timeline Chapters</h2>
        <button class="admin-btn admin-btn--primary" id="btnAddJourney">+ Add Year</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${data.journey.map((item) => `
          <div class="admin-card" style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0;">
            <div style="font-family: var(--font-display); font-size: 1.4rem; color: var(--color-cyan); width: 80px;">${item.year}</div>
            <div style="flex: 1;">
              <div style="font-weight: 800; font-size: 1rem;">${item.title}</div>
              <div style="font-size: 0.85rem; color: #94A3B8; margin-top: 2px;">${item.description.slice(0, 90)}...</div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="admin-btn admin-btn--secondary" data-edit-journey="${item.id}">Edit</button>
              <button class="admin-btn admin-btn--danger" data-delete-journey="${item.id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (tab === 'tech') {
    return `
      <div class="admin-card">
        <div class="admin-card__title">Tech Stack (Toolbox Tags)</div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          ${data.tools.map((t) => `<span class="tag tag--cyan">${t.name}</span>`).join('')}
        </div>
      </div>
    `;
  }

  if (tab === 'socials') {
    const soc = data.socials || {};
    return `
      <form id="socialsForm" class="admin-card">
        <div class="admin-card__title">Social Links Settings (LinkedIn Removed)</div>

        <div class="admin-form-group">
          <label class="admin-label">Email Address</label>
          <input type="email" name="email" class="admin-input" value="${soc.email || ''}" required />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">WhatsApp Number / Link (Format: 919000000000)</label>
          <input type="text" name="whatsapp" class="admin-input" value="${soc.whatsapp || ''}" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Instagram Profile URL</label>
          <input type="url" name="instagram" class="admin-input" value="${soc.instagram || ''}" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">GitHub Profile URL</label>
          <input type="url" name="github" class="admin-input" value="${soc.github || ''}" />
        </div>

        <button type="submit" class="admin-btn admin-btn--primary">Save Social Links</button>
      </form>
    `;
  }

  if (tab === 'contact') {
    const contact = data.contact || {};
    return `
      <form id="contactForm" class="admin-card">
        <div class="admin-card__title">Contact Section Headlines</div>

        <div class="admin-form-group">
          <label class="admin-label">Contact Heading</label>
          <input type="text" name="heading" class="admin-input" value="${contact.heading || "LET'S TALK"}" required />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Contact Subheading</label>
          <input type="text" name="subheading" class="admin-input" value="${contact.subheading || ''}" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">CTA Button Text</label>
          <input type="text" name="ctaText" class="admin-input" value="${contact.ctaText || "LET'S WORK →"}" />
        </div>

        <button type="submit" class="admin-btn admin-btn--primary">Save Contact Info</button>
      </form>
    `;
  }

  if (tab === 'settings') {
    const set = data.siteSettings || {};
    return `
      <form id="settingsForm" class="admin-card">
        <div class="admin-card__title">Global Site Settings</div>

        <div class="admin-form-group">
          <label class="admin-label">Site Title (SEO)</label>
          <input type="text" name="siteTitle" class="admin-input" value="${set.siteTitle || ''}" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Meta Description (SEO)</label>
          <textarea name="metaDescription" class="admin-textarea">${set.metaDescription || ''}</textarea>
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Copyright Text</label>
          <input type="text" name="copyrightText" class="admin-input" value="${set.copyrightText || ''}" />
        </div>

        <button type="submit" class="admin-btn admin-btn--primary">Save Site Settings</button>
      </form>
    `;
  }

  return '';
}

function attachDashboardEvents(container) {
  // Tab Navigation
  container.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab');
      render(container);
    });
  });

  // Logout
  const logoutBtn = container.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      isAuthenticated = false;
      render(container);
    });
  }

  // Quick Action Buttons
  const btnQuickAddProject = container.querySelector('#btnQuickAddProject');
  const btnAddProject = container.querySelector('#btnAddProject');
  if (btnQuickAddProject || btnAddProject) {
    const el = btnQuickAddProject || btnAddProject;
    el.addEventListener('click', () => openProjectModal(container));
  }

  const btnQuickAddService = container.querySelector('#btnQuickAddService');
  const btnAddService = container.querySelector('#btnAddService');
  if (btnQuickAddService || btnAddService) {
    const el = btnQuickAddService || btnAddService;
    el.addEventListener('click', () => openServiceModal(container));
  }

  const btnExportJson = container.querySelector('#btnExportJson');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const data = getPortfolioData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rezaul-portfolio-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Project Actions
  container.querySelectorAll('[data-edit-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-edit-project');
      const data = getPortfolioData();
      const proj = data.projects.find((p) => p.id === id);
      if (proj) openProjectModal(container, proj);
    });
  });

  container.querySelectorAll('[data-delete-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-project');
      if (confirm('Permanently delete this project?')) {
        const data = getPortfolioData();
        data.projects = data.projects.filter((p) => p.id !== id);
        syncData(data, container);
      }
    });
  });

  container.querySelectorAll('[data-delete-skill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-skill');
      if (confirm('Delete this service?')) {
        const data = getPortfolioData();
        data.skills = data.skills.filter((s) => s.id !== id);
        syncData(data, container);
      }
    });
  });

  container.querySelectorAll('[data-toggle-featured]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-toggle-featured');
      const data = getPortfolioData();
      const proj = data.projects.find((p) => p.id === id);
      if (proj) {
        proj.featured = !proj.featured;
        syncData(data, container);
      }
    });
  });

  // Avatar Upload Handler
  const avatarFileInput = container.querySelector('#avatarFileInput');
  const avatarUrlInput = container.querySelector('#avatarUrlInput');
  const avatarPreview = container.querySelector('#avatarPreview');

  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (loadEvt) => {
          const base64Url = loadEvt.target.result;
          if (avatarPreview) avatarPreview.src = base64Url;

          // Save image file to server (public/uploads/)
          try {
            const upRes = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: base64Url, name: file.name }),
            });
            const upData = await upRes.json();
            if (upRes.ok && upData.url) {
              if (avatarUrlInput) avatarUrlInput.value = upData.url;
              showToast('✓ Photo uploaded & saved to public/uploads/' + (upData.name || ''));
            } else {
              if (avatarUrlInput) avatarUrlInput.value = base64Url;
            }
          } catch (err) {
            if (avatarUrlInput) avatarUrlInput.value = base64Url;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (avatarUrlInput && avatarPreview) {
    avatarUrlInput.addEventListener('input', (e) => {
      if (e.target.value) avatarPreview.src = e.target.value;
    });
  }

  // Forms
  const profileForm = container.querySelector('#profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(profileForm);
      const data = getPortfolioData();
      data.profile = { ...data.profile, ...Object.fromEntries(formData) };
      syncData(data, container);
    });
  }

  const aboutForm = container.querySelector('#aboutForm');
  if (aboutForm) {
    aboutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(aboutForm);
      const data = getPortfolioData();
      data.about = {
        ...data.about,
        title: formData.get('title'),
        label: formData.get('label'),
        intro: formData.get('intro'),
        paragraphs: [formData.get('paragraph')],
        stickers: formData.get('stickers').split(',').map((s) => s.trim()).filter(Boolean),
      };
      syncData(data, container);
    });
  }

  const socialsForm = container.querySelector('#socialsForm');
  if (socialsForm) {
    socialsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(socialsForm);
      const data = getPortfolioData();
      data.socials = { ...data.socials, ...Object.fromEntries(formData) };
      syncData(data, container);
    });
  }

  const contactForm = container.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = getPortfolioData();
      data.contact = { ...data.contact, ...Object.fromEntries(formData) };
      syncData(data, container);
    });
  }

  const settingsForm = container.querySelector('#settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(settingsForm);
      const data = getPortfolioData();
      data.siteSettings = { ...data.siteSettings, ...Object.fromEntries(formData) };
      syncData(data, container);
    });
  }
}

function openServiceModal(container) {
  const modalDiv = document.createElement('div');
  modalDiv.className = 'admin-modal-overlay';
  modalDiv.innerHTML = `
    <div class="admin-modal">
      <h3 class="admin-modal__title">Add New Service</h3>
      <form id="serviceModalForm">
        <div class="admin-form-group">
          <label class="admin-label">Service Title (e.g. WEB DEVELOPMENT)</label>
          <input type="text" name="name" class="admin-input" required />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Description</label>
          <textarea name="description" class="admin-textarea" required></textarea>
        </div>
        <div class="admin-modal__actions">
          <button type="button" class="admin-btn admin-btn--secondary" id="serviceModalCancel">Cancel</button>
          <button type="submit" class="admin-btn admin-btn--primary">Add Service</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalDiv);

  modalDiv.querySelector('#serviceModalCancel').addEventListener('click', () => {
    document.body.removeChild(modalDiv);
  });

  modalDiv.querySelector('#serviceModalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = getPortfolioData();

    data.skills.push({
      id: `skill-${Date.now()}`,
      name: formData.get('name'),
      description: formData.get('description'),
      icon: 'code',
    });

    document.body.removeChild(modalDiv);
    syncData(data, container);
  });
}

function openProjectModal(container, existingProj = null) {
  const modalDiv = document.createElement('div');
  modalDiv.className = 'admin-modal-overlay';
  modalDiv.innerHTML = `
    <div class="admin-modal">
      <h3 class="admin-modal__title">${existingProj ? 'Edit Project' : 'Add New Project'}</h3>
      <form id="projectModalForm">
        <div class="admin-form-group">
          <label class="admin-label">Project Title</label>
          <input type="text" name="title" class="admin-input" value="${existingProj?.title || ''}" required />
        </div>

        <div class="admin-form-group">
          <label class="admin-label">Project Image / Photo Link</label>
          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem;">
            <div style="width: 100px; height: 65px; border: 2px solid var(--color-black); border-radius: 4px; overflow: hidden; background: #222; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <img id="projModalImgPreview" src="${existingProj?.image || ''}" style="width:100%; height:100%; object-fit:cover; display:${existingProj?.image ? 'block' : 'none'};" />
              <span id="projModalNoImg" style="font-size:0.7rem; color:#888; display:${existingProj?.image ? 'none' : 'block'};">No Image</span>
            </div>
            <div style="flex: 1;">
              <input type="file" id="projModalFileInput" accept="image/*" style="margin-bottom: 0.4rem; color: #94A3B8; font-size: 0.8rem;" />
              <input type="text" name="image" id="projModalImgUrl" class="admin-input" value="${existingProj?.image || ''}" placeholder="Paste image URL (https://... or /rezaullogo.png)" />
            </div>
          </div>
        </div>

        <div class="admin-form-group">
          <label class="admin-label">Category</label>
          <input type="text" name="category" class="admin-input" value="${existingProj?.category || 'WEB DESIGN × DEVELOPMENT'}" required />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Year</label>
          <input type="text" name="year" class="admin-input" value="${existingProj?.year || '2025'}" required />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Description (The Idea)</label>
          <textarea name="description" class="admin-textarea" required>${existingProj?.description || ''}</textarea>
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Technologies (Comma separated)</label>
          <input type="text" name="technologies" class="admin-input" value="${existingProj?.technologies ? existingProj.technologies.join(', ') : 'React, Node.js'}" />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">Live URL</label>
          <input type="url" name="liveUrl" class="admin-input" value="${existingProj?.liveUrl || ''}" placeholder="https://..." />
        </div>
        <div class="admin-form-group">
          <label class="admin-label">GitHub URL</label>
          <input type="url" name="codeUrl" class="admin-input" value="${existingProj?.codeUrl || ''}" placeholder="https://github.com/..." />
        </div>
        <div class="admin-modal__actions">
          <button type="button" class="admin-btn admin-btn--secondary" id="modalCancel">Cancel</button>
          <button type="submit" class="admin-btn admin-btn--primary">Save Project</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalDiv);

  const projModalFileInput = modalDiv.querySelector('#projModalFileInput');
  const projModalImgUrl = modalDiv.querySelector('#projModalImgUrl');
  const projModalImgPreview = modalDiv.querySelector('#projModalImgPreview');
  const projModalNoImg = modalDiv.querySelector('#projModalNoImg');

  if (projModalFileInput) {
    projModalFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (loadEvt) => {
          const base64 = loadEvt.target.result;
          if (projModalImgPreview) {
            projModalImgPreview.src = base64;
            projModalImgPreview.style.display = 'block';
          }
          if (projModalNoImg) projModalNoImg.style.display = 'none';

          // Upload image to server
          try {
            const upRes = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: base64, name: file.name }),
            });
            const upData = await upRes.json();
            if (upRes.ok && upData.url) {
              if (projModalImgUrl) projModalImgUrl.value = upData.url;
              showToast('✓ Project photo saved to public/uploads/' + (upData.name || ''));
            } else {
              if (projModalImgUrl) projModalImgUrl.value = base64;
            }
          } catch (err) {
            if (projModalImgUrl) projModalImgUrl.value = base64;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (projModalImgUrl) {
    projModalImgUrl.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val && projModalImgPreview) {
        projModalImgPreview.src = val;
        projModalImgPreview.style.display = 'block';
        if (projModalNoImg) projModalNoImg.style.display = 'none';
      } else if (!val && projModalImgPreview) {
        projModalImgPreview.style.display = 'none';
        if (projModalNoImg) projModalNoImg.style.display = 'block';
      }
    });
  }

  modalDiv.querySelector('#modalCancel').addEventListener('click', () => {
    document.body.removeChild(modalDiv);
  });

  modalDiv.querySelector('#projectModalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = getPortfolioData();

    const techArray = formData.get('technologies').split(',').map((t) => t.trim()).filter(Boolean);

    const projData = {
      id: existingProj ? existingProj.id : `proj-${Date.now()}`,
      title: formData.get('title'),
      category: formData.get('category'),
      year: formData.get('year'),
      description: formData.get('description'),
      technologies: techArray,
      liveUrl: formData.get('liveUrl'),
      codeUrl: formData.get('codeUrl'),
      featured: existingProj ? existingProj.featured : true,
      image: formData.get('image') || existingProj?.image || '',
      gallery: existingProj?.gallery || [],
    };

    if (existingProj) {
      const idx = data.projects.findIndex((p) => p.id === existingProj.id);
      if (idx !== -1) data.projects[idx] = projData;
    } else {
      data.projects.push(projData);
    }

    document.body.removeChild(modalDiv);
    syncData(data, container);
  });
}

async function syncData(newData, container) {
  saveLocalData(newData);
  render(container);

  try {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    if (res.ok) {
      showToast('✓ Saved directly to source file (public/data.json)!');
    }
  } catch (err) {
    showToast('Saved locally in browser');
  }
}
