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

// Form handling
function initForm() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sendButton = form.querySelector('.send-button');
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

      // Отправляем данные на PHP через fetch API
      fetch('Db/submit.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        console.log('Response:', data);
        alert(data);
        if (data.includes('successfully')) {
          form.reset();
        }
        if (sendButton) {
          sendButton.disabled = false;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error sending message: ' + error);
        if (sendButton) {
          sendButton.disabled = false;
        }
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScrolling();
  initForm();
});