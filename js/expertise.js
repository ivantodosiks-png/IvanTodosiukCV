const expertiseData = {
  backend: {
    note: "Server-side foundations and connected application experiences.",
    technologies: ["Node.js", "Python", "REST API", "WebSockets"]
  },
  frontend: {
    note: "Responsive interfaces with clear structure and considered interaction.",
    technologies: ["HTML", "CSS", "JavaScript", "React"]
  },
  linux: {
    note: "Reliable environments, deployment fundamentals and system workflows.",
    technologies: ["Ubuntu", "Bash", "Nginx", "Docker"]
  },
  databases: {
    note: "Structured data storage for dependable, scalable applications.",
    technologies: ["PostgreSQL", "MySQL", "Redis"]
  }
};

class ExpertiseSwitcher {
  constructor(element) {
    this.element = element;
    this.tabs = [...element.querySelectorAll("[data-expertise]")];
    this.panel = element.querySelector(".expertise-panel");
    this.note = element.querySelector("[data-expertise-note]");
    this.list = element.querySelector("[data-technology-list]");
    this.bindEvents();
  }

  select(tab) {
    const content = expertiseData[tab.dataset.expertise];
    if (!content || tab.classList.contains("is-active")) return;

    this.tabs.forEach((item) => {
      const isSelected = item === tab;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
      item.setAttribute("tabindex", isSelected ? "0" : "-1");
    });

    this.panel.setAttribute("aria-labelledby", tab.id);
    this.panel.classList.remove("is-changing");
    void this.panel.offsetWidth;
    this.note.textContent = content.note;
    this.list.replaceChildren(...content.technologies.map((technology) => {
      const item = document.createElement("li");
      item.textContent = technology;
      return item;
    }));
    this.panel.classList.add("is-changing");
  }

  bindEvents() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => this.select(tab));
      tab.addEventListener("keydown", (event) => {
        const forwardKeys = ["ArrowDown", "ArrowRight"];
        const backwardKeys = ["ArrowUp", "ArrowLeft"];
        if (![...forwardKeys, ...backwardKeys, "Home", "End"].includes(event.key)) return;

        event.preventDefault();
        let nextIndex = index;
        if (forwardKeys.includes(event.key)) nextIndex = (index + 1) % this.tabs.length;
        if (backwardKeys.includes(event.key)) nextIndex = (index - 1 + this.tabs.length) % this.tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = this.tabs.length - 1;
        this.tabs[nextIndex].focus();
        this.select(this.tabs[nextIndex]);
      });
    });
  }
}

document.querySelectorAll("[data-expertise-switcher]").forEach((element) => new ExpertiseSwitcher(element));
