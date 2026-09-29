/* ═══════════════════════════════════════════════════
   NAVBAR — Scroll state, active section, smooth scroll
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore } from '../data/store.js';

export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id], article[id]');

  if (!navbar) return;

  // ─── Scroll state ───
  function onScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ─── Active link via IntersectionObserver ───
  const observerOptions = {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      const matches =
        (href === '#work' && (sectionId === 'work' || sectionId.startsWith('project-'))) ||
        (href === '#journey' && (sectionId === 'journey' || sectionId.startsWith('chapter-'))) ||
        (href === '#about' && sectionId === 'about') ||
        (href === '#contact' && (sectionId === 'contact' || sectionId === 'cta'));

      if (matches) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Smooth scroll for all anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navHeight = navbar.offsetHeight || 68;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Subscribe to store updates to keep CTA dynamic
  subscribeToStore((data) => {
    // Dynamic updates if needed
  });
}
