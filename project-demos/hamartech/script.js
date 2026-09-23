const scrollButtons = document.querySelectorAll('[data-scroll]');
const toast = document.getElementById('toast');

scrollButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-scroll');
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.querySelectorAll('[data-action="copy"]').forEach(button => {
  button.addEventListener('click', async () => {
    const text = button.getAttribute('data-text') || '';
    try {
      await navigator.clipboard.writeText(text);
      showToast('Kortstokken er kopiert!');
    } catch (e) {
      showToast('Kunne ikke kopiere');
    }
  });
});

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// --- Admin / local content management ---
const adminBtn = document.getElementById('adminBtn');
const modal = document.getElementById('adminModal');
const modalClose = document.getElementById('modalClose');
const loginForm = document.getElementById('loginForm');
const adminForm = document.getElementById('adminForm');
const logoutBtn = document.getElementById('logoutBtn');
const flag1 = document.getElementById('flag1');
const loginError = document.getElementById('loginError');

const CONTENT_KEY = 'cr-content';
const TOKEN_KEY = 'cr-admin-token';
const DEMO_USER = 'charlotte';
const DEMO_PASS = 'admin-hamartech';
function buildAdminFlag() {
  // Hidden flag #1 (not visible as a FLAG{...} string in the source)
  const codes = [
    70, 76, 65, 71, 123, 97, 100, 109, 105, 110, 95, 112, 97,
    110, 101, 108, 95, 117, 110, 108, 111, 99, 107, 101, 100, 125
  ];
  return String.fromCharCode(...codes);
}

const FLAG_VALUE = buildAdminFlag();

const defaultContent = {
  heroTag: 'Fan-portal',
  heroTitle: 'Bygg din legende i Clash Royale',
  heroSubtitle: 'Bygg kortstokker, vinn på arenaene og åpne kister. De beste tipsene, kortutvalg og siste nytt – på ett sted.',
  heroBtnPrimary: 'Last ned spillet',
  heroBtnSecondary: 'Se kortstokker',
  stat1: 'meta-dekker',
  stat1n: '150+',
  stat2: 'arenaer',
  stat2n: '25',
  stat3: 'guider',
  stat3n: '24/7',
  card1Title: 'Gigant + Gnisten',
  card1Text: 'Stabil bru-push med tung tank. Støtt med Lyn.',
  card2Title: 'Hog + Minioner',
  card2Text: 'Raske push hver 20. sekund. Spinner syklusen med billige kort.',
  card3Title: 'Buedronning',
  card3Text: 'Gå i kontra etter forsvar, aktiver evnen for burst på tårn.'
};

const elements = {
  heroTag: document.getElementById('hero-tag'),
  heroTitle: document.getElementById('hero-title'),
  heroSubtitle: document.getElementById('hero-subtitle'),
  heroBtnPrimary: document.getElementById('hero-btn-primary'),
  heroBtnSecondary: document.getElementById('hero-btn-secondary'),
  stat1: document.getElementById('stat-1-text'),
  stat1n: document.getElementById('stat-1-number'),
  stat2: document.getElementById('stat-2-text'),
  stat2n: document.getElementById('stat-2-number'),
  stat3: document.getElementById('stat-3-text'),
  stat3n: document.getElementById('stat-3-number'),
  card1Title: document.getElementById('card-1-title'),
  card1Text: document.getElementById('card-1-text'),
  card2Title: document.getElementById('card-2-title'),
  card2Text: document.getElementById('card-2-text'),
  card3Title: document.getElementById('card-3-title'),
  card3Text: document.getElementById('card-3-text')
};

function loadContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONTENT_KEY) || '{}');
    return { ...defaultContent, ...saved };
  } catch (e) {
    return { ...defaultContent };
  }
}

function saveContent(content) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
}

function applyContent(content) {
  Object.entries(elements).forEach(([key, el]) => {
    if (el && content[key] !== undefined) {
      el.textContent = content[key];
    }
  });
}

function fillForm(content) {
  if (!adminForm) return;
  adminForm.heroTitle.value = content.heroTitle;
  adminForm.heroTag.value = content.heroTag;
  adminForm.heroSubtitle.value = content.heroSubtitle;
  adminForm.heroBtnPrimary.value = content.heroBtnPrimary;
  adminForm.heroBtnSecondary.value = content.heroBtnSecondary;
  adminForm.stat1.value = content.stat1;
  adminForm.stat1n.value = content.stat1n;
  adminForm.stat2.value = content.stat2;
  adminForm.stat2n.value = content.stat2n;
  adminForm.stat3.value = content.stat3;
  adminForm.stat3n.value = content.stat3n;
  adminForm.card1Title.value = content.card1Title;
  adminForm.card1Text.value = content.card1Text;
  adminForm.card2Title.value = content.card2Title;
  adminForm.card2Text.value = content.card2Text;
  adminForm.card3Title.value = content.card3Title;
  adminForm.card3Text.value = content.card3Text;
}

function showModal(show) {
  if (!modal) return;
  modal.classList.toggle('show', show);
}

function isLoggedIn() {
  return localStorage.getItem(TOKEN_KEY) === 'true';
}

function setLoggedIn(value) {
  localStorage.setItem(TOKEN_KEY, value ? 'true' : 'false');
  if (flag1) {
    flag1.textContent = value ? FLAG_VALUE : '';
    flag1.style.opacity = value ? '1' : '0.15';
  }
}

// Init content
let contentState = loadContent();
applyContent(contentState);
if (flag1 && isLoggedIn()) {
  flag1.style.opacity = '1';
}

// Events
if (adminBtn) {
  adminBtn.addEventListener('click', () => {
    showModal(true);
    if (isLoggedIn()) {
      loginForm.classList.add('hidden');
      adminForm.classList.remove('hidden');
      fillForm(contentState);
    } else {
      loginForm.classList.remove('hidden');
      adminForm.classList.add('hidden');
    }
  });
}

if (modalClose) {
  modalClose.addEventListener('click', () => showModal(false));
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) showModal(false);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (loginError) loginError.textContent = '';
    const user = loginForm.username.value.trim();
    const pass = loginForm.password.value.trim();
    const formData = new URLSearchParams();
    formData.append('log', user);
    formData.append('pwd', pass);
    formData.append('redirect_to', '/admin.html');

    // Simulerer POST-innlogging som kan snappes i en proxy/Intruder.
    // Ingen rate-limit, tilsiktet for CTF.
    fetch('/wp-login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    }).catch(() => {
      // Ignorer nettverksfeil i offline-miljø.
    }).finally(() => {
      if (user !== DEMO_USER) {
        if (loginError) loginError.textContent = 'Feil brukernavn.';
        showToast('Feil brukernavn');
        return;
      }
      if (pass !== DEMO_PASS) {
        if (loginError) loginError.textContent = 'Feil passord.';
        showToast('Feil passord');
        return;
      }
      if (user === DEMO_USER && pass === DEMO_PASS) {
        setLoggedIn(true);
        loginForm.classList.add('hidden');
        adminForm.classList.remove('hidden');
        fillForm(contentState);
        showToast('Logget inn (lokal)');
        if (loginError) loginError.textContent = '';
      }
    });
  });
}

if (adminForm) {
  adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      heroTitle: adminForm.heroTitle.value.trim(),
      heroTag: adminForm.heroTag.value.trim(),
      heroSubtitle: adminForm.heroSubtitle.value.trim(),
      heroBtnPrimary: adminForm.heroBtnPrimary.value.trim(),
      heroBtnSecondary: adminForm.heroBtnSecondary.value.trim(),
      stat1: adminForm.stat1.value.trim(),
      stat1n: adminForm.stat1n.value.trim(),
      stat2: adminForm.stat2.value.trim(),
      stat2n: adminForm.stat2n.value.trim(),
      stat3: adminForm.stat3.value.trim(),
      stat3n: adminForm.stat3n.value.trim(),
      card1Title: adminForm.card1Title.value.trim(),
      card1Text: adminForm.card1Text.value.trim(),
      card2Title: adminForm.card2Title.value.trim(),
      card2Text: adminForm.card2Text.value.trim(),
      card3Title: adminForm.card3Title.value.trim(),
      card3Text: adminForm.card3Text.value.trim()
    };
    contentState = { ...contentState, ...updated };
    saveContent(contentState);
    applyContent(contentState);
    showToast('Lagret i nettleser');
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    setLoggedIn(false);
    adminForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    showToast('Logget ut');
  });
}

