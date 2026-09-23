/*
 * Placeholder expertise data.
 * Edit only this array to replace categories or technologies later.
 */
const EXPERTISE_DATA = [
  {
    id: 'backend',
    label: 'Backend',
    note: 'Server-side systems and application logic',
    technologies: ['Node.js', 'Python', 'REST API', 'Authentication', 'WebSockets'],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    note: 'Interfaces, interaction and responsive experiences',
    technologies: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React'],
  },
  {
    id: 'linux',
    label: 'Linux',
    note: 'Systems, environments and web infrastructure',
    technologies: ['Ubuntu', 'Debian', 'Bash', 'Nginx', 'Docker'],
  },
  {
    id: 'databases',
    label: 'Databases',
    note: 'Structured data and storage technologies',
    technologies: ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB'],
  },
];

class ExpertiseSection extends HTMLElement {
  constructor() {
    super();
    this.activeId = EXPERTISE_DATA[0].id;
    this.switchTimer = null;
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  render() {
    const active = this.getActiveCategory();

    this.innerHTML = `
      <section class="section expertise-section">
        <div class="container">
          <div class="section-label reveal">
            <span>03</span>
            <p>Selected expertise</p>
          </div>
          <div class="expertise-heading reveal">
            <h2>Точная система.<br><em>Чистый результат.</em></h2>
            <p>Тестовая структура навыков. Категории и технологии хранятся отдельно и легко заменяются.</p>
          </div>
          <div class="expertise-layout reveal">
            <div class="expertise-tabs" role="tablist" aria-label="Категории экспертизы">
              ${EXPERTISE_DATA.map((category, index) => `
                <button
                  class="expertise-tab${category.id === this.activeId ? ' is-active' : ''}"
                  type="button"
                  role="tab"
                  id="tab-${category.id}"
                  aria-selected="${category.id === this.activeId}"
                  aria-controls="expertise-panel"
                  tabindex="${category.id === this.activeId ? '0' : '-1'}"
                  data-expertise-id="${category.id}"
                >
                  <span>${String(index + 1).padStart(2, '0')}</span>
                  <strong>${category.label}</strong>
                </button>
              `).join('')}
            </div>
            <div class="expertise-panel" id="expertise-panel" role="tabpanel" aria-labelledby="tab-${active.id}" aria-live="polite">
              ${this.panelTemplate(active)}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  panelTemplate(category) {
    return `
      <div class="expertise-panel-inner">
        <p class="expertise-note">${category.note}</p>
        <ol class="technology-list">
          ${category.technologies.map((technology, index) => `
            <li><span>${String(index + 1).padStart(2, '0')}</span><strong>${technology}</strong></li>
          `).join('')}
        </ol>
      </div>
    `;
  }

  getActiveCategory() {
    return EXPERTISE_DATA.find((category) => category.id === this.activeId) || EXPERTISE_DATA[0];
  }

  bindEvents() {
    const buttons = [...this.querySelectorAll('[data-expertise-id]')];
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => this.selectCategory(button.dataset.expertiseId));
      button.addEventListener('keydown', (event) => {
        let nextIndex = null;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = buttons.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        buttons[nextIndex].focus();
        this.selectCategory(buttons[nextIndex].dataset.expertiseId);
      });
    });
  }

  selectCategory(id) {
    if (!id || id === this.activeId) return;

    const panel = this.querySelector('.expertise-panel');
    const nextCategory = EXPERTISE_DATA.find((category) => category.id === id);
    if (!panel || !nextCategory) return;

    window.clearTimeout(this.switchTimer);
    panel.classList.add('is-switching');

    this.querySelectorAll('[data-expertise-id]').forEach((button) => {
      const isActive = button.dataset.expertiseId === id;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
      button.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    this.switchTimer = window.setTimeout(() => {
      this.activeId = id;
      panel.innerHTML = this.panelTemplate(nextCategory);
      panel.setAttribute('aria-labelledby', `tab-${id}`);
      requestAnimationFrame(() => panel.classList.remove('is-switching'));
    }, 420);
  }
}

customElements.define('expertise-section', ExpertiseSection);
