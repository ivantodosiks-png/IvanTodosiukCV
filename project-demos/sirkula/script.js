// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('nav');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (nav && nav.classList.contains('active') && 
      !nav.contains(e.target) && 
      !mobileMenuToggle.contains(e.target)) {
    nav.classList.remove('active');
    const icon = mobileMenuToggle.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-times');
  }
});

// Header scroll effect
const topbar = document.querySelector('.topbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    topbar.classList.add('scrolled');
  } else {
    topbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
}, { passive: true });

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

function highlightActiveSection() {
  const scrollY = window.pageYOffset + 150;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', highlightActiveSection, { passive: true });

// Smooth scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  });
});

// Intersection Observer for fade-in animations
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

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
  // Animate cards and sections
  const animatedElements = document.querySelectorAll(
    '.explanation-card, .recycling-card, .action-card, .section-header'
  );
  
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });

  // Hero animation
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');
  
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 100);
  }
  
  if (heroVisual) {
    heroVisual.style.opacity = '0';
    setTimeout(() => {
      heroVisual.style.transition = 'opacity 1s ease 0.3s';
      heroVisual.style.opacity = '1';
    }, 300);
  }
});

// Quiz Functionality
const quizData = [
  {
    question: "Hvor ofte handler du klær?",
    options: [
      { text: "Flere ganger i måneden", value: 4 },
      { text: "En gang i måneden", value: 3 },
      { text: "Noen ganger i året", value: 2 },
      { text: "Sjelden eller bare når jeg trenger", value: 1 }
    ]
  },
  {
    question: "Hvordan håndterer du matavfall?",
    options: [
      { text: "Kaster alt i restavfall", value: 4 },
      { text: "Komposterer noe, men kaster mye", value: 3 },
      { text: "Komposterer det meste", value: 2 },
      { text: "Komposterer alt og planlegger måltider", value: 1 }
    ]
  },
  {
    question: "Hvor ofte bruker du engangsprodukter?",
    options: [
      { text: "Daglig", value: 4 },
      { text: "Flere ganger i uken", value: 3 },
      { text: "Sjelden", value: 2 },
      { text: "Aldri - bruker bare gjenbrukbare alternativer", value: 1 }
    ]
  },
  {
    question: "Hvordan sorterer du avfall?",
    options: [
      { text: "Kaster alt i samme beholder", value: 4 },
      { text: "Sorterer noe, men ikke alt", value: 3 },
      { text: "Sorterer det meste riktig", value: 2 },
      { text: "Sorterer alt perfekt etter retningslinjer", value: 1 }
    ]
  },
  {
    question: "Hvor ofte reparerer du ting i stedet for å kaste?",
    options: [
      { text: "Aldri - kaster bare og kjøper nytt", value: 4 },
      { text: "Sjelden", value: 3 },
      { text: "Noen ganger", value: 2 },
      { text: "Ofte - prøver alltid å reparere først", value: 1 }
    ]
  },
  {
    question: "Hvor mye emballasje har produktene du kjøper?",
    options: [
      { text: "Mye emballasje på nesten alt", value: 4 },
      { text: "En del emballasje", value: 3 },
      { text: "Litt emballasje", value: 2 },
      { text: "Minimal eller ingen emballasje", value: 1 }
    ]
  }
];

let currentQuestion = 0;
let quizAnswers = [];

function initQuiz() {
  const quizContent = document.getElementById('quizContent');
  if (!quizContent) return;

  quizAnswers = [];
  currentQuestion = 0;
  
  updateQuizProgress();
  renderQuestion();
}

function updateQuizProgress() {
  const progressFill = document.getElementById('quizProgress');
  const progressText = document.getElementById('progressText');
  
  if (progressFill) {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
  }
  
  if (progressText) {
    progressText.textContent = `Spørsmål ${currentQuestion + 1} av ${quizData.length}`;
  }
}

function renderQuestion() {
  const quizContent = document.getElementById('quizContent');
  if (!quizContent) return;

  if (currentQuestion >= quizData.length) {
    showResults();
    return;
  }

  const question = quizData[currentQuestion];
  
  let html = `
    <div class="quiz-question">
      <h3>${question.question}</h3>
      <div class="quiz-options">
  `;

  question.options.forEach((option, index) => {
    html += `
      <button class="quiz-option" data-value="${option.value}" data-index="${index}">
        ${option.text}
      </button>
    `;
  });

  html += `
      </div>
      <div class="quiz-nav">
        <button class="button secondary" ${currentQuestion === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} id="prevQuestion">
          <i class="fas fa-arrow-left"></i> Forrige
        </button>
        <button class="button secondary" id="nextQuestion" style="opacity: 0.5; cursor: not-allowed;" disabled>
          Neste <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;

  quizContent.innerHTML = html;

  // Add event listeners
  const options = quizContent.querySelectorAll('.quiz-option');
  const nextButton = document.getElementById('nextQuestion');
  const prevButton = document.getElementById('prevQuestion');

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      const value = parseInt(option.dataset.value);
      quizAnswers[currentQuestion] = value;
      
      if (nextButton) {
        nextButton.disabled = false;
        nextButton.style.opacity = '1';
        nextButton.style.cursor = 'pointer';
      }
    });
  });

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (quizAnswers[currentQuestion] !== undefined) {
        currentQuestion++;
        updateQuizProgress();
        renderQuestion();
      }
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        updateQuizProgress();
        renderQuestion();
      }
    });
  }

  // Restore selected answer if exists
  if (quizAnswers[currentQuestion] !== undefined) {
    const selectedValue = quizAnswers[currentQuestion];
    options.forEach(option => {
      if (parseInt(option.dataset.value) === selectedValue) {
        option.classList.add('selected');
        if (nextButton) {
          nextButton.disabled = false;
          nextButton.style.opacity = '1';
          nextButton.style.cursor = 'pointer';
        }
      }
    });
  }
}

function showResults() {
  const quizContent = document.getElementById('quizContent');
  const quizResults = document.getElementById('quizResults');
  
  if (!quizContent || !quizResults) return;

  // Calculate score (lower is better)
  const totalScore = quizAnswers.reduce((sum, answer) => sum + answer, 0);
  const maxScore = quizData.length * 4;
  const percentage = ((maxScore - totalScore) / maxScore) * 100;
  const score = Math.round(percentage);

  let resultCategory, resultMessage, resultTips;

  if (score >= 80) {
    resultCategory = "Utmerket! 🌟";
    resultMessage = "Du er allerede en sirkulær helt! Du gjør så mye riktig for miljøet. Fortsett med det gode arbeidet og inspirer andre.";
    resultTips = [
      "Del dine tips med venner og familie",
      "Prøv nye måter å redusere enda mer på",
      "Involver deg i lokale miljøinitiativ"
    ];
  } else if (score >= 60) {
    resultCategory = "Bra jobbet! 👍";
    resultMessage = "Du er på riktig spor! Du gjør allerede mye godt for miljøet. Med noen små justeringer kan du bli enda bedre.";
    resultTips = [
      "Prøv å redusere engangsprodukter",
      "Fokuser mer på riktig sortering",
      "Tenk på å reparere i stedet for å kaste"
    ];
  } else if (score >= 40) {
    resultCategory = "God start 💚";
    resultMessage = "Du har begynt reisen mot en mer sirkulær livsstil. Det er aldri for sent å endre vaner – start med små endringer i dag.";
    resultTips = [
      "Begynn med å sortere avfall riktig",
      "Kjøp mindre og tenk før du handler",
      "Prøv å reparere ting i stedet for å kaste"
    ];
  } else {
    resultCategory = "Tid for endring 🔄";
    resultMessage = "Alle kan forbedre seg! Start med noen enkle endringer i hverdagen. Hvert lite valg du tar teller.";
    resultTips = [
      "Start med å sortere avfall",
      "Reduser bruk av engangsprodukter",
      "Tenk 'trenger jeg dette?' før du kjøper",
      "Lær om sirkulær økonomi i <a href='#sirkular'>dette avsnittet</a>"
    ];
  }

  quizContent.classList.add('hidden');
  quizResults.classList.remove('hidden');
  
  quizResults.innerHTML = `
    <h2>${resultCategory}</h2>
    <div class="result-score">${score}%</div>
    <p class="result-text">${resultMessage}</p>
    <div class="result-tips">
      <h3>Her er noen tips for deg:</h3>
      <ul>
        ${resultTips.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>
    <button class="button primary" onclick="initQuiz()" style="margin-top: 2rem;">
      <span>Ta quiz på nytt</span>
      <i class="fas fa-redo"></i>
    </button>
  `;

  // Scroll to results
  quizResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the quiz section
  const quizSection = document.getElementById('quiz');
  if (quizSection) {
    // Wait a bit for smooth scroll if coming from anchor
    setTimeout(() => {
      if (window.location.hash === '#quiz') {
        initQuiz();
      }
    }, 500);
  }

  // Initialize quiz when quiz section comes into view
  const quizObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && quizAnswers.length === 0) {
        initQuiz();
      }
    });
  }, { threshold: 0.5 });

  if (quizSection) {
    quizObserver.observe(quizSection);
  }
});

// Add parallax effect to hero
window.addEventListener('scroll', () => {
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.scrollY < window.innerHeight) {
    const scrolled = window.pageYOffset;
    heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
}, { passive: true });

// Add ripple effect to buttons
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  .button {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

console.log('♻️ Sirkulær website loaded!');
