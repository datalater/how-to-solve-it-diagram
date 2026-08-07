(() => {
  const STORAGE_KEY = "how-to-solve-it:answers:v1";
  const VIEW_KEY = "how-to-solve-it:view:v1";
  const STEP_COUNT = 4;

  const worksheet = document.getElementById("worksheet");
  const form = document.getElementById("solve-form");
  const stepNav = document.querySelector("[data-step-nav]");
  const steps = [...document.querySelectorAll("[data-step]")];
  const navButtons = [...document.querySelectorAll("[data-go-step]")];
  const viewButtons = [...document.querySelectorAll("[data-view]")];
  const prevBtn = document.querySelector("[data-prev]");
  const nextBtn = document.querySelector("[data-next]");
  const clearBtn = document.querySelector("[data-clear]");
  const printBtn = document.querySelector("[data-print-button]");
  const topBtn = document.querySelector("[data-top-button]");
  const saveStatus = document.querySelector("[data-save-status]");
  const textareas = [...document.querySelectorAll("[data-answer]")];

  let currentStep = 0;
  let viewMode = "step";
  let saveTimer = 0;
  let sectionObserver = null;

  function loadAnswers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      textareas.forEach((el) => {
        if (typeof data[el.name] === "string") {
          el.value = data[el.name];
        }
      });
    } catch {
      // ignore corrupt storage
    }
  }

  function loadViewMode() {
    const saved = localStorage.getItem(VIEW_KEY);
    return saved === "all" ? "all" : "step";
  }

  function collectAnswers() {
    return textareas.reduce((acc, el) => {
      acc[el.name] = el.value;
      return acc;
    }, {});
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectAnswers()));
    if (saveStatus) {
      const time = new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      saveStatus.textContent = `저장됨 · ${time}`;
    }
  }

  function schedulePersist() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persist, 200);
  }

  function updateStepNav(activeIndex = currentStep) {
    navButtons.forEach((btn) => {
      const stepIndex = Number(btn.dataset.goStep);
      const active = stepIndex === activeIndex;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-current", active ? "step" : "false");
    });
  }

  function getStickyOffset() {
    return (stepNav?.offsetHeight || 0) + 12;
  }

  function scrollToStep(index) {
    const target = document.getElementById(`step-${index}`);
    if (!target) return;
    const top =
      window.scrollY + target.getBoundingClientRect().top - getStickyOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function syncStuckState() {
    if (!stepNav) return;
    const stuck = stepNav.getBoundingClientRect().top <= 0.5;
    stepNav.classList.toggle("is-stuck", stuck);
  }

  function teardownSectionObserver() {
    sectionObserver?.disconnect();
    sectionObserver = null;
  }

  function setupSectionObserver() {
    teardownSectionObserver();
    if (viewMode !== "all" || !("IntersectionObserver" in window)) return;

    sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );
        if (!visible.length) return;
        const index = Number(visible[0].target.dataset.step);
        if (!Number.isNaN(index)) {
          currentStep = index;
          updateStepNav(index);
        }
      },
      {
        rootMargin: `-${getStickyOffset()}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    steps.forEach((step) => sectionObserver.observe(step));
  }

  function showStep(index, { focus = true } = {}) {
    currentStep = Math.max(0, Math.min(STEP_COUNT - 1, index));

    steps.forEach((step) => {
      const stepIndex = Number(step.dataset.step);
      const active = stepIndex === currentStep;
      step.hidden = !active;
      step.classList.toggle("is-active", active);
    });

    updateStepNav();

    if (prevBtn) prevBtn.disabled = currentStep === 0;
    if (nextBtn) {
      nextBtn.textContent = currentStep === STEP_COUNT - 1 ? "처음으로" : "다음";
    }

    if (focus) {
      const firstField = steps[currentStep]?.querySelector("textarea");
      firstField?.focus({ preventScroll: true });
    }
  }

  function showAll() {
    steps.forEach((step) => {
      step.hidden = false;
      step.classList.add("is-active");
    });
    updateStepNav();
  }

  function applyView(mode, { persistPreference = true } = {}) {
    viewMode = mode === "all" ? "all" : "step";
    worksheet?.setAttribute("data-view", viewMode);

    viewButtons.forEach((btn) => {
      const active = btn.dataset.view === viewMode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    if (viewMode === "all") {
      showAll();
      setupSectionObserver();
    } else {
      teardownSectionObserver();
      showStep(currentStep, { focus: false });
    }

    if (persistPreference) {
      localStorage.setItem(VIEW_KEY, viewMode);
    }
  }

  function goToStep(index) {
    currentStep = Math.max(0, Math.min(STEP_COUNT - 1, index));
    updateStepNav(currentStep);

    if (viewMode === "all") {
      scrollToStep(currentStep);
      return;
    }

    showStep(currentStep);
    scrollToStep(currentStep);
  }

  function preparePrint() {
    steps.forEach((step) => {
      step.hidden = false;
      step.classList.add("is-active");
    });
  }

  function restoreAfterPrint() {
    applyView(viewMode, { persistPreference: false });
  }

  form?.addEventListener("input", schedulePersist);
  form?.addEventListener("submit", (event) => event.preventDefault());

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyView(btn.dataset.view);
    });
  });

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      goToStep(Number(btn.dataset.goStep));
    });
  });

  prevBtn?.addEventListener("click", () => showStep(currentStep - 1));
  nextBtn?.addEventListener("click", () => {
    if (currentStep === STEP_COUNT - 1) {
      showStep(0);
      return;
    }
    showStep(currentStep + 1);
  });

  clearBtn?.addEventListener("click", () => {
    const hasContent = textareas.some((el) => el.value.trim());
    if (hasContent && !window.confirm("작성한 내용을 모두 지울까요?")) {
      return;
    }
    textareas.forEach((el) => {
      el.value = "";
    });
    localStorage.removeItem(STORAGE_KEY);
    if (saveStatus) saveStatus.textContent = "초기화됨";
    currentStep = 0;
    applyView(viewMode, { persistPreference: false });
  });

  topBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  printBtn?.addEventListener("click", () => {
    persist();
    preparePrint();
    window.print();
  });


  window.addEventListener("beforeprint", preparePrint);
  window.addEventListener("afterprint", restoreAfterPrint);
  window.addEventListener("scroll", syncStuckState, { passive: true });
  window.addEventListener("resize", () => {
    syncStuckState();
    if (viewMode === "all") setupSectionObserver();
  });

  loadAnswers();
  applyView(loadViewMode(), { persistPreference: false });
  syncStuckState();
})();
