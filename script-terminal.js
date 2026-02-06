/* ========================================
   TERMINAL PORTFOLIO - JAVASCRIPT
   Terminal effects, typing animations, cursor blink
   ======================================== */

// ========================================
// MATRIX FALLING LETTERS EFFECT
// ========================================

const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン!@#$%^&*()_+-=[]{}|;:,.<>?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function createFallingChar() {
  const matrixBg = document.getElementById('matrix-bg');
  if (!matrixBg) return;

  const char = document.createElement('div');
  char.className = 'falling-char';
  char.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
  
  const startX = Math.random() * window.innerWidth;
  const duration = 8 + Math.random() * 12;
  
  char.style.left = startX + 'px';
  char.style.animationDuration = duration + 's';
  
  if (Math.random() > 0.7) {
    char.classList.add('fade');
  }
  
  matrixBg.appendChild(char);
  
  setTimeout(() => {
    char.remove();
  }, duration * 1000);
}

function initMatrixBackground() {
  setInterval(createFallingChar, 150);
}

// ========================================
// TYPING ANIMATION - Type text character by character
// ========================================

class TypeWriter {
  constructor(element, options = {}) {
    this.element = element;
    this.text = element.textContent;
    this.speed = options.speed || 50;
    this.delay = options.delay || 0;
    this.element.textContent = '';
    this.index = 0;
    
    setTimeout(() => this.type(), this.delay);
  }
  
  type() {
    if (this.index < this.text.length) {
      this.element.textContent += this.text.charAt(this.index);
      this.index++;
      setTimeout(() => this.type(), this.speed);
    }
  }
}

// ========================================
// TERMINAL PROMPT - Add command-like styling
// ========================================

function initTerminalPrompts() {
  // Add command styling to section headers
  const sections = document.querySelectorAll('section');
  const commands = {
    '#home': './whoami',
    '#about': 'cat about.txt',
    '#projects': 'ls projects/',
    '#skills': 'grep -r skills .',
    '#contact': 'echo "Contact" > message.txt'
  };
  
  sections.forEach(section => {
    const id = section.id;
    if (commands[`#${id}`]) {
      section.setAttribute('data-command', `user@portfolio:~$ ${commands[`#${id}`]}`);
    }
  });
}

// ========================================
// THEME MANAGEMENT - Terminal Dark Mode
// ========================================

function initTheme() {
  // Terminal portfolio is always dark
  const theme = localStorage.getItem('theme') || 'terminal';
  document.documentElement.classList.add('dark');
  updateThemeIcon(theme);
}

function toggleTheme() {
  // For terminal theme, just toggle between terminal and light
  const isDark = document.documentElement.classList.contains('dark');
  
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    updateThemeIcon('light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'terminal');
    updateThemeIcon('terminal');
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
  }
}

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
  const menuButton = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (!menuButton || !mobileMenu) return;

  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active', !isOpen);
    menuIcon.textContent = isOpen ? '☰' : '✕';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuIcon.textContent = '☰';
    });
  });

  document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('active');
      menuIcon.textContent = '☰';
    }
  });
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 70;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections except hero
  document.querySelectorAll('section:not(#home)').forEach(section => {
    section.classList.add('fade-on-scroll');
    observer.observe(section);
  });

  // Observe project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.classList.add('fade-on-scroll');
    observer.observe(card);
  });

  // Observe feature items
  document.querySelectorAll('.feature-item').forEach(item => {
    item.classList.add('fade-on-scroll');
    observer.observe(item);
  });

  // Observe contact items
  document.querySelectorAll('.contact-item').forEach(item => {
    item.classList.add('fade-on-scroll');
    observer.observe(item);
  });
}

// ========================================
// SKILL BARS ANIMATION
// ========================================

function initSkillBars() {
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const width = fill.style.width;
          fill.style.width = '0';
          setTimeout(() => {
            fill.style.width = width;
          }, 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.skill-item').forEach(item => {
    observer.observe(item);
  });
}

// ========================================
// CONTACT FORM HANDLING
// ========================================

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const sendButton = form.querySelector('button[type="submit"]');
  let isSubmitting = false;

  form.addEventListener('submit', (e) => {
    if (isSubmitting) return;

    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validation
    if (!data.name || !data.email || !data.message) {
      alert('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Flying plane animation
    if (sendButton) {
      const rect = sendButton.getBoundingClientRect();
      const plane = document.createElement('span');
      plane.className = 'flying-plane';
      plane.textContent = '✈️';
      plane.style.left = rect.left + rect.width / 2 + 'px';
      plane.style.top = rect.top + rect.height / 2 + 'px';
      document.body.appendChild(plane);

      plane.addEventListener('animationend', () => {
        plane.remove();
      });

      sendButton.disabled = true;
    }

    isSubmitting = true;

    // Submit after animation
    setTimeout(() => {
      form.submit();
    }, 1100);
  });
}

// ========================================
// TYPING EFFECT FOR HERO
// ========================================

function initTypingEffect() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;

  new TypeWriter(subtitle, {
    speed: 40,
    delay: 1000
  });
}

// ========================================
// TERMINAL BOOT SEQUENCE
// ========================================

function initBootSequence() {
  const heroPrompt = document.querySelector('.hero::before');
  
  // The boot sequence is handled via CSS animation
  // This function can be used for additional effects if needed
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / opens help
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      showTerminalHelp();
    }
  });
}

function showTerminalHelp() {
  const helpText = `
  Terminal Portfolio Commands:
  ${'-'.repeat(40)}
  ctrl + / : Show this help
  ctrl + m : Toggle mobile menu
  
  Navigation:
  Home    : whoami
  About   : cat about.txt
  Projects: ls projects/
  Skills  : grep -r skills .
  Contact : echo "Contact" > message.txt
  `;
  
  alert(helpText);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initMatrixBackground();
  initTheme();
  initMobileMenu();
  initSmoothScrolling();
  initScrollAnimations();
  initSkillBars();
  initForm();
  initTypingEffect();
  initTerminalPrompts();
  initKeyboardShortcuts();

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Log to console for fun
  console.log('%cWelcome to Terminal Portfolio', 'color: #00ff41; font-size: 16px; font-weight: bold; font-family: monospace;');
  console.log('%cuser@portfolio:~$ _', 'color: #00ff41; font-size: 14px; font-family: monospace;');
});

// ========================================
// LAZY LOADING (if needed)
// ========================================

function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  if (images.length === 0) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
  initLazyLoading();
}
