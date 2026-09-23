document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const modal = document.getElementById('contact-modal');
  const modalDialog = modal?.querySelector('.modal-dialog');
  const openButtons = document.querySelectorAll('.js-open-contact');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  const copyButtons = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('copy-toast');
  let previousFocus = null;
  let toastTimer = null;

  const updateNavbar = () => navbar?.classList.toggle('scrolled', window.scrollY > 24);
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  const closeMenu = () => {
    mobileMenu?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const openModal = () => {
    if (!modal) return;
    previousFocus = document.activeElement;
    closeMenu();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => modal.querySelector('.modal-close')?.focus(), 80);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  };

  openButtons.forEach((button) => button.addEventListener('click', openModal));
  closeButtons.forEach((button) => button.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
    if (event.key !== 'Tab' || !modal?.classList.contains('is-open') || !modalDialog) return;

    const focusable = [...modalDialog.querySelectorAll('a[href], button:not([disabled])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const copyText = async (value) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
  };

  const showToast = () => {
    if (!toast) return;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1800);
  };

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await copyText(button.dataset.copy || '');
        showToast();
      } catch {
        button.setAttribute('aria-label', 'Could not copy');
      }
    });
  });

  const revealItems = document.querySelectorAll('.reveal:not(.is-visible)');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
});
