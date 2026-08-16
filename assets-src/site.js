(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem("de101-theme", theme); } catch (_) {}
  };

  themeButton?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  const progress = document.querySelector(".reading-progress span");
  if (progress && document.body.classList.contains("reading-page")) {
    const updateProgress = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const value = distance > 0 ? Math.min(1, window.scrollY / distance) : 0;
      progress.style.transform = `scaleX(${value})`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  const search = document.querySelector("#work-search");
  const cards = [...document.querySelectorAll(".work-card")];
  const filters = [...document.querySelectorAll("[data-filter]")];
  const count = document.querySelector("#result-count");
  const empty = document.querySelector(".empty-state");
  let activeYear = "all";

  const filterWorks = () => {
    if (!cards.length) return;
    const query = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const yearMatches = activeYear === "all" || card.dataset.year === activeYear;
      const searchMatches = !query || (card.dataset.search || "").includes(query);
      const show = yearMatches && searchMatches;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} 篇`;
    if (empty) empty.hidden = visible !== 0;
  };

  search?.addEventListener("input", filterWorks);
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeYear = button.dataset.filter || "all";
      filters.forEach((item) => item.classList.toggle("active", item === button));
      filterWorks();
    });
  });
})();
