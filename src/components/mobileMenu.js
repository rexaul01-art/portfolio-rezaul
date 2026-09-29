/* ═══════════════════════════════════════════════════
   MOBILE MENU — Open, close, keyboard, focus trap
═══════════════════════════════════════════════════ */

export function initMobileMenu() {
  const menuBtn   = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeLinks = document.querySelectorAll('[data-close-menu]');

  if (!menuBtn || !mobileMenu) return;

  let isOpen = false;
  let scrollPos = 0;

  function openMenu() {
    isOpen = true;
    scrollPos = window.scrollY;
    mobileMenu.hidden = false;
    // Allow transition to play
    requestAnimationFrame(() => {
      mobileMenu.removeAttribute('hidden');
    });
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first link
    const firstLink = mobileMenu.querySelector('.mobile-menu__link');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    isOpen = false;
    mobileMenu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuBtn.focus();
  }

  menuBtn.addEventListener('click', () => {
    if (isOpen) closeMenu();
    else openMenu();
  });

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  closeLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // ─── Keyboard: Escape closes ───
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // ─── Touch: swipe up to close ───
  let touchStartY = 0;
  mobileMenu.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  mobileMenu.addEventListener('touchend', (e) => {
    const delta = touchStartY - e.changedTouches[0].clientY;
    if (delta > 60) closeMenu();
  }, { passive: true });
}
