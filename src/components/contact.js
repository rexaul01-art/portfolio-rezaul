/* ═══════════════════════════════════════════════════
   CONTACT COMPONENT — Dynamic social links & form handler (SVG Icons)
═══════════════════════════════════════════════════ */

import { getPortfolioData, subscribeToStore, getWhatsAppUrl } from '../data/store.js';
import { ICONS } from '../utils/icons.js';

export function initContactForm() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  function renderContactSocials() {
    const data = getPortfolioData();
    const socials = data.socials || {};

    const socialContainer = contactSection.querySelector('.contact__social-links');
    if (!socialContainer) return;

    let html = '';

    // EMAIL
    if (socials.email) {
      html += `
        <a href="mailto:${socials.email}" class="contact__social-btn contact__social-btn--cyan" aria-label="Send email to Rezaul Karim">
          <span class="contact__social-icon" aria-hidden="true">${ICONS.email}</span>
          EMAIL
        </a>
      `;
    }

    // WHATSAPP
    if (socials.whatsapp) {
      const waUrl = getWhatsAppUrl(socials.whatsapp);
      html += `
        <a href="${waUrl}" class="contact__social-btn contact__social-btn--green" target="_blank" rel="noopener noreferrer" aria-label="Contact Rezaul Karim on WhatsApp">
          <span class="contact__social-icon" aria-hidden="true">${ICONS.whatsapp}</span>
          WHATSAPP
        </a>
      `;
    }

    // INSTAGRAM
    if (socials.instagram) {
      html += `
        <a href="${socials.instagram}" class="contact__social-btn contact__social-btn--pink" target="_blank" rel="noopener noreferrer" aria-label="Rezaul Karim on Instagram">
          <span class="contact__social-icon" aria-hidden="true">${ICONS.instagram}</span>
          INSTAGRAM
        </a>
      `;
    }

    // GITHUB
    if (socials.github) {
      html += `
        <a href="${socials.github}" class="contact__social-btn contact__social-btn--orange" target="_blank" rel="noopener noreferrer" aria-label="Rezaul Karim on GitHub">
          <span class="contact__social-icon" aria-hidden="true">${ICONS.github}</span>
          GITHUB
        </a>
      `;
    }

    socialContainer.innerHTML = html;
  }

  renderContactSocials();
  subscribeToStore(renderContactSocials);

  // Form submission validation
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submit = document.getElementById('contactSubmit');

  if (!form) return;

  const submitText = submit.querySelector('.contact__submit-text');
  const submitLoading = submit.querySelector('.contact__submit-loading');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function setFieldError(input, hasError) {
    if (hasError) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
    }
  }

  function validate() {
    let valid = true;
    const name = form.querySelector('#contactName');
    const email = form.querySelector('#contactEmail');
    const message = form.querySelector('#contactMessage');

    if (!name.value.trim()) { setFieldError(name, true); valid = false; }
    else setFieldError(name, false);

    if (!isValidEmail(email.value)) { setFieldError(email, true); valid = false; }
    else setFieldError(email, false);

    if (!message.value.trim() || message.value.trim().length < 5) { setFieldError(message, true); valid = false; }
    else setFieldError(message, false);

    return valid;
  }

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => setFieldError(field, false));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate()) {
      showStatus('Please fill in all required fields correctly.', 'error');
      return;
    }

    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      form.reset();
      showStatus('Message sent successfully! I will get back to you soon.', 'success');
    } catch (err) {
      showStatus('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(loading) {
    submit.disabled = loading;
    if (submitText) submitText.hidden = loading;
    if (submitLoading) submitLoading.hidden = !loading;
  }

  function showStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = `contact__form-status status--${type}`;
    status.hidden = false;
    if (type === 'success') {
      setTimeout(() => { status.hidden = true; }, 7000);
    }
  }
}
