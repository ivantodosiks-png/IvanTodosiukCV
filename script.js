const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-button");
const mobileNavigation = document.querySelector(".mobile-nav");
const sculptureStage = document.querySelector("[data-sculpture]");
const sculpture = sculptureStage?.querySelector(".sculpture");
const modal = document.querySelector("[data-modal]");
const modalDialog = modal?.querySelector(".modal-dialog");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeColor = document.querySelector("meta[name='theme-color']");
const projectModal = document.querySelector("[data-project-modal]");
const projectModalDialog = projectModal?.querySelector(".project-modal-dialog");
const projectFrame = projectModal?.querySelector("[data-project-frame]");
const projectFrameWrap = projectModal?.querySelector(".project-frame-wrap");
const projectModalTitle = projectModal?.querySelector("[data-project-modal-title]");
const projectExternalLink = projectModal?.querySelector("[data-project-external-link]");
const toast = document.querySelector("[data-toast]");
const navigationLinks = [...document.querySelectorAll(".desktop-nav a[href^='#'], .mobile-nav a[href^='#']")];
const navigationSections = [...new Set(navigationLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean))];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let lastFocusedElement = null;
let toastTimer;

function applyTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.dataset.theme = isLight ? "light" : "dark";
  try {
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  } catch {
    // The theme still works if storage is unavailable.
  }
  themeToggle?.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  themeToggle?.setAttribute("aria-pressed", String(isLight));
  themeColor?.setAttribute("content", isLight ? "#E9EDE9" : "#0E1011");
}

applyTheme(document.documentElement.dataset.theme);
themeToggle?.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
});

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);

  let currentSection = null;
  navigationSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.38) currentSection = section;
  });
  navigationLinks.forEach((link) => {
    link.classList.toggle("is-active", Boolean(currentSection) && link.getAttribute("href") === `#${currentSection.id}`);
  });
}

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open menu");
  if (menuButton) menuButton.textContent = "Menu";
  mobileNavigation?.classList.remove("is-open");
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  menuButton.textContent = isOpen ? "Menu" : "Close";
  mobileNavigation?.classList.toggle("is-open", !isOpen);
});

mobileNavigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });
    window.history.replaceState(null, "", link.getAttribute("href"));
  });
});
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px" });

document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => revealObserver.observe(element));

if (sculptureStage && sculpture && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  sculptureStage.addEventListener("pointermove", (event) => {
    const bounds = sculptureStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    sculpture.style.setProperty("--rotate-y", `${x * 7}deg`);
    sculpture.style.setProperty("--rotate-x", `${y * -5}deg`);
  });

  sculptureStage.addEventListener("pointerleave", () => {
    sculpture.style.setProperty("--rotate-y", "0deg");
    sculpture.style.setProperty("--rotate-x", "0deg");
  });
}

function getFocusableElements(container) {
  if (!container) return [];
  return [...container.querySelectorAll("a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex='-1'])")];
}

function openModal() {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  closeMenu();
  window.setTimeout(() => modal.querySelector("[data-close-modal]")?.focus(), 80);
}

function closeModal() {
  if (!modal?.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function openProjectModal(trigger) {
  if (!projectModal || !projectFrame) return;
  lastFocusedElement = trigger;
  closeModal();
  closeMenu();
  const projectTitle = trigger.dataset.projectTitle || "Project";
  projectModalTitle.textContent = projectTitle;
  projectFrame.title = `${projectTitle} project preview`;
  projectExternalLink.href = trigger.dataset.projectExternal || "#";
  projectFrameWrap?.classList.remove("is-loaded");
  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  projectFrame.src = trigger.dataset.projectUrl;
  window.setTimeout(() => projectModal.querySelector("[data-close-project]")?.focus(), 80);
}

function closeProjectModal() {
  if (!projectModal?.classList.contains("is-open")) return;
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  projectFrameWrap?.classList.remove("is-loaded");
  window.setTimeout(() => {
    if (projectFrame) projectFrame.src = "about:blank";
  }, 350);
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

document.querySelectorAll(".js-open-contact").forEach((button) => button.addEventListener("click", openModal));
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModal));
document.querySelectorAll(".js-open-project").forEach((button) => button.addEventListener("click", () => openProjectModal(button)));
document.querySelectorAll("[data-close-project]").forEach((button) => button.addEventListener("click", closeProjectModal));
projectFrame?.addEventListener("load", () => {
  if (projectModal?.classList.contains("is-open")) projectFrameWrap?.classList.add("is-loaded");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
    closeModal();
    closeMenu();
    return;
  }

  if (event.key !== "Tab") return;
  const activeDialog = projectModal?.classList.contains("is-open") ? projectModalDialog : modal?.classList.contains("is-open") ? modalDialog : null;
  if (!activeDialog) return;
  const focusable = getFocusableElements(activeDialog);
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

function showToast() {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = value;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    temporaryInput.remove();
  }
  showToast();
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyText(button.dataset.copy));
});
