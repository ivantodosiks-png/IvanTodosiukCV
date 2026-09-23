const expertiseData = {
  frontend: {
    note: "Strong HTML and CSS fundamentals with practical experience building modern interfaces.",
    technologies: [
      { name: "HTML", icon: "images/tech/html5.svg" },
      { name: "CSS", icon: "images/tech/css3.svg" },
      { name: "JavaScript", icon: "images/tech/javascript.svg" },
      { name: "TypeScript", icon: "images/tech/typescript.svg" },
      { name: "React", icon: "images/tech/react.svg" },
      { name: "Next.js", icon: "images/tech/nextjs.svg" },
      { name: "Tailwind CSS", icon: "images/tech/tailwindcss.svg" }
    ]
  },
  backend: {
    note: "Experience with server-side JavaScript and a growing Python backend toolkit.",
    technologies: [
      { name: "Node.js", icon: "images/tech/nodejs.svg" },
      { name: "Python", icon: "images/tech/python.svg" },
      { name: "FastAPI", icon: "images/tech/fastapi.svg" }
    ]
  },
  databases: {
    note: "Relational database experience with tables, relationships and essential SQL queries.",
    technologies: [
      { name: "PostgreSQL", icon: "images/tech/postgresql.svg" },
      { name: "Neon Database", icon: "images/tech/neon.svg" },
      { name: "Supabase", icon: "images/tech/supabase.svg" },
      { name: "SQL structure", icon: "images/tech/database.svg" }
    ]
  },
  tools: {
    note: "The development tools I use for everyday building, version control and collaboration.",
    technologies: [
      { name: "Git", icon: "images/tech/git.svg" },
      { name: "GitHub", icon: "images/tech/github.svg" },
      { name: "Docker", icon: "images/tech/docker.svg" },
      { name: "VS Code", icon: "images/tech/vscode.svg" },
      { name: "npm", icon: "images/tech/npm.svg" }
    ]
  },
  deployment: {
    note: "Confident deployment to Vercel with additional hosting and infrastructure experience.",
    technologies: [
      { name: "Vercel", icon: "images/tech/vercel.svg" },
      { name: "Cloudflare", icon: "images/tech/cloudflare.svg" },
      { name: "GitHub deployment", icon: "images/tech/github.svg" },
      { name: "Server deployment", icon: "images/tech/server.svg" }
    ]
  },
  linux: {
    note: "Comfortable with Linux environments, core commands, files and basic server workflows.",
    technologies: [
      { name: "Linux", icon: "images/tech/linux.svg" },
      { name: "Bash", icon: "images/tech/bash.svg" },
      { name: "Server basics", icon: "images/tech/server.svg" },
      { name: "Files & environments", icon: "images/tech/server.svg" }
    ]
  },
  security: {
    note: "Foundational web security knowledge and practical experience analysing web applications.",
    technologies: [
      { name: "Web security", icon: "images/tech/shield.svg" },
      { name: "XSS", icon: "images/tech/shield.svg" },
      { name: "SQL Injection", icon: "images/tech/database.svg" },
      { name: "Burp Suite", icon: "images/tech/burpsuite.svg" },
      { name: "Vulnerability analysis", icon: "images/tech/shield.svg" },
      { name: "Spoofing basics", icon: "images/tech/shield.svg" }
    ]
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

  createTechnologyItem(technology) {
    const item = document.createElement("li");
    const icon = document.createElement("img");
    const label = document.createElement("span");
    icon.src = technology.icon;
    icon.alt = "";
    icon.loading = "lazy";
    icon.decoding = "async";
    label.textContent = technology.name;
    item.append(icon, label);
    return item;
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
    this.list.replaceChildren(...content.technologies.map((technology) => this.createTechnologyItem(technology)));
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
