// Quiz Data - Sortering og sirkularitet
const quizData = [
  {
    question: "Hvor ofte sorterer du avfall i riktige beholdere?",
    options: [
      { text: "Alltid – jeg sorterer alt perfekt", value: 10 },
      { text: "Oftest – sorterer det meste riktig", value: 7 },
      { text: "Noen ganger – sorterer noe avfallet", value: 4 },
      { text: "Sjelden eller aldri – kaster alt sammen", value: 1 }
    ]
  },
  {
    question: "Hvordan håndterer du plastemballasje?",
    options: [
      { text: "Vasker og sorterer alt riktig", value: 10 },
      { text: "Sorterer oftest, men glemmer noen ganger å vaske", value: 7 },
      { text: "Sorterer noe, men ikke alltid", value: 4 },
      { text: "Kaster alt i restavfall", value: 1 }
    ]
  },
  {
    question: "Hva gjør du med papir og papp?",
    options: [
      { text: "Sorterer alt i papircontainer, holder det rent og tørt", value: 10 },
      { text: "Sorterer det meste, men noen ganger går det i restavfall", value: 7 },
      { text: "Sorterer litt, men ikke konsistent", value: 4 },
      { text: "Kaster alt i restavfall", value: 1 }
    ]
  },
  {
    question: "Hvordan håndterer du glassemballasje?",
    options: [
      { text: "Sorterer alltid etter farge i glasscontainer", value: 10 },
      { text: "Sorterer oftest, men ikke alltid etter farge", value: 7 },
      { text: "Sorterer noen ganger", value: 4 },
      { text: "Kaster i restavfall", value: 1 }
    ]
  },
  {
    question: "Hva gjør du med matavfall?",
    options: [
      { text: "Komposterer alt eller bruker matavfallscontainer", value: 10 },
      { text: "Komposterer det meste", value: 7 },
      { text: "Komposterer noe, men kaster mye", value: 4 },
      { text: "Kaster alt i restavfall", value: 1 }
    ]
  },
  {
    question: "Hvor ofte kjøper du produkter med mye emballasje?",
    options: [
      { text: "Sjelden eller aldri – unngår emballasje aktivt", value: 10 },
      { text: "Noen ganger, men prøver å unngå det", value: 7 },
      { text: "Oftest, men tenker litt på det", value: 4 },
      { text: "Alltid – bryr meg ikke om emballasje", value: 1 }
    ]
  },
  {
    question: "Hva gjør du med klær og tekstiler du ikke bruker lenger?",
    options: [
      { text: "Donerer eller selger dem, aldri kaster", value: 10 },
      { text: "Donerer det meste, men kaster noe", value: 7 },
      { text: "Donerer noen ganger", value: 4 },
      { text: "Kaster dem i restavfall", value: 1 }
    ]
  },
  {
    question: "Hvor ofte reparerer du ting i stedet for å kaste?",
    options: [
      { text: "Alltid – prøver først å reparere", value: 10 },
      { text: "Oftest – reparerer når det er mulig", value: 7 },
      { text: "Noen ganger", value: 4 },
      { text: "Sjelden eller aldri – kaster og kjøper nytt", value: 1 }
    ]
  }
];

let currentQuestion = 0;
let quizAnswers = [];

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

// Smooth scroll
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
    }
  });
});

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

  // Calculate score (max is 10 * 8 = 80, so percentage is (sum/80) * 100)
  const totalScore = quizAnswers.reduce((sum, answer) => sum + answer, 0);
  const maxScore = quizData.length * 10;
  const percentage = Math.round((totalScore / maxScore) * 100);
  const score = percentage;

  let resultCategory, resultMessage, resultTips;

  if (score >= 85) {
    resultCategory = "Utmerket! 🌟";
    resultMessage = `Du sirkulerer ${score}% av ditt avfall! Du er en ekte sirkulær helt og gjør en enorm forskjell for miljøet. Fortsett med det fantastiske arbeidet!`;
    resultTips = [
      "Del dine gode vaner med venner og familie",
      "Involver deg i lokale miljøinitiativ",
      "Prøv å inspirere andre til å bli mer sirkulære"
    ];
  } else if (score >= 70) {
    resultCategory = "Veldig bra! 👍";
    resultMessage = `Du sirkulerer ${score}% av ditt avfall! Du gjør mye riktig, men det finnes fortsatt muligheter for forbedring. Små endringer kan gjøre stor forskjell.`;
    resultTips = [
      "Sørg for å vaske plast før sortering",
      "Komposter mer matavfall",
      "Tenk på ombruk før du kaster ting",
      "Bruk Resirkula og Kirppis mer aktivt"
    ];
  } else if (score >= 50) {
    resultCategory = "God start! 💚";
    resultMessage = `Du sirkulerer ${score}% av ditt avfall. Du har begynt reisen mot en mer sirkulær livsstil. Med noen enkle endringer kan du gjøre enda bedre!`;
    resultTips = [
      "Start med å sortere avfall riktig hver dag",
      "Sjekk retningslinjene for sortering i din kommune",
      "Lær deg hva som kan resirkuleres",
      "Besøk Resirkula for tips og veiledning",
      "Tenk 'trenger jeg dette?' før du kjøper nye ting"
    ];
  } else if (score >= 30) {
    resultCategory = "Tid for endring! 🔄";
    resultMessage = `Du sirkulerer ${score}% av ditt avfall. Det er mye å forbedre, men alle kan endre vaner. Start med små, enkle steg i dag!`;
    resultTips = [
      "Sett opp sorteringssystem hjemme",
      "Lær deg hva som hører hjemme i hvilke beholdere",
      "Vask og tørk emballasje før sortering",
      "Besøk Resirkula og lær mer om sirkulær økonomi",
      "Prøv å reparere ting i stedet for å kaste",
      "Doner eller selg ting du ikke bruker"
    ];
  } else {
    resultCategory = "Kom i gang! 🚀";
    resultMessage = `Du sirkulerer ${score}% av ditt avfall. Det er aldri for sent å begynne! Hvert lite valg du tar teller. La oss starte sammen!`;
    resultTips = [
      "Begynn med å sortere bare én type avfall (f.eks. plast)",
      "Besøk Resirkula for informasjon og veiledning",
      "Lær deg retningslinjene for sortering i Hamar",
      "Sett opp sorteringsbeholdere hjemme",
      "Delta på kurs og omvisninger",
      "Følg våre sosiale medier for tips og inspirasjon"
    ];
  }

  quizContent.classList.add('hidden');
  quizResults.classList.remove('hidden');
  
  quizResults.innerHTML = `
    <div class="result-header">
      <h2>${resultCategory}</h2>
      <div class="result-score-large">${score}%</div>
      <p class="result-subtitle">Din sirkularitetsscore</p>
    </div>
    <p class="result-text">${resultMessage}</p>
    <div class="result-tips">
      <h3>Her er noen tips for deg:</h3>
      <ul>
        ${resultTips.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>
    <div class="result-actions">
      <a href="../index.html" class="button primary">
        <span>Tilbake til forsiden</span>
        <i class="fas fa-home"></i>
      </a>
      <button class="button secondary" onclick="initQuiz()">
        <span>Ta quiz på nytt</span>
        <i class="fas fa-redo"></i>
      </button>
    </div>
  `;

  // Scroll to results
  quizResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
});

console.log('♻️ Quiz page loaded!');

