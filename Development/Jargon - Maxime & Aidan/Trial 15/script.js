const { animate, stagger } = window.Motion;

const {
  rows,
  reels,
  paylines,
  symbols,
  states,
  startingTokens,
  defaultSpinCost,
  minSpinCost,
  maxSpinCost,
  autoSpinRange,
  createSpinGrid,
  payoutMultiplier,
  randomInt,
  complianceReminder,
} = window.SLOT_CONFIG;

const reelBoard = document.getElementById("reelBoard");
const reelStage = document.getElementById("reelStage");
const glowRing = reelStage?.querySelector(".glow-ring");
const rootElement = document.documentElement;
const ambientSparkles = document.getElementById("ambientSparkles");
const sparkleField = document.getElementById("sparkleField");
const fxLayer = document.getElementById("fxLayer");
const coinRain = document.getElementById("coinRain");
const tokenCount = document.getElementById("tokenCount");
const spinCostDisplay = document.getElementById("spinCostDisplay");
const queueCount = document.getElementById("queueCount");
const lastAward = document.getElementById("lastAward");
const lastAwardCard = document.getElementById("lastAwardCard");
const locationStatus = document.getElementById("locationStatus");
const costSlider = document.getElementById("costSlider");
const costSliderValue = document.getElementById("costSliderValue");
const autoSpinSlider = document.getElementById("autoSpinSlider");
const autoSpinValue = document.getElementById("autoSpinValue");
const autoSpinStatus = document.getElementById("autoSpinStatus");
const spinButton = document.getElementById("spinButton");
const autoSpinButton = document.getElementById("autoSpinButton");
const stopAutoSpinButton = document.getElementById("stopAutoSpinButton");
const resetButton = document.getElementById("resetButton");
const message = document.getElementById("message");
const winMeta = document.getElementById("winMeta");
const breakdownList = document.getElementById("breakdownList");
const spinHistoryList = document.getElementById("spinHistoryList");
const privacyModal = document.getElementById("privacyModal");
const privacyCard = privacyModal?.querySelector(".privacy-card");
const privacyCheckbox = document.getElementById("privacyCheckbox");
const termsCheckbox = document.getElementById("termsCheckbox");
const privacyAcceptButton = document.getElementById("privacyAcceptButton");
const locationButton = document.getElementById("locationButton");
const locationFeedback = document.getElementById("locationFeedback");
const stateSelect = document.getElementById("stateSelect");
const themeToggle = document.getElementById("themeToggle");

const consentStorageKey = "prompt-drop-consent-v1";
const themeStorageKey = "prompt-drop-theme-v1";
const lineAccentPalette = [
  "var(--line-accent-1)",
  "var(--line-accent-2)",
  "var(--line-accent-3)",
  "var(--line-accent-4)",
  "var(--line-accent-5)",
  "var(--line-accent-6)",
];
const celebrationPalette = [
  "var(--celebration-accent-1)",
  "var(--celebration-accent-2)",
  "var(--celebration-accent-3)",
  "var(--celebration-accent-4)",
];
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileViewportQuery = window.matchMedia("(max-width: 760px)");
const numericAnimations = new WeakMap();
const displayValues = new WeakMap();
const pulseAnimations = new Map();
const bounceAnimations = new Map();
const transientAnimations = new WeakMap();
let buttonStyleCache = new WeakMap();

const state = {
  tokens: startingTokens,
  spinCost: defaultSpinCost,
  lastAward: 0,
  spinning: false,
  visibleGrid: [],
  reelElements: [],
  tileElements: [],
  activeCelebrationTimer: null,
  autoSpin: {
    active: false,
    remaining: autoSpinRange.defaultValue,
    stopRequested: false,
    cost: defaultSpinCost,
  },
  spinHistory: [],
  consent: {
    accepted: false,
    locationMode: "none",
    locationLabel: "Pending",
    coords: null,
    stateCode: "",
  },
};

function formatNumber(value) {
  return value.toLocaleString();
}

function clampNumber(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function isMobileViewport() {
  return mobileViewportQuery.matches;
}

function readStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return storedTheme === "dark" ? "dark" : "light";
  } catch (error) {
    return "light";
  }
}

function persistTheme(theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    return;
  }
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";

  rootElement.dataset.theme = nextTheme;
  buttonStyleCache = new WeakMap();

  if (themeToggle) {
    const nextLabel = nextTheme === "dark" ? "Light Mode" : "Dark Mode";
    themeToggle.textContent = nextLabel;
    themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
    themeToggle.setAttribute("aria-label", `Switch to ${nextLabel.toLowerCase()}`);
  }
}

function toggleTheme() {
  const nextTheme = rootElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  persistTheme(nextTheme);
}

function initializeTheme() {
  applyTheme(readStoredTheme());
}

function themedRgba(variableName, alpha) {
  const rgbValue = window.getComputedStyle(rootElement).getPropertyValue(variableName).trim();
  return `rgba(${rgbValue}, ${alpha})`;
}

function stopAnimationControls(controls) {
  if (!controls) {
    return;
  }

  if (Array.isArray(controls)) {
    controls.forEach(stopAnimationControls);
    return;
  }

  if (typeof controls.stop === "function") {
    controls.stop();
  }
}

function clearMotionStyles(element, properties = ["transform", "filter", "opacity", "box-shadow"]) {
  if (!element) {
    return;
  }

  properties.forEach((property) => {
    element.style.removeProperty(property);
  });
}

function stopTransientAnimation(element, clearProperties) {
  stopAnimationControls(transientAnimations.get(element));
  transientAnimations.delete(element);

  if (clearProperties) {
    clearMotionStyles(element, clearProperties);
  }
}

function setTransientAnimation(element, controls, clearProperties) {
  stopTransientAnimation(element, clearProperties);
  transientAnimations.set(element, controls);
}

function parseDisplayedNumber(element) {
  const raw = element?.textContent?.replace(/[^\d.-]/g, "") || "0";
  const parsed = Number.parseFloat(raw);

  return Number.isFinite(parsed) ? parsed : 0;
}

function animateCount(element, targetValue, options = {}) {
  if (!element) {
    return;
  }

  stopAnimationControls(numericAnimations.get(element));
  numericAnimations.delete(element);

  const currentValue = displayValues.has(element)
    ? displayValues.get(element)
    : parseDisplayedNumber(element);

  displayValues.set(element, targetValue);

  if (prefersReducedMotion() || currentValue === targetValue) {
    element.textContent = (options.formatter || formatNumber)(targetValue);
    return;
  }

  const delta = Math.abs(targetValue - currentValue);
  const minDuration = options.minDuration ?? 0.45;
  const maxDuration = options.maxDuration ?? (isMobileViewport() ? 1.15 : 1.8);
  const duration = clampNumber(0.55 + delta / 800, minDuration, maxDuration);
  const controls = animate(currentValue, targetValue, {
    duration,
    ease: "easeOut",
    onUpdate: (latest) => {
      element.textContent = (options.formatter || formatNumber)(Math.round(latest));
    },
    onComplete: () => {
      element.textContent = (options.formatter || formatNumber)(targetValue);
    },
  });

  numericAnimations.set(element, controls);
}

function fadeInElement(element, options = {}) {
  if (!element || prefersReducedMotion()) {
    if (element) {
      clearMotionStyles(element, ["opacity", "transform"]);
    }
    return;
  }

  const controls = animate(
    element,
    { opacity: [0, 1], y: [20, 0] },
    {
      duration: options.duration ?? 0.5,
      delay: options.delay ?? 0,
      ease: "easeOut",
    },
  );

  setTransientAnimation(element, controls, ["opacity", "transform"]);
}

function fadeInElements(elements, options = {}) {
  const visibleElements = Array.from(elements).filter(Boolean);

  if (!visibleElements.length || prefersReducedMotion()) {
    visibleElements.forEach((element) => clearMotionStyles(element, ["opacity", "transform"]));
    return;
  }

  const delayFor = stagger(options.staggerStep ?? 0.08, {
    startDelay: options.startDelay ?? 0,
  });

  visibleElements.forEach((element, index) => {
    fadeInElement(element, {
      duration: options.duration ?? 0.5,
      delay: delayFor(index, visibleElements.length),
    });
  });
}

function setMessage(text) {
  message.textContent = text;
  fadeInElement(message, { duration: 0.5 });
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function currentAutoSpinSelection() {
  return clampNumber(
    Number.parseInt(autoSpinSlider.value, 10) || autoSpinRange.defaultValue,
    autoSpinRange.min,
    autoSpinRange.max,
  );
}

function updateHud() {
  animateCount(tokenCount, state.tokens);
  animateCount(spinCostDisplay, state.spinCost, {
    minDuration: 0.35,
    maxDuration: 0.7,
  });
  animateCount(
    queueCount,
    state.autoSpin.active ? state.autoSpin.remaining : currentAutoSpinSelection(),
    {
      minDuration: 0.35,
      maxDuration: 0.7,
    },
  );
  animateCount(lastAward, state.lastAward, {
    minDuration: 0.45,
    maxDuration: 1.3,
  });
  locationStatus.textContent = state.consent.locationLabel;
}

function updateSliderLabels() {
  animateCount(costSliderValue, state.spinCost, {
    minDuration: 0.3,
    maxDuration: 0.6,
  });
  animateCount(autoSpinValue, currentAutoSpinSelection(), {
    minDuration: 0.3,
    maxDuration: 0.6,
  });
}

function updateAutoSpinStatus(text) {
  if (text) {
    autoSpinStatus.textContent = text;
    fadeInElement(autoSpinStatus, { duration: 0.4 });
    return;
  }

  if (!state.autoSpin.active) {
    autoSpinStatus.textContent = "Auto-play idle.";
    fadeInElement(autoSpinStatus, { duration: 0.4 });
    return;
  }

  autoSpinStatus.textContent = `${state.autoSpin.remaining} auto-play spin${state.autoSpin.remaining === 1 ? "" : "s"} remaining at ${formatNumber(state.autoSpin.cost)} credits each.`;
  fadeInElement(autoSpinStatus, { duration: 0.4 });
}

function readButtonShadows(button) {
  if (buttonStyleCache.has(button)) {
    return buttonStyleCache.get(button);
  }

  const styles = window.getComputedStyle(button);
  const values = {
    baseShadow: styles.getPropertyValue("--button-shadow-base").trim() || styles.boxShadow,
    hoverShadow: styles.getPropertyValue("--button-shadow-hover").trim() || styles.boxShadow,
  };

  buttonStyleCache.set(button, values);
  return values;
}

function stopPulse(element, resetStyles = true) {
  const controls = pulseAnimations.get(element);

  if (!controls) {
    return;
  }

  stopAnimationControls(controls);
  pulseAnimations.delete(element);

  if (resetStyles) {
    clearMotionStyles(element, ["transform", "box-shadow", "filter"]);
  }
}

function startPulse(element, keyframes, options = {}) {
  if (!element || prefersReducedMotion()) {
    return;
  }

  stopPulse(element, false);

  const controls = animate(element, keyframes, {
    duration: options.duration ?? 1.2,
    ease: "easeInOut",
    repeat: Infinity,
    delay: options.delay ?? 0,
  });

  pulseAnimations.set(element, controls);
}

function stopBounce(element, resetStyles = true) {
  const controls = bounceAnimations.get(element);

  if (!controls) {
    return;
  }

  stopAnimationControls(controls);
  bounceAnimations.delete(element);

  if (resetStyles) {
    clearMotionStyles(element, ["transform"]);
  }
}

function startBounce(element, index = 0, options = {}) {
  if (!element || prefersReducedMotion()) {
    return;
  }

  stopBounce(element, false);

  const controls = animate(
    element,
    { y: [0, -(options.distance ?? (isMobileViewport() ? 18 : 30)), 0] },
    {
      duration: options.duration ?? 1,
      ease: "easeInOut",
      repeat: Infinity,
      delay: (options.delayStep ?? 0.2) * index,
    },
  );

  bounceAnimations.set(element, controls);
}

function shouldPulseButton(button) {
  return button === spinButton && button.classList.contains("is-ready") && !button.disabled;
}

function resumeButtonMotion(button) {
  if (shouldPulseButton(button)) {
    const { baseShadow, hoverShadow } = readButtonShadows(button);
    startPulse(
      button,
      {
        scale: [1, 1.06, 1],
        boxShadow: [baseShadow, hoverShadow, baseShadow],
        filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
      },
      { duration: 1.15 },
    );
    return;
  }

  stopPulse(button);
}

function animateButtonState(button, keyframes) {
  if (prefersReducedMotion()) {
    return;
  }

  stopTransientAnimation(button, ["transform", "box-shadow"]);
  const controls = animate(button, keyframes, {
    duration: 0.3,
    ease: "easeInOut",
  });

  setTransientAnimation(button, controls, ["transform", "box-shadow"]);
}

function setupAnimatedButtons() {
  const interactiveButtons = document.querySelectorAll("button, .button-link");

  interactiveButtons.forEach((button) => {
    readButtonShadows(button);

    button.addEventListener("pointerenter", () => {
      if (button.disabled || prefersReducedMotion()) {
        return;
      }

      stopPulse(button);
      const { hoverShadow } = readButtonShadows(button);
      animateButtonState(button, {
        scale: 1.05,
        boxShadow: hoverShadow,
      });
    });

    button.addEventListener("pointerleave", () => {
      if (prefersReducedMotion()) {
        return;
      }

      const { baseShadow } = readButtonShadows(button);
      animateButtonState(button, {
        scale: 1,
        boxShadow: baseShadow,
      });
      window.setTimeout(() => {
        resumeButtonMotion(button);
      }, 220);
    });

    button.addEventListener("pointerdown", () => {
      if (button.disabled || prefersReducedMotion()) {
        return;
      }

      stopPulse(button);
      animateButtonState(button, { scale: 0.95 });
    });

    const releasePointer = () => {
      if (prefersReducedMotion()) {
        return;
      }

      const hovered = button.matches(":hover");
      const { baseShadow, hoverShadow } = readButtonShadows(button);
      animateButtonState(button, {
        scale: hovered ? 1.05 : 1,
        boxShadow: hovered ? hoverShadow : baseShadow,
      });
      window.setTimeout(() => {
        resumeButtonMotion(button);
      }, 220);
    };

    button.addEventListener("pointerup", releasePointer);
    button.addEventListener("pointercancel", releasePointer);
  });
}

function updateControlStates() {
  const locked = state.spinning || state.autoSpin.active || !state.consent.accepted;
  const readyToSpin = !locked && state.tokens >= state.spinCost;

  spinButton.disabled = locked;
  autoSpinButton.disabled = locked;
  resetButton.disabled = state.spinning || state.autoSpin.active;
  stopAutoSpinButton.disabled = !state.autoSpin.active;
  costSlider.disabled = locked;
  autoSpinSlider.disabled = locked;
  spinButton.classList.toggle("is-ready", readyToSpin);
  resumeButtonMotion(spinButton);
}

function clearWinSpotlight() {
  lastAwardCard.classList.remove("is-winning", "is-jackpot");
  stopPulse(lastAwardCard);
  stopPulse(glowRing);
}

function applyWinSpotlight(paidWin) {
  clearWinSpotlight();

  if (!paidWin) {
    return;
  }

  lastAwardCard.classList.add("is-winning");

  if (paidWin.multiplier >= 30) {
    lastAwardCard.classList.add("is-jackpot");
  }
}

function seedAmbientSparkles() {
  if (!ambientSparkles) {
    return;
  }

  ambientSparkles.textContent = "";
  const sparkleCount = window.innerWidth <= 760 ? 20 : 34;

  for (let index = 0; index < sparkleCount; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "ambient-sparkle";
    sparkle.style.setProperty("--spark-x", `${randomInt(100)}%`);
    sparkle.style.setProperty("--spark-y", `${randomInt(100)}%`);
    sparkle.style.setProperty("--spark-size", `${0.2 + randomInt(8) * 0.06}rem`);
    sparkle.style.setProperty("--spark-duration", `${4.6 + randomInt(18) * 0.35}s`);
    sparkle.style.setProperty("--spark-delay", `${randomInt(18) * 0.3}s`);
    ambientSparkles.append(sparkle);
  }
}

function createParticle(element, options) {
  const particle = document.createElement("span");
  const spreadX = (Math.random() - 0.5) * options.spread;
  const spreadY = (Math.random() - 0.5) * options.spread - options.lift;

  particle.className = "fx-particle";
  particle.style.setProperty("--burst-x", `${options.centerX}px`);
  particle.style.setProperty("--burst-y", `${options.centerY}px`);
  particle.style.setProperty("--particle-x", `${spreadX}px`);
  particle.style.setProperty("--particle-y", `${spreadY}px`);
  particle.style.setProperty("--particle-size", `${options.minSize + Math.random() * (options.maxSize - options.minSize)}rem`);
  particle.style.setProperty("--particle-duration", `${options.minDuration + Math.random() * (options.maxDuration - options.minDuration)}ms`);
  particle.style.setProperty("--particle-rotate", `${randomInt(240) - 120}deg`);
  particle.style.setProperty(
    "--particle-color",
    options.palette[randomInt(options.palette.length)],
  );
  element.append(particle);
  particle.addEventListener("animationend", () => {
    particle.remove();
  }, { once: true });
}

function emitParticleBurst(target, overrides = {}) {
  if (!fxLayer || !target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const options = {
    count: overrides.count ?? 16,
    spread: overrides.spread ?? 160,
    lift: overrides.lift ?? 40,
    minSize: overrides.minSize ?? 0.28,
    maxSize: overrides.maxSize ?? 0.75,
    minDuration: overrides.minDuration ?? 640,
    maxDuration: overrides.maxDuration ?? 1080,
    palette: overrides.palette ?? lineAccentPalette,
    centerX: overrides.centerX ?? rect.left + rect.width / 2,
    centerY: overrides.centerY ?? rect.top + rect.height / 2,
  };

  for (let index = 0; index < options.count; index += 1) {
    createParticle(fxLayer, options);
  }
}

function attachBurstToControl(control, options = {}) {
  control.addEventListener("click", () => {
    if ("disabled" in control && control.disabled) {
      return;
    }

    emitParticleBurst(control, options);
  });
}

function buildBoard() {
  reelBoard.textContent = "";
  state.reelElements = [];
  state.tileElements = [];

  for (let col = 0; col < reels; col += 1) {
    const column = document.createElement("div");
    column.className = "reel-column";
    column.setAttribute("aria-label", `Reel ${col + 1}`);

    const tileColumn = [];

    for (let row = 0; row < rows; row += 1) {
      const tile = document.createElement("div");
      tile.className = "symbol-tile";
      tile.innerHTML =
        '<span class="tile-icon"></span><span class="tile-label"></span><span class="tile-flavor"></span>';
      column.append(tile);
      tileColumn.push(tile);
    }

    reelBoard.append(column);
    state.reelElements.push(column);
    state.tileElements.push(tileColumn);
  }
}

function renderTile(tile, symbol) {
  tile.dataset.symbol = symbol.key;
  tile.querySelector(".tile-icon").textContent = symbol.icon;
  tile.querySelector(".tile-label").textContent = symbol.label;
  tile.querySelector(".tile-flavor").textContent = symbol.name;
  tile.setAttribute("aria-label", symbol.name);
}

function renderGrid(grid) {
  for (let col = 0; col < reels; col += 1) {
    for (let row = 0; row < rows; row += 1) {
      renderTile(state.tileElements[col][row], grid[col][row]);
    }
  }
}

function clearHighlights() {
  state.tileElements.flat().forEach((tile) => {
    tile.classList.remove("is-paid", "is-candidate");
    stopPulse(tile.querySelector(".tile-icon"));
    stopBounce(tile.querySelector(".tile-icon"));
  });
}

function applyHighlights(paidWin, candidates) {
  clearHighlights();

  candidates.forEach((candidate) => {
    candidate.positions.forEach(({ col, row }) => {
      state.tileElements[col][row].classList.add("is-candidate");
    });
  });

  if (!paidWin) {
    return;
  }

  paidWin.positions.forEach(({ col, row }) => {
    const tile = state.tileElements[col][row];
    tile.classList.add("is-paid");
  });
}

function createRandomColumn() {
  return Array.from({ length: rows }, () => symbols[randomInt(symbols.length)]);
}

function evaluateLine(line, grid, spinCost) {
  const symbolsOnLine = line.cells.map(({ col, row }) => grid[col][row]);
  let best = null;
  let cursor = 0;

  while (cursor < symbolsOnLine.length) {
    let next = cursor + 1;

    while (
      next < symbolsOnLine.length &&
      symbolsOnLine[next].key === symbolsOnLine[cursor].key
    ) {
      next += 1;
    }

    const matchCount = next - cursor;

    if (matchCount >= 3) {
      const symbol = symbolsOnLine[cursor];
      const multiplier = payoutMultiplier(symbol.key, matchCount);

      if (multiplier > 0) {
        const candidate = {
          line,
          symbol,
          matchCount,
          multiplier,
          award: multiplier * spinCost,
          positions: line.cells.slice(cursor, next),
        };

        if (
          !best ||
          candidate.award > best.award ||
          (candidate.award === best.award && candidate.matchCount > best.matchCount)
        ) {
          best = candidate;
        }
      }
    }

    cursor = next;
  }

  return best;
}

function compareWins(left, right) {
  if (right.award !== left.award) {
    return right.award - left.award;
  }

  if (right.matchCount !== left.matchCount) {
    return right.matchCount - left.matchCount;
  }

  return paylines.findIndex((line) => line.id === left.line.id) -
    paylines.findIndex((line) => line.id === right.line.id);
}

function evaluateGrid(grid, spinCost) {
  const candidates = paylines
    .map((line) => evaluateLine(line, grid, spinCost))
    .filter(Boolean)
    .sort(compareWins);

  return {
    paidWin: candidates[0] || null,
    candidates,
  };
}

function animateBreakdownEntrance() {
  fadeInElements(breakdownList.children, {
    duration: 0.45,
    staggerStep: 0.07,
  });
}

function renderPendingBreakdown() {
  breakdownList.textContent = "";

  const item = document.createElement("tr");
  const cell = document.createElement("td");
  cell.className = "empty-state";
  cell.colSpan = 3;
  cell.textContent = "Resolving reel outcome and evaluating qualifying paylines.";
  item.append(cell);
  breakdownList.append(item);
  winMeta.textContent = "Evaluating highest qualifying payline.";
  fadeInElement(winMeta, { duration: 0.4 });
  animateBreakdownEntrance();
}

function renderSpinHistory() {
  spinHistoryList.textContent = "";

  if (state.spinHistory.length === 0) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent = "No spins recorded yet.";
    spinHistoryList.append(item);
    fadeInElements(spinHistoryList.children, {
      duration: 0.4,
      staggerStep: 0.06,
    });
    return;
  }

  state.spinHistory.forEach((entry, index) => {
    const item = document.createElement("li");
    item.className = "history-item";
    item.innerHTML = `
      <div class="history-title">
        <span>Spin ${formatNumber(entry.spinNumber)}</span>
        <span class="history-badge">${index === 0 ? "Newest" : entry.outcomeLabel}</span>
      </div>
      <span class="history-copy">${entry.summary}</span>
    `;
    spinHistoryList.append(item);
  });

  fadeInElements(spinHistoryList.children, {
    duration: 0.42,
    staggerStep: 0.06,
  });
}

function renderIdleBreakdown() {
  breakdownList.textContent = "";

  const item = document.createElement("tr");
  const cell = document.createElement("td");
  cell.className = "empty-state";
  cell.colSpan = 3;
  cell.textContent = "No winning paylines have been recorded.";
  item.append(cell);
  breakdownList.append(item);
  winMeta.textContent = "Waiting for first completed spin.";
  fadeInElement(winMeta, { duration: 0.4 });
  animateBreakdownEntrance();
}

function renderBreakdown(paidWin, candidates) {
  breakdownList.textContent = "";

  if (!paidWin) {
    const item = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "empty-state";
    cell.colSpan = 3;
    cell.textContent =
      "No qualifying payline. The wager was deducted from the credit meter.";
    item.append(cell);
    breakdownList.append(item);
    winMeta.textContent = "No payline reached 3 matching symbols.";
    fadeInElement(winMeta, { duration: 0.4 });
    animateBreakdownEntrance();
    return;
  }

  const paidItem = document.createElement("tr");
  paidItem.className = "breakdown-item";
  paidItem.innerHTML = `
    <td class="paid-item breakdown-result">Paid</td>
    <td class="paid-item breakdown-detail">${paidWin.line.name}: ${paidWin.symbol.name} ${paidWin.matchCount} of a kind for ${paidWin.multiplier}x</td>
    <td class="paid-item breakdown-award">${formatNumber(paidWin.award)} credits</td>
  `;
  breakdownList.append(paidItem);

  candidates.slice(1).forEach((candidate) => {
    const item = document.createElement("tr");
    item.className = "breakdown-item";
    item.innerHTML = `
      <td class="shadow-item breakdown-result">Qualified</td>
      <td class="shadow-item breakdown-detail">${candidate.line.name}: ${candidate.symbol.name} ${candidate.matchCount} of a kind for ${candidate.multiplier}x</td>
      <td class="shadow-item breakdown-award">Not paid</td>
    `;
    breakdownList.append(item);
  });

  winMeta.textContent = `${paidWin.line.name} paid ${paidWin.multiplier}x. ${candidates.length - 1} additional qualifying payline${candidates.length === 2 ? "" : "s"} not paid.`;
  fadeInElement(winMeta, { duration: 0.4 });
  animateBreakdownEntrance();
}

function recordSpinHistory(paidWin) {
  const spinNumber = state.spinHistory.length > 0
    ? state.spinHistory[0].spinNumber + 1
    : 1;

  state.spinHistory.unshift(
    paidWin
      ? {
          spinNumber,
          outcomeLabel: "Win",
          summary: `${paidWin.line.name} paid ${formatNumber(paidWin.award)} credits on a ${paidWin.symbol.name} ${paidWin.matchCount}-match.`,
        }
      : {
          spinNumber,
          outcomeLabel: "No Win",
          summary: `No qualifying payline at ${formatNumber(state.spinCost)} credits.`,
        },
  );
  state.spinHistory = state.spinHistory.slice(0, 3);
  renderSpinHistory();
}

function stopCelebrationMotion() {
  Array.from(pulseAnimations.keys()).forEach((element) => {
    if (element !== spinButton) {
      stopPulse(element);
    }
  });

  Array.from(bounceAnimations.keys()).forEach((element) => {
    stopBounce(element);
  });
}

function clearCelebration() {
  reelStage.classList.remove("sparkling", "jackpot");
  coinRain.textContent = "";
  clearWinSpotlight();
  stopCelebrationMotion();

  if (state.activeCelebrationTimer) {
    window.clearTimeout(state.activeCelebrationTimer);
    state.activeCelebrationTimer = null;
  }
}

function createCoinRain(multiplier) {
  coinRain.textContent = "";

  const coinCount = Math.min(isMobileViewport() ? 38 : 72, 22 + multiplier * 2);

  for (let index = 0; index < coinCount; index += 1) {
    const coin = document.createElement("div");
    coin.className = "coin";
    coin.textContent = "TOK";
    coin.style.left = `${randomInt(96)}%`;
    coin.style.setProperty("--drift", `${randomInt(160) - 80}px`);
    coin.style.setProperty("--fall-duration", `${1.5 + randomInt(10) * 0.14}s`);
    coin.style.animationDelay = `${index * (isMobileViewport() ? 0.08 : 0.06)}s`;
    coinRain.append(coin);
  }
}

function animateCelebrationTargets(paidWin) {
  if (!paidWin || prefersReducedMotion()) {
    return;
  }

  const paidIcons = (paidWin.positions || [])
    .map(({ col, row }) => state.tileElements[col]?.[row]?.querySelector(".tile-icon"))
    .filter(Boolean);
  const awardBadge = breakdownList.querySelector(".paid-item .breakdown-award");
  const bounceTargets = [lastAward, tokenCount, awardBadge, ...paidIcons].filter(Boolean);
  const limitedBounceTargets = isMobileViewport()
    ? bounceTargets.slice(0, 3)
    : bounceTargets;

  limitedBounceTargets.forEach((element, index) => {
    startBounce(element, index, {
      distance: isMobileViewport() ? 18 : 30,
      delayStep: 0.2,
      duration: 1,
    });
  });

  paidIcons.slice(0, isMobileViewport() ? 2 : paidIcons.length).forEach((icon, index) => {
    startPulse(
      icon,
      {
        scale: [1, 1.08, 1],
        filter: [
          `drop-shadow(0 0 0 ${themedRgba("--win-glow-rgb", 0)})`,
          `drop-shadow(0 0 10px ${themedRgba("--win-glow-rgb", 0.38)})`,
          `drop-shadow(0 0 0 ${themedRgba("--win-glow-rgb", 0)})`,
        ],
      },
      {
        duration: 1.2,
        delay: index * 0.12,
      },
    );
  });

  if (activeSwatch) {
    startPulse(
      activeSwatch,
      {
        scale: [1, 1.14, 1],
        boxShadow: [
          `0 0 14px ${themedRgba("--win-glow-rgb", 0.2)}`,
          `0 0 28px ${themedRgba("--win-glow-rgb", 0.38)}`,
          `0 0 14px ${themedRgba("--win-glow-rgb", 0.2)}`,
        ],
      },
      { duration: 1.15 },
    );
  }
}

function triggerCelebration(paidWin) {
  clearCelebration();

  if (!paidWin) {
    return;
  }

  applyWinSpotlight(paidWin);
  animateCelebrationTargets(paidWin);

  if (paidWin.multiplier >= 12) {
    reelStage.classList.add("sparkling");
    startPulse(
      glowRing,
      {
        scale: [1, 1.015, 1],
        boxShadow: [
          `0 0 18px ${themedRgba("--win-glow-rgb", 0.08)}`,
          `0 0 34px ${themedRgba("--win-glow-rgb", 0.18)}`,
          `0 0 18px ${themedRgba("--win-glow-rgb", 0.08)}`,
        ],
      },
      { duration: 1.25 },
    );
  }

  if (paidWin.multiplier >= 16) {
    createCoinRain(paidWin.multiplier);
    startPulse(
      lastAwardCard,
      {
        scale: [1, 1.03, 1],
        boxShadow: [
          `0 0 0 1px ${themedRgba("--win-glow-rgb", 0.3)}, 0 0 26px ${themedRgba("--win-glow-rgb", 0.16)}`,
          `0 0 0 1px ${themedRgba("--win-glow-rgb", 0.46)}, 0 0 42px ${themedRgba("--win-glow-rgb", 0.28)}`,
          `0 0 0 1px ${themedRgba("--win-glow-rgb", 0.3)}, 0 0 26px ${themedRgba("--win-glow-rgb", 0.16)}`,
        ],
      },
      { duration: 1.2 },
    );
  }

  if (paidWin.multiplier >= 30) {
    reelStage.classList.add("jackpot");
    lastAwardCard.classList.add("is-jackpot");
  }

  if (paidWin.multiplier >= 12) {
    emitParticleBurst(reelStage, {
      count: paidWin.multiplier >= 30 ? 34 : 22,
      spread: paidWin.multiplier >= 30 ? 320 : 220,
      lift: paidWin.multiplier >= 30 ? 90 : 56,
      minSize: 0.26,
      maxSize: paidWin.multiplier >= 30 ? 0.92 : 0.72,
      palette: paidWin.multiplier >= 30
        ? [...celebrationPalette, "#FFFFFF"]
        : celebrationPalette.slice(0, 3),
    });
    emitParticleBurst(lastAwardCard, {
      count: paidWin.multiplier >= 30 ? 18 : 10,
      spread: 160,
      lift: 34,
      minSize: 0.24,
      maxSize: 0.58,
      palette: [celebrationPalette[0], celebrationPalette[1], "#FFFFFF"],
    });
  }

  if (paidWin.multiplier >= 12) {
    state.activeCelebrationTimer = window.setTimeout(() => {
      clearCelebration();
      updateControlStates();
    }, paidWin.multiplier >= 30 ? 5200 : 3800);
  }
}

function seedSparkles() {
  sparkleField.textContent = "";

  for (let index = 0; index < 22; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${randomInt(92)}%`;
    sparkle.style.top = `${randomInt(88)}%`;
    sparkle.style.animationDelay = `${index * 0.12}s`;
    sparkle.style.animationDuration = `${2 + randomInt(10) * 0.16}s`;
    sparkleField.append(sparkle);
  }
}

function seedBoard() {
  state.visibleGrid = createSpinGrid();
  renderGrid(state.visibleGrid);
}

async function animateColumn(colIndex, finalColumn) {
  const reelElement = state.reelElements[colIndex];
  const duration = prefersReducedMotion()
    ? 240
    : 700 + colIndex * 180;

  if (prefersReducedMotion()) {
    for (let row = 0; row < rows; row += 1) {
      renderTile(state.tileElements[colIndex][row], finalColumn[row]);
    }
    fadeInElements(state.tileElements[colIndex], {
      duration: 0.3,
      staggerStep: 0.04,
    });
    return;
  }

  reelElement.classList.add("spinning");
  const shuffler = window.setInterval(() => {
    const randomColumn = createRandomColumn();

    for (let row = 0; row < rows; row += 1) {
      renderTile(state.tileElements[colIndex][row], randomColumn[row]);
    }
  }, 90);

  await delay(duration);
  window.clearInterval(shuffler);
  reelElement.classList.remove("spinning");

  for (let row = 0; row < rows; row += 1) {
    renderTile(state.tileElements[colIndex][row], finalColumn[row]);
  }
}

async function spin() {
  if (state.spinning || !state.consent.accepted) {
    return { completed: false };
  }

  if (state.tokens < state.spinCost) {
    setMessage("Insufficient credits. Reload the credit meter to continue play.");
    return { completed: false };
  }

  state.spinning = true;
  updateControlStates();
  clearHighlights();
  clearCelebration();

  try {
    state.tokens -= state.spinCost;
    state.lastAward = 0;
    updateHud();
    renderPendingBreakdown();
    setMessage("Reels spinning. Resolving wager outcome...");

    const finalGrid = createSpinGrid();

    await Promise.all(
      finalGrid.map((column, colIndex) => animateColumn(colIndex, column)),
    );

    state.visibleGrid = finalGrid;

    const { paidWin, candidates } = evaluateGrid(finalGrid, state.spinCost);

    if (paidWin) {
      state.tokens += paidWin.award;
      state.lastAward = paidWin.award;
    }

    updateHud();
    renderBreakdown(paidWin, candidates);
    recordSpinHistory(paidWin);
    applyHighlights(paidWin, candidates);

    try {
      triggerCelebration(paidWin);
    } catch (error) {
      console.error("Celebration effect failed after spin resolution.", error);
    }

    if (!paidWin) {
      setMessage("No win. No qualifying paylines were awarded.");
    } else if (paidWin.multiplier >= 30) {
      setMessage(
        `Jackpot win: ${paidWin.line.name} paid ${paidWin.symbol.name} at ${paidWin.multiplier}x.`,
      );
    } else if (paidWin.multiplier >= 16) {
      setMessage(
        `Premium win: ${paidWin.symbol.name} on ${paidWin.line.name} paid ${formatNumber(paidWin.award)} credits.`,
      );
    } else {
      setMessage(
        `Win recorded: ${paidWin.line.name} paid ${formatNumber(paidWin.award)} credits.`,
      );
    }

    return { completed: true, paidWin };
  } finally {
    state.spinning = false;
    updateControlStates();
  }
}

async function runAutoSpin() {
  while (state.autoSpin.active && state.autoSpin.remaining > 0) {
    if (state.autoSpin.stopRequested) {
      break;
    }

    const result = await spin();

    if (!result.completed) {
      break;
    }

    state.autoSpin.remaining -= 1;
    updateHud();

    if (state.autoSpin.remaining > 0 && !state.autoSpin.stopRequested) {
      updateAutoSpinStatus();
      await delay(280);
    }
  }

  const stoppedByUser = state.autoSpin.stopRequested;
  const spinsLeft = state.autoSpin.remaining;

  state.autoSpin.active = false;
  state.autoSpin.stopRequested = false;
  updateHud();
  updateAutoSpinStatus();
  updateControlStates();

  if (spinsLeft === 0) {
    setMessage("Auto-play complete.");
    return;
  }

  if (stoppedByUser) {
    setMessage("Auto-play stopped after the current spin.");
    return;
  }

  setMessage("Auto-play halted because there were insufficient credits for the next wager.");
}

async function startAutoSpin() {
  if (state.spinning || state.autoSpin.active || !state.consent.accepted) {
    return;
  }

  const selectedCount = currentAutoSpinSelection();

  if (state.tokens < state.spinCost) {
    setMessage("Auto-play could not start because the current wager exceeds the available credits.");
    return;
  }

  state.autoSpin.active = true;
  state.autoSpin.remaining = selectedCount;
  state.autoSpin.stopRequested = false;
  state.autoSpin.cost = state.spinCost;
  updateHud();
  updateAutoSpinStatus();
  updateControlStates();
  setMessage(
    `Auto-play set for ${formatNumber(selectedCount)} spin${selectedCount === 1 ? "" : "s"} at ${formatNumber(state.spinCost)} credits per wager.`,
  );

  await runAutoSpin();
}

function stopAutoSpin() {
  if (!state.autoSpin.active) {
    return;
  }

  state.autoSpin.stopRequested = true;
  updateAutoSpinStatus("Stop requested. Auto-play will end after the current spin.");
}

function resetGame() {
  if (state.spinning || state.autoSpin.active) {
    return;
  }

  state.tokens = startingTokens;
  state.lastAward = 0;
  clearHighlights();
  clearCelebration();
  seedBoard();
  updateHud();
  renderIdleBreakdown();
  setMessage("Credit meter reloaded. Place your wager to continue.");
  fadeInElement(reelStage, { duration: 0.5 });
}

function populateStateSelect() {
  states.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.code;
    option.textContent = entry.name;
    stateSelect.append(option);
  });
}

function persistConsent() {
  try {
    window.localStorage.setItem(consentStorageKey, JSON.stringify(state.consent));
  } catch (error) {
    return;
  }
}

function readStoredConsent() {
  try {
    const raw = window.localStorage.getItem(consentStorageKey);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function updateLocationFeedback() {
  locationFeedback.textContent = state.consent.locationLabel === "Pending"
    ? "No location submitted. You can also choose your state manually."
    : `${state.consent.locationLabel}. ${complianceReminder}`;
  fadeInElement(locationFeedback, { duration: 0.4 });
  updateHud();
}

function applyConsentState(accepted) {
  state.consent.accepted = accepted;

  if (accepted) {
    privacyModal.hidden = true;
    document.body.classList.remove("modal-open");
    updateControlStates();
    return;
  }

  privacyModal.hidden = false;
  document.body.classList.add("modal-open");
  updateControlStates();
  fadeInElement(privacyCard, {
    duration: prefersReducedMotion() ? 0 : 0.5,
  });
}

function canAcceptConsent() {
  return (
    privacyCheckbox.checked &&
    termsCheckbox.checked &&
    state.consent.locationMode !== "none"
  );
}

function updateConsentButtonState() {
  privacyAcceptButton.disabled = !canAcceptConsent();
}

function applyManualStateSelection() {
  const stateCode = stateSelect.value;

  if (!stateCode) {
    if (state.consent.locationMode === "manual") {
      state.consent.locationMode = "none";
      state.consent.locationLabel = "Pending";
      state.consent.stateCode = "";
      updateLocationFeedback();
      updateConsentButtonState();
    }
    return;
  }

  const selectedState = states.find((entry) => entry.code === stateCode);
  state.consent.locationMode = "manual";
  state.consent.stateCode = stateCode;
  state.consent.locationLabel = `Manual: ${selectedState.name}`;
  state.consent.coords = null;
  updateLocationFeedback();
  updateConsentButtonState();
}

function requestLocation() {
  if (!navigator.geolocation) {
    locationFeedback.textContent =
      "This browser does not provide device location. Select your state manually to continue.";
    return;
  }

  locationButton.disabled = true;
  locationFeedback.textContent = "Requesting device location...";
  fadeInElement(locationFeedback, { duration: 0.35 });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude.toFixed(2);
      const longitude = position.coords.longitude.toFixed(2);
      state.consent.locationMode = "geolocation";
      state.consent.coords = {
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
      state.consent.stateCode = stateSelect.value || "";
      state.consent.locationLabel = `Location Shared: ${latitude}, ${longitude}`;
      locationButton.disabled = false;
      updateLocationFeedback();
      updateConsentButtonState();
    },
    () => {
      locationButton.disabled = false;
      locationFeedback.textContent =
        "Location request was denied or unavailable. Select your state manually to continue.";
      fadeInElement(locationFeedback, { duration: 0.35 });
      updateConsentButtonState();
    },
    {
      enableHighAccuracy: false,
      timeout: 7000,
      maximumAge: 300000,
    },
  );
}

function initializeConsent() {
  const storedConsent = readStoredConsent();

  if (storedConsent && storedConsent.accepted) {
    state.consent = {
      accepted: true,
      locationMode: storedConsent.locationMode || "none",
      locationLabel: storedConsent.locationLabel || "Accepted",
      coords: storedConsent.coords || null,
      stateCode: storedConsent.stateCode || "",
    };

    if (state.consent.stateCode) {
      stateSelect.value = state.consent.stateCode;
    }

    privacyCheckbox.checked = true;
    termsCheckbox.checked = true;
    applyConsentState(true);
    updateLocationFeedback();
    return;
  }

  state.consent.locationMode = "none";
  state.consent.locationLabel = "Pending";
  state.consent.coords = null;
  state.consent.stateCode = "";
  privacyCheckbox.checked = false;
  termsCheckbox.checked = false;
  applyConsentState(false);
  updateLocationFeedback();
  updateConsentButtonState();
}

function initializeSliders() {
  costSlider.min = String(minSpinCost);
  costSlider.max = String(maxSpinCost);
  costSlider.value = String(defaultSpinCost);
  autoSpinSlider.min = String(autoSpinRange.min);
  autoSpinSlider.max = String(autoSpinRange.max);
  autoSpinSlider.value = String(autoSpinRange.defaultValue);
  state.spinCost = defaultSpinCost;
  state.autoSpin.remaining = autoSpinRange.defaultValue;
  updateSliderLabels();
}

function seedDisplayValues() {
  [
    [tokenCount, state.tokens],
    [spinCostDisplay, state.spinCost],
    [queueCount, state.autoSpin.remaining],
    [lastAward, state.lastAward],
    [costSliderValue, state.spinCost],
    [autoSpinValue, currentAutoSpinSelection()],
  ].forEach(([element, value]) => {
    displayValues.set(element, value);
    element.textContent = formatNumber(value);
  });
}

function fadeInInitialLayout() {
  fadeInElement(document.querySelector(".hero"), { duration: 0.55 });
  fadeInElements(document.querySelectorAll(".status-bar .stat-card"), {
    duration: 0.45,
    staggerStep: 0.05,
    startDelay: 0.08,
  });
  fadeInElement(reelStage, { duration: 0.5 });
  fadeInElements(document.querySelectorAll(".control-grid .control-card"), {
    duration: 0.45,
    staggerStep: 0.06,
    startDelay: 0.12,
  });
}

initializeTheme();
buildBoard();
seedAmbientSparkles();
seedSparkles();
seedBoard();
populateStateSelect();
initializeSliders();
seedDisplayValues();
updateHud();
updateAutoSpinStatus();
renderIdleBreakdown();
renderSpinHistory();
setupAnimatedButtons();
initializeConsent();
fadeInInitialLayout();

themeToggle?.addEventListener("click", toggleTheme);

costSlider.addEventListener("input", () => {
  state.spinCost = clampNumber(
    Number.parseInt(costSlider.value, 10) || defaultSpinCost,
    minSpinCost,
    maxSpinCost,
  );
  updateSliderLabels();
  updateHud();
  updateControlStates();
});

autoSpinSlider.addEventListener("input", () => {
  updateSliderLabels();
  updateHud();
});

spinButton.addEventListener("click", spin);
autoSpinButton.addEventListener("click", startAutoSpin);
stopAutoSpinButton.addEventListener("click", stopAutoSpin);
resetButton.addEventListener("click", resetGame);
locationButton.addEventListener("click", requestLocation);
stateSelect.addEventListener("change", applyManualStateSelection);
privacyCheckbox.addEventListener("change", updateConsentButtonState);
termsCheckbox.addEventListener("change", updateConsentButtonState);
privacyAcceptButton.addEventListener("click", () => {
  if (!canAcceptConsent()) {
    return;
  }

  applyConsentState(true);
  state.consent.accepted = true;
  persistConsent();
  updateHud();
  setMessage("Eligibility acknowledgement recorded. Game access enabled.");
});

attachBurstToControl(spinButton, {
  count: 14,
  spread: 140,
  lift: 28,
  palette: celebrationPalette,
});
attachBurstToControl(autoSpinButton, {
  count: 12,
  spread: 132,
  lift: 28,
  palette: [celebrationPalette[1], celebrationPalette[2], celebrationPalette[0]],
});
attachBurstToControl(stopAutoSpinButton, {
  count: 10,
  spread: 120,
  lift: 18,
  palette: [celebrationPalette[2], celebrationPalette[3], celebrationPalette[0]],
});
attachBurstToControl(resetButton, {
  count: 12,
  spread: 132,
  lift: 26,
  palette: [celebrationPalette[0], celebrationPalette[1], celebrationPalette[2]],
});
attachBurstToControl(locationButton, {
  count: 10,
  spread: 120,
  lift: 26,
  palette: [celebrationPalette[1], celebrationPalette[2], celebrationPalette[0]],
});
attachBurstToControl(privacyAcceptButton, {
  count: 16,
  spread: 160,
  lift: 34,
  palette: [celebrationPalette[0], celebrationPalette[1], "#FFFFFF"],
});

window.promptDropDebug = {
  animateColumn,
  animateCount,
  emitParticleBurst,
  fadeInElement,
  prefersReducedMotion,
  isMobileViewport,
  seedAmbientSparkles,
  triggerCelebration,
  getMotionState: () => ({
    readyPulse: pulseAnimations.has(spinButton),
    pulseTargets: pulseAnimations.size,
    bounceTargets: bounceAnimations.size,
  }),
  state,
};

window.addEventListener("resize", () => {
  seedAmbientSparkles();
  seedSparkles();
});
