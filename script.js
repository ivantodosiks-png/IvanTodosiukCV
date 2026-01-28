// Theme management
function initTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.classList.toggle('dark', theme === 'dark');
  updateThemeIcon(theme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Mobile menu
function initMobileMenu() {
  const menuButton = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active', !isOpen);
    menuIcon.textContent = isOpen ? '☰' : '✕';
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuIcon.textContent = '☰';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('active');
      menuIcon.textContent = '☰';
    }
  });
}

// Smooth scrolling for anchor links
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

// Intersection Observer for animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all sections except hero
  document.querySelectorAll('section:not(#home)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });

  // Observe project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// Skill bars animation
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

// Form handling
function initForm() {
  const form = document.getElementById('contact-form');
  if (form) {
    const sendButton = form.querySelector('.send-button');
    let isSubmitting = false;

    form.addEventListener('submit', (e) => {
      if (isSubmitting) {
        // Второй вызов (через form.submit) — даём форме отправиться нормально
        return;
      }

      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Simple form validation
      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all fields');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Создаём самолётик, который полетит по всему экрану
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

      // Даём анимации время проиграться, затем реально отправляем форму на PHP
      setTimeout(() => {
        form.submit();
      }, 1100);
    });
  }
}

// Typing effect for hero subtitle
function initTypingEffect() {
  const subtitle = document.querySelector('.hero-subtitle');
  const text = subtitle.textContent;
  subtitle.textContent = '';
  let i = 0;

  const typeWriter = () => {
    if (i < text.length) {
      subtitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  };

  setTimeout(typeWriter, 1000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initSmoothScrolling();
  initScrollAnimations();
  initSkillBars();
  initForm();
  initTypingEffect();

  // Theme toggle event
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.cursor');
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

// Performance optimization: Lazy load images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
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

// Initialize lazy loading
initLazyLoading();