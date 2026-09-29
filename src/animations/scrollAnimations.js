/* ═══════════════════════════════════════════════════
   SCROLL ANIMATIONS — GSAP ScrollTrigger
   Optimized for Desktop & Mobile performance
═══════════════════════════════════════════════════ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;

export function initScrollAnimations() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-up, .reveal-line').forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
    });
    return;
  }

  initHeroAnimations();
  initAboutAnimations();
  initJourneyIntroAnimations();
  initJourneyChapterAnimations();
  initDisciplinesAnimations();
  initToolboxAnimations();
  initProjectAnimations();
  initCtaAnimations();
  initFooterAnimations();
}

/* HERO ANIMATIONS */
function initHeroAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const browser  = hero.querySelector('.hero__browser');
  const name1    = hero.querySelector('.hero__name-line1');
  const name2    = hero.querySelector('.hero__name-line2');
  const subtitle = hero.querySelector('.hero__subtitle');
  const portrait = hero.querySelector('.hero__portrait-wrap');
  const stickers = hero.querySelectorAll('.hero [class*="hero__sticker"]');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.from(browser, { y: isMobile ? 30 : 50, opacity: 0, duration: 0.9 })
    .from([name1, name2], { y: isMobile ? 20 : 35, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.5')
    .from(subtitle, { y: 15, opacity: 0, duration: 0.4 }, '-=0.3')
    .from(stickers, { scale: 0.7, opacity: 0, duration: 0.4, stagger: 0.06 }, '-=0.2')
    .from(portrait, { scale: 0.8, opacity: 0, duration: 0.4 }, '-=0.3');

  if (!isMobile) {
    gsap.to(browser, {
      y: -40,
      scale: 0.98,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }
}

/* ABOUT ANIMATIONS */
function initAboutAnimations() {
  const about = document.querySelector('.about');
  if (!about) return;

  const lines = about.querySelectorAll('.reveal-line');
  const body  = about.querySelector('.about__body');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: about,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    defaults: { ease: 'power2.out' },
  });

  tl.from(lines, { y: 30, opacity: 0, duration: 0.6, stagger: 0.12 })
    .from(body, { y: 20, opacity: 0, duration: 0.5 }, '-=0.3');
}

/* JOURNEY INTRO */
function initJourneyIntroAnimations() {
  const section = document.querySelector('.journey-intro');
  if (!section) return;

  const blob = section.querySelector('.journey-intro__blob');
  const hbox = section.querySelector('.journey-intro__heading-box');

  gsap.from(blob, {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: { trigger: section, start: 'top 85%' },
  });

  gsap.from(hbox, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    scrollTrigger: { trigger: section, start: 'top 80%' },
  });
}

/* JOURNEY CHAPTERS */
function initJourneyChapterAnimations() {
  document.querySelectorAll('.journey-chapter').forEach((chapter) => {
    gsap.from(chapter, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: chapter,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

/* DISCIPLINES */
function initDisciplinesAnimations() {
  const section = document.querySelector('.disciplines');
  if (!section) return;

  const cards = section.querySelectorAll('.discipline-card');
  gsap.from(cards, {
    y: 40,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
    },
  });
}

/* TOOLBOX */
function initToolboxAnimations() {
  const section = document.querySelector('.toolbox');
  if (!section) return;

  const tags = section.querySelectorAll('.tool-tag');
  gsap.from(tags, {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    stagger: 0.04,
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
    },
  });
}

/* PROJECTS */
function initProjectAnimations() {
  document.querySelectorAll('.project-item').forEach((project) => {
    gsap.from(project, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      scrollTrigger: {
        trigger: project,
        start: 'top 80%',
      },
    });
  });
}

/* CTA */
function initCtaAnimations() {
  const cta = document.querySelector('.cta');
  if (!cta) return;

  const browser = cta.querySelector('.cta__browser');
  gsap.from(browser, {
    scale: 0.95,
    opacity: 0,
    duration: 0.7,
    scrollTrigger: {
      trigger: cta,
      start: 'top 80%',
    },
  });
}

/* FOOTER */
function initFooterAnimations() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  const name = footer.querySelector('.footer__name');
  gsap.from(name, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: footer,
      start: 'top 90%',
    },
  });
}
