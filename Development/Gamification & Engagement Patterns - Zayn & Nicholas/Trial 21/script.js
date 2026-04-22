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
  variableRatioReward,
  bonusOffers,
  createSpinGrid,
  payoutMultiplier,
  randomInt,
  complianceReminder,
} = window.SLOT_CONFIG;
const {
  resolveBonusOffer,
  calculateBonusSpinCost,
  calculateBonusSpinSurcharge,
  applyBonusMultiplierToWin,
  buildBonusAudioCue,
  buildBonusPresentationState,
} = window.BONUS_FEATURES;
const {
  restoreVariableRatioRewardState,
  serializeVariableRatioRewardState,
  advanceVariableRatioReward,
} = window.VARIABLE_RATIO_REWARD;

const reelBoard = document.getElementById("reelBoard");
const reelStage = document.getElementById("reelStage");
const glowRing = reelStage?.querySelector(".glow-ring");
const bonusSpinOverlay = document.getElementById("bonusSpinOverlay");
const bonusSpinBadge = document.getElementById("bonusSpinBadge");
const bonusSpinCopy = document.getElementById("bonusSpinCopy");
const rootElement = document.documentElement;
const ambientSparkles = document.getElementById("ambientSparkles");
const sparkleField = document.getElementById("sparkleField");
const fxLayer = document.getElementById("fxLayer");
const coinRain = document.getElementById("coinRain");
const tokenCount = document.getElementById("tokenCount");
const playerIdentityDisplay = document.getElementById("playerIdentityDisplay");
const playerIconDisplay = document.getElementById("playerIconDisplay");
const playerNameDisplay = document.getElementById("playerNameDisplay");
const spinCostDisplay = document.getElementById("spinCostDisplay");
const queueCount = document.getElementById("queueCount");
const playTimeDisplay = document.getElementById("playTimeDisplay");
const lastAward = document.getElementById("lastAward");
const lastAwardCard = document.getElementById("lastAwardCard");
const streakCount = document.getElementById("streakCount");
const refillCountdownDisplay = document.getElementById("refillCountdownDisplay");
const dailyBonusStatus = document.getElementById("dailyBonusStatus");
const todaysBonusAmount = document.getElementById("todaysBonusAmount");
const nextBonusAmount = document.getElementById("nextBonusAmount");
const bonusBuyStatus = document.getElementById("bonusBuyStatus");
const bonusBuyTotalCost = document.getElementById("bonusBuyTotalCost");
const bonusBuyMultiplierDisplay = document.getElementById("bonusBuyMultiplierDisplay");
const bonusBuyOptions = document.getElementById("bonusBuyOptions");
const variableRewardStatus = document.getElementById("variableRewardStatus");
const variableRewardLastAmount = document.getElementById("variableRewardLastAmount");
const variableRewardCount = document.getElementById("variableRewardCount");
const locationStatus = document.getElementById("locationStatus");
const costSlider = document.getElementById("costSlider");
const costSliderValue = document.getElementById("costSliderValue");
const playerNameInput = document.getElementById("playerNameInput");
const saveNameButton = document.getElementById("saveNameButton");
const playerNameStatus = document.getElementById("playerNameStatus");
const iconShopList = document.getElementById("iconShopList");
const autoSpinSlider = document.getElementById("autoSpinSlider");
const autoSpinValue = document.getElementById("autoSpinValue");
const autoSpinStatus = document.getElementById("autoSpinStatus");
const spinButton = document.getElementById("spinButton");
const autoSpinButton = document.getElementById("autoSpinButton");
const stopAutoSpinButton = document.getElementById("stopAutoSpinButton");
const resetButton = document.getElementById("resetButton");
const inviteButton = document.getElementById("inviteButton");
const message = document.getElementById("message");
const winMeta = document.getElementById("winMeta");
const breakdownList = document.getElementById("breakdownList");
const spinHistoryList = document.getElementById("spinHistoryList");
const privacyModal = document.getElementById("privacyModal");
const privacyCard = privacyModal?.querySelector(".privacy-card");
const dailyBonusModal = document.getElementById("dailyBonusModal");
const dailyBonusModalCard = dailyBonusModal?.querySelector(".reward-card");
const dailyBonusModalAmount = document.getElementById("dailyBonusModalAmount");
const dailyBonusModalStreak = document.getElementById("dailyBonusModalStreak");
const dailyBonusModalNext = document.getElementById("dailyBonusModalNext");
const dailyBonusCloseButton = document.getElementById("dailyBonusCloseButton");
const wagerWarningModal = document.getElementById("wagerWarningModal");
const wagerWarningCopy = document.getElementById("wagerWarningCopy");
const wagerWarningRefillButton = document.getElementById("wagerWarningRefillButton");
const wagerWarningCloseButton = document.getElementById("wagerWarningCloseButton");
const privacyCheckbox = document.getElementById("privacyCheckbox");
const termsCheckbox = document.getElementById("termsCheckbox");
const privacyAcceptButton = document.getElementById("privacyAcceptButton");
const locationButton = document.getElementById("locationButton");
const locationFeedback = document.getElementById("locationFeedback");
const stateSelect = document.getElementById("stateSelect");
const themeToggle = document.getElementById("themeToggle");

const consentStorageKey = "prompt-drop-consent-v1";
const themeStorageKey = "prompt-drop-theme-v1";
const dailyRewardStorageKey = "prompt-drop-daily-reward-v1";
const variableRewardStorageKey = "prompt-drop-variable-reward-v1";
const playerProfileStorageKey = "prompt-drop-player-profile-v1";
const walletStorageKey = "prompt-drop-wallet-v1";
const dailyBonusBase = 250;
const dailyBonusStreakStep = 75;
const tokenRefillDelayMs = 60 * 1000;
const sessionStartedAt = Date.now();
const defaultPlayerIcon = "🙂";
const iconCatalog = [
  { icon: "🙂", name: "Starter Smile", cost: 0 },
  { icon: "🤖", name: "Bot Buddy", cost: 350 },
  { icon: "💎", name: "Diamond Drop", cost: 700 },
  { icon: "🚀", name: "Launch Mode", cost: 1100 },
  { icon: "👑", name: "Crown Signal", cost: 1800 },
  { icon: "🌟", name: "Star Surge", cost: 2400 },
];
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
let bonusAudioContext = null;

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
  tokenRefill: {
    active: false,
    endsAt: 0,
    timerId: null,
    intervalId: null,
  },
  playerProfile: {
    name: "Guest",
    selectedIcon: defaultPlayerIcon,
    ownedIcons: [defaultPlayerIcon],
  },
  spinHistory: [],
  dailyReward: {
    lastPlayedDate: "",
    streak: 0,
    todaysBonus: dailyBonusBase,
    nextBonus: dailyBonusBase + dailyBonusStreakStep,
    lastAwardedBonus: 0,
    modalPending: false,
    statusText: "Checking daily play streak.",
  },
  variableReward: null,
  bonusBuy: {
    selectedOfferId: null,
    activeOfferId: null,
    presentationTimerId: null,
    lastAudioCue: "standard-spin",
  },
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

/**
 * Resolves the bonus offer armed for the next completed spin.
 *
 * @returns {object | null} The selected bonus-buy offer when present.
 */
function selectedBonusOffer() {
  return resolveBonusOffer(bonusOffers, state.bonusBuy.selectedOfferId);
}

/**
 * Resolves the bonus offer currently animating on the live spin.
 *
 * @returns {object | null} The active bonus-buy offer when present.
 */
function activeBonusOffer() {
  return resolveBonusOffer(bonusOffers, state.bonusBuy.activeOfferId);
}

/**
 * Returns the full credit debit required for the next completed spin.
 *
 * @returns {number} The current next-spin total including any armed bonus.
 */
function nextSpinDebit() {
  return calculateBonusSpinCost(state.spinCost, selectedBonusOffer());
}

function clampNumber(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedMinutes = String(minutes).padStart(hours > 0 ? 2 : 1, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return hours > 0
    ? `${hours}:${paddedMinutes}:${paddedSeconds}`
    : `${paddedMinutes}:${paddedSeconds}`;
}

function formatCountdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  if (typeof dateKey !== "string") {
    return null;
  }

  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function daysBetweenDateKeys(startKey, endKey) {
  const startDate = parseDateKey(startKey);
  const endDate = parseDateKey(endKey);

  if (!startDate || !endDate) {
    return Number.POSITIVE_INFINITY;
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.round((endDate - startDate) / millisecondsPerDay);
}

function dailyBonusForStreak(streak) {
  return dailyBonusBase + Math.max(0, streak - 1) * dailyBonusStreakStep;
}

function formatDayCount(days) {
  return `${formatNumber(days)} day${days === 1 ? "" : "s"}`;
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

function updatePlayTimeDisplay() {
  if (!playTimeDisplay) {
    return;
  }

  playTimeDisplay.textContent = formatDuration(Date.now() - sessionStartedAt);
}

function startPlayTimeClock() {
  updatePlayTimeDisplay();
  window.setInterval(updatePlayTimeDisplay, 1000);
}

function updateDailyRewardDisplay() {
  const { dailyReward } = state;

  streakCount.textContent = formatDayCount(dailyReward.streak);
  dailyBonusStatus.textContent = dailyReward.statusText;
  todaysBonusAmount.textContent = `${formatNumber(dailyReward.todaysBonus)} credits`;
  nextBonusAmount.textContent = `${formatNumber(dailyReward.nextBonus)} credits`;
}

/**
 * Clears any pending timeout used to wind down purchased bonus presentation.
 *
 * @returns {void}
 */
function clearBonusPresentationTimer() {
  if (state.bonusBuy.presentationTimerId) {
    window.clearTimeout(state.bonusBuy.presentationTimerId);
    state.bonusBuy.presentationTimerId = null;
  }
}

/**
 * Synchronizes the purchased-bonus control card and reel-stage overlay.
 *
 * @returns {void}
 */
function updateBonusBuyDisplay() {
  const presentation = buildBonusPresentationState(
    state.spinCost,
    selectedBonusOffer(),
    activeBonusOffer(),
  );

  bonusBuyStatus.textContent = presentation.statusText;
  bonusBuyTotalCost.textContent = `${formatNumber(presentation.totalCost)} credits`;
  bonusBuyMultiplierDisplay.textContent = presentation.multiplierLabel;
  bonusSpinBadge.textContent = presentation.badgeText;
  bonusSpinCopy.textContent = presentation.copyText;

  reelStage.classList.remove(
    "bonus-armed",
    "bonus-spin-active",
    "bonus-tier-2",
    "bonus-tier-5",
    "bonus-tier-10",
  );
  reelStage.classList.add(...presentation.stageClasses);

  Array.from(bonusBuyOptions?.querySelectorAll("[data-bonus-offer-id]") || []).forEach((button) => {
    const offer = resolveBonusOffer(bonusOffers, button.dataset.bonusOfferId);
    const costLabel = button.querySelector(".bonus-buy-button-cost");
    if (offer && costLabel) {
      costLabel.textContent = `${formatNumber(calculateBonusSpinCost(state.spinCost, offer))} credits`;
    }
    button.classList.toggle(
      "is-selected",
      button.dataset.bonusOfferId === state.bonusBuy.selectedOfferId,
    );
  });
  bonusBuyOptions?.querySelector(".is-clear")?.classList.toggle(
    "is-selected",
    !state.bonusBuy.selectedOfferId,
  );
}

/**
 * Renders the purchase controls for the bonus-buy feature.
 *
 * @returns {void}
 */
function renderBonusBuyOptions() {
  if (!bonusBuyOptions) {
    return;
  }

  bonusBuyOptions.textContent = "";

  bonusOffers.forEach((offer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bonus-buy-button";
    button.dataset.bonusOfferId = offer.id;
    button.innerHTML = `
      <span class="bonus-buy-button-label">${offer.multiplier}x Multiplier</span>
      <span class="bonus-buy-button-cost">${formatNumber(calculateBonusSpinCost(state.spinCost, offer))} credits</span>
    `;
    button.addEventListener("click", () => {
      state.bonusBuy.selectedOfferId = offer.id;
      clearBonusPresentationTimer();
      updateBonusBuyDisplay();
      updateHud();
      updateControlStates();
      setMessage(
        `${offer.title} armed. The next completed spin will cost ${formatNumber(calculateBonusSpinCost(state.spinCost, offer))} credits.`,
      );
    });
    bonusBuyOptions.append(button);
  });

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "bonus-buy-button is-clear";
  clearButton.innerHTML = `
    <span class="bonus-buy-button-label">Standard Spin</span>
    <span class="bonus-buy-button-cost">Clear purchased multiplier</span>
  `;
  clearButton.addEventListener("click", () => {
    state.bonusBuy.selectedOfferId = null;
    clearBonusPresentationTimer();
    updateBonusBuyDisplay();
    updateHud();
    updateControlStates();
    setMessage("Purchased multiplier cleared. The next completed spin is back to the standard wager.");
  });
  bonusBuyOptions.append(clearButton);

  updateBonusBuyDisplay();
}

/**
 * Schedules the purchased-bonus presentation to clear after the current spin has
 * had time to settle on screen.
 *
 * @param {object | null} offer - The bonus offer that was consumed on the spin.
 * @returns {void}
 */
function scheduleBonusPresentationClear(offer) {
  clearBonusPresentationTimer();

  if (!offer) {
    state.bonusBuy.activeOfferId = null;
    updateBonusBuyDisplay();
    return;
  }

  state.bonusBuy.presentationTimerId = window.setTimeout(() => {
    state.bonusBuy.activeOfferId = null;
    state.bonusBuy.presentationTimerId = null;
    if (!state.activeCelebrationTimer) {
      coinRain.textContent = "";
      stopPulse(glowRing);
    }
    updateBonusBuyDisplay();
  }, offer.visualIntensity >= 3 ? 2600 : 1800);
}

/**
 * Reads the persisted variable reward schedule snapshot from storage.
 *
 * @returns {object | null} The stored schedule snapshot when available.
 */
function readStoredVariableReward() {
  try {
    const raw = window.localStorage.getItem(variableRewardStorageKey);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

/**
 * Persists the current variable reward schedule state to storage.
 *
 * @returns {void}
 */
function persistVariableReward() {
  if (!state.variableReward) {
    return;
  }

  try {
    window.localStorage.setItem(
      variableRewardStorageKey,
      JSON.stringify(serializeVariableRatioRewardState(state.variableReward)),
    );
  } catch (error) {
    return;
  }
}

/**
 * Creates or restores the hidden variable reward schedule.
 *
 * @returns {void}
 */
function initializeVariableReward() {
  state.variableReward = restoreVariableRatioRewardState(
    readStoredVariableReward(),
    variableRatioReward,
    randomInt,
  );
  persistVariableReward();
}

/**
 * Updates the variable reward panel without revealing the hidden reward interval.
 *
 * @returns {void}
 */
function updateVariableRewardDisplay() {
  if (!state.variableReward) {
    return;
  }

  const lastVariableReward = state.variableReward.lastReward?.award || 0;
  animateCount(variableRewardLastAmount, lastVariableReward, {
    minDuration: 0.35,
    maxDuration: 0.8,
    formatter: (value) => `${formatNumber(value)} credits`,
  });
  variableRewardCount.textContent = formatNumber(state.variableReward.rewardsTriggered);
  variableRewardStatus.textContent =
    "Schedule active. Extra credits may appear after an undisclosed number of completed spins.";
}

function updateRefillCountdownDisplay() {
  if (!refillCountdownDisplay) {
    return;
  }

  if (!state.tokenRefill.active) {
    refillCountdownDisplay.textContent = "Ready";
    return;
  }

  refillCountdownDisplay.textContent = formatCountdown(state.tokenRefill.endsAt - Date.now());
}

function clearTokenRefillCountdown() {
  if (state.tokenRefill.timerId) {
    window.clearTimeout(state.tokenRefill.timerId);
  }

  if (state.tokenRefill.intervalId) {
    window.clearInterval(state.tokenRefill.intervalId);
  }

  state.tokenRefill.active = false;
  state.tokenRefill.endsAt = 0;
  state.tokenRefill.timerId = null;
  state.tokenRefill.intervalId = null;
  updateRefillCountdownDisplay();
}

function completeTokenRefillCountdown() {
  clearTokenRefillCountdown();
  state.tokens = Math.max(state.tokens, startingTokens);
  updateHud();
  updateControlStates();
  setMessage("Automatic token refill complete. The credit meter is ready.");
}

function startTokenRefillCountdown() {
  if (state.tokenRefill.active || state.tokens >= nextSpinDebit()) {
    updateRefillCountdownDisplay();
    return;
  }

  state.tokenRefill.active = true;
  state.tokenRefill.endsAt = Date.now() + tokenRefillDelayMs;
  state.tokenRefill.timerId = window.setTimeout(
    completeTokenRefillCountdown,
    tokenRefillDelayMs,
  );
  state.tokenRefill.intervalId = window.setInterval(() => {
    updateRefillCountdownDisplay();
  }, 1000);
  updateRefillCountdownDisplay();
  updateControlStates();
}

function syncTokenRefillCountdown() {
  if (state.tokens < nextSpinDebit()) {
    startTokenRefillCountdown();
    return;
  }

  if (state.tokenRefill.active) {
    clearTokenRefillCountdown();
    updateControlStates();
  } else {
    updateRefillCountdownDisplay();
  }
}

function showDailyBonusModal() {
  if (!state.dailyReward.modalPending || !privacyModal.hidden || !dailyBonusModal) {
    return;
  }

  dailyBonusModalAmount.textContent = `+${formatNumber(state.dailyReward.lastAwardedBonus)} credits`;
  dailyBonusModalStreak.textContent = formatDayCount(state.dailyReward.streak);
  dailyBonusModalNext.textContent = `${formatNumber(state.dailyReward.nextBonus)} credits`;
  dailyBonusModal.hidden = false;
  document.body.classList.add("modal-open");
  fadeInElement(dailyBonusModalCard, {
    duration: prefersReducedMotion() ? 0 : 0.45,
  });
}

function closeDailyBonusModal() {
  state.dailyReward.modalPending = false;
  dailyBonusModal.hidden = true;

  if (privacyModal.hidden && wagerWarningModal.hidden) {
    document.body.classList.remove("modal-open");
  }

  if (state.tokens < nextSpinDebit()) {
    window.setTimeout(showWagerWarningModal, 120);
  }
}

function closeWagerWarningModal() {
  wagerWarningModal.hidden = true;

  if (privacyModal.hidden && dailyBonusModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

function showWagerWarningModal() {
  if (!wagerWarningModal || !privacyModal.hidden || !dailyBonusModal.hidden) {
    return;
  }

  const countdown = state.tokenRefill.active
    ? formatCountdown(state.tokenRefill.endsAt - Date.now())
    : formatCountdown(tokenRefillDelayMs);
  const activeOffer = selectedBonusOffer();
  const wagerLabel = activeOffer
    ? `${formatNumber(nextSpinDebit())} credits (${formatNumber(state.spinCost)} base + ${formatNumber(calculateBonusSpinSurcharge(state.spinCost, activeOffer))} bonus)`
    : `${formatNumber(state.spinCost)} credits`;

  wagerWarningCopy.textContent =
    `You have ${formatNumber(state.tokens)} credits, but the next spin costs ${wagerLabel}. Automatic refill completes in ${countdown}.`;
  wagerWarningModal.hidden = false;
  document.body.classList.add("modal-open");
  fadeInElement(wagerWarningModal.querySelector(".privacy-card"), {
    duration: prefersReducedMotion() ? 0 : 0.45,
  });
}

function readStoredWallet() {
  try {
    const raw = window.localStorage.getItem(walletStorageKey);

    if (!raw) {
      return null;
    }

    const storedWallet = JSON.parse(raw);

    return Number.isFinite(storedWallet?.tokens) ? storedWallet.tokens : null;
  } catch (error) {
    return null;
  }
}

function persistWallet() {
  try {
    window.localStorage.setItem(
      walletStorageKey,
      JSON.stringify({ tokens: state.tokens }),
    );
  } catch (error) {
    return;
  }
}

function initializeWallet() {
  const storedTokens = readStoredWallet();

  if (Number.isFinite(storedTokens)) {
    state.tokens = Math.max(0, storedTokens);
  }

  persistWallet();
}

function sanitizePlayerName(name) {
  const cleanName = String(name || "").trim().replace(/\s+/g, " ").slice(0, 18);

  return cleanName || "Guest";
}

function readStoredPlayerProfile() {
  try {
    const raw = window.localStorage.getItem(playerProfileStorageKey);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function persistPlayerProfile() {
  try {
    window.localStorage.setItem(
      playerProfileStorageKey,
      JSON.stringify(state.playerProfile),
    );
  } catch (error) {
    return;
  }
}

function updatePlayerProfileDisplay() {
  playerIconDisplay.textContent = state.playerProfile.selectedIcon;
  playerNameDisplay.textContent = state.playerProfile.name;

  if (playerNameInput && document.activeElement !== playerNameInput) {
    playerNameInput.value = state.playerProfile.name === "Guest"
      ? ""
      : state.playerProfile.name;
  }
}

function setPlayerNameStatus(text) {
  if (!playerNameStatus) {
    return;
  }

  playerNameStatus.textContent = text;
  fadeInElement(playerNameStatus, { duration: 0.35 });
}

function renderIconShop() {
  if (!iconShopList) {
    return;
  }

  iconShopList.textContent = "";

  iconCatalog.forEach((item) => {
    const owned = state.playerProfile.ownedIcons.includes(item.icon);
    const selected = state.playerProfile.selectedIcon === item.icon;
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const label = document.createElement("span");
    const meta = document.createElement("span");

    button.className = "icon-shop-button";
    button.type = "button";
    button.disabled = state.spinning || state.autoSpin.active || (!owned && state.tokens < item.cost);
    button.classList.toggle("is-owned", owned);
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));

    icon.className = "icon-shop-symbol";
    icon.textContent = item.icon;
    label.className = "icon-shop-name";
    label.textContent = item.name;
    meta.className = "icon-shop-meta";
    meta.textContent = selected
      ? "Equipped"
      : owned
        ? "Equip"
        : `${formatNumber(item.cost)} credits`;

    button.append(icon, label, meta);
    button.addEventListener("click", () => {
      purchaseOrEquipIcon(item);
    });
    iconShopList.append(button);
  });
}

function initializePlayerProfile() {
  const storedProfile = readStoredPlayerProfile();
  const ownedIcons = Array.isArray(storedProfile?.ownedIcons)
    ? [...new Set([defaultPlayerIcon, ...storedProfile.ownedIcons])]
    : [defaultPlayerIcon];
  const selectedIcon = ownedIcons.includes(storedProfile?.selectedIcon)
    ? storedProfile.selectedIcon
    : defaultPlayerIcon;

  state.playerProfile = {
    name: sanitizePlayerName(storedProfile?.name),
    selectedIcon,
    ownedIcons,
  };

  persistPlayerProfile();
  updatePlayerProfileDisplay();
}

function savePlayerName() {
  state.playerProfile.name = sanitizePlayerName(playerNameInput.value);
  persistPlayerProfile();
  updatePlayerProfileDisplay();
  setPlayerNameStatus(`Welcome, ${state.playerProfile.name}.`);
}

function purchaseOrEquipIcon(item) {
  const owned = state.playerProfile.ownedIcons.includes(item.icon);

  if (!owned && state.tokens < item.cost) {
    setPlayerNameStatus(`Need ${formatNumber(item.cost)} credits for ${item.name}.`);
    return;
  }

  if (!owned) {
    state.tokens -= item.cost;
    state.playerProfile.ownedIcons.push(item.icon);
    setPlayerNameStatus(`${item.name} purchased and equipped.`);
  } else {
    setPlayerNameStatus(`${item.name} equipped.`);
  }

  state.playerProfile.selectedIcon = item.icon;
  persistPlayerProfile();
  updatePlayerProfileDisplay();
  renderIconShop();
  updateHud();
  syncTokenRefillCountdown();
  emitParticleBurst(playerIdentityDisplay, {
    count: 14,
    spread: 130,
    lift: 28,
    palette: celebrationPalette,
  });
}

async function inviteFriends() {
  const inviteUrl = window.location.href.split("#")[0];
  const inviteText = "Come spin Prompt Drop Casino with me.";

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Prompt Drop Casino",
        text: inviteText,
        url: inviteUrl,
      });
      setMessage("Invite ready to send.");
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(inviteUrl);
      setMessage("Invite link copied to clipboard.");
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") {
      setMessage("Invite canceled.");
      return;
    }
  }

  window.prompt("Copy this invite link:", inviteUrl);
  setMessage("Invite link ready.");
}

function readStoredDailyReward() {
  try {
    const raw = window.localStorage.getItem(dailyRewardStorageKey);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function persistDailyReward() {
  try {
    window.localStorage.setItem(
      dailyRewardStorageKey,
      JSON.stringify({
        lastPlayedDate: state.dailyReward.lastPlayedDate,
        streak: state.dailyReward.streak,
        lastBonusAmount: state.dailyReward.todaysBonus,
      }),
    );
  } catch (error) {
    return;
  }
}

function initializeDailyReward() {
  const todayKey = formatDateKey(new Date());
  const storedReward = readStoredDailyReward();
  const storedStreak = Number.isFinite(storedReward?.streak)
    ? Math.max(0, storedReward.streak)
    : 0;
  const alreadyPlayedToday = storedReward?.lastPlayedDate === todayKey;
  const dayGap = daysBetweenDateKeys(storedReward?.lastPlayedDate, todayKey);
  const streak = alreadyPlayedToday
    ? Math.max(1, storedStreak)
    : dayGap === 1
      ? Math.max(1, storedStreak) + 1
      : 1;
  const todaysBonus = dailyBonusForStreak(streak);
  const awardedBonus = alreadyPlayedToday ? 0 : todaysBonus;

  if (awardedBonus > 0) {
    state.tokens += awardedBonus;
    persistWallet();
  }

  state.dailyReward = {
    lastPlayedDate: todayKey,
    streak,
    todaysBonus,
    nextBonus: dailyBonusForStreak(streak + 1),
    lastAwardedBonus: awardedBonus,
    modalPending: awardedBonus > 0,
    statusText: awardedBonus > 0
      ? `Daily bonus awarded for a ${formatDayCount(streak)} streak.`
      : `Today's bonus was already awarded. ${formatDayCount(streak)} streak active.`,
  };

  persistDailyReward();
  updateDailyRewardDisplay();

  return awardedBonus;
}

/**
 * Computes the combined award paid after a completed spin.
 *
 * @param {object | null} paidWin - The regular payline win, if any.
 * @param {object | null} bonusReward - The variable-ratio bonus, if any.
 * @returns {number} The full credit award for the spin.
 */
function totalAwardForSpin(paidWin, bonusReward) {
  return (paidWin?.award || 0) + (bonusReward?.award || 0);
}

/**
 * Builds a history-friendly description of the completed spin outcome.
 *
 * @param {object | null} paidWin - The regular payline win, if any.
 * @param {object | null} bonusReward - The variable-ratio bonus, if any.
 * @param {{ wagerCost?: number, bonusOffer?: object | null }} spinContext - Context about the completed spin.
 * @returns {{ outcomeLabel: string, summary: string }} A concise outcome description.
 */
function describeSpinOutcome(paidWin, bonusReward, spinContext = {}) {
  const purchasedBonus = spinContext.bonusOffer || null;

  if (paidWin && bonusReward) {
    return {
      outcomeLabel: purchasedBonus ? "Boost + Bonus" : "Win + Bonus",
      summary:
        `${paidWin.line.name} paid ${formatNumber(paidWin.award)} credits and ` +
        `${bonusReward.label} added ${formatNumber(bonusReward.award)} credits.`,
    };
  }

  if (paidWin) {
    return {
      outcomeLabel: purchasedBonus ? "Boosted Win" : "Win",
      summary: purchasedBonus
        ? `${purchasedBonus.title} boosted ${paidWin.line.name} from ${formatNumber(paidWin.baseAward)} to ${formatNumber(paidWin.award)} credits.`
        : `${paidWin.line.name} paid ${formatNumber(paidWin.award)} credits on a ${paidWin.symbol.name} ${paidWin.matchCount}-match.`,
    };
  }

  if (bonusReward) {
    return {
      outcomeLabel: "Bonus",
      summary:
        `${bonusReward.label} awarded ${formatNumber(bonusReward.award)} credits ` +
        "after an undisclosed number of completed spins.",
    };
  }

  return {
    outcomeLabel: purchasedBonus ? "Boost Miss" : "No Win",
    summary: purchasedBonus
      ? `${purchasedBonus.title} was consumed with no qualifying payline at ${formatNumber(spinContext.wagerCost || state.spinCost)} credits.`
      : `No qualifying payline at ${formatNumber(spinContext.wagerCost || state.spinCost)} credits.`,
  };
}

function updateHud() {
  animateCount(tokenCount, state.tokens);
  persistWallet();
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
  updateBonusBuyDisplay();
  updateDailyRewardDisplay();
  updateVariableRewardDisplay();
  updatePlayerProfileDisplay();
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

/**
 * Lazily creates a shared audio context for purchased bonus cues.
 *
 * @returns {AudioContext | null} The audio context when the browser supports it.
 */
function ensureBonusAudioContext() {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextCtor) {
    return null;
  }

  if (!bonusAudioContext) {
    bonusAudioContext = new AudioContextCtor();
  }

  return bonusAudioContext;
}

/**
 * Plays the purchased bonus audio cue associated with the current spin.
 *
 * @param {object | null} offer - The active purchased bonus offer.
 * @returns {void}
 */
function playBonusAudioCue(offer) {
  const cue = buildBonusAudioCue(offer);
  state.bonusBuy.lastAudioCue = cue.cueId;

  if (!offer || cue.notes.length === 0) {
    return;
  }

  try {
    const context = ensureBonusAudioContext();

    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }

    const startedAt = context.currentTime;

    cue.notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      const noteStart = startedAt + index * (cue.noteDurationMs / 1000) * 0.62;
      const noteEnd = noteStart + cue.noteDurationMs / 1000;

      oscillator.type = cue.waveform;
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      gainNode.gain.setValueAtTime(0.0001, noteStart);
      gainNode.gain.exponentialRampToValueAtTime(cue.gain, noteStart + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start(noteStart);
      oscillator.stop(noteEnd + 0.03);
    });
  } catch (error) {
    console.error("Purchased bonus audio cue could not be played.", error);
  }
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
  const requiredCredits = nextSpinDebit();
  const readyToSpin = !locked && state.tokens >= requiredCredits;

  spinButton.disabled = locked || state.tokens < requiredCredits;
  autoSpinButton.disabled = locked || state.tokens < requiredCredits;
  resetButton.disabled = state.spinning || state.autoSpin.active;
  stopAutoSpinButton.disabled = !state.autoSpin.active;
  costSlider.disabled = state.spinning || state.autoSpin.active || !state.consent.accepted;
  autoSpinSlider.disabled = locked;
  Array.from(bonusBuyOptions?.querySelectorAll("button") || []).forEach((button) => {
    button.disabled = locked;
  });
  if (saveNameButton) {
    saveNameButton.disabled = state.spinning || state.autoSpin.active;
  }
  inviteButton.disabled = state.spinning || state.autoSpin.active;
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
  if (!control) {
    return;
  }

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

function renderBreakdown(paidWin, candidates, bonusReward = null, spinContext = {}) {
  const purchasedBonus = spinContext.bonusOffer || null;
  breakdownList.textContent = "";

  if (!paidWin && !bonusReward) {
    const item = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "empty-state";
    cell.colSpan = 3;
    cell.textContent =
      purchasedBonus
        ? `${purchasedBonus.title} was consumed, but no qualifying payline reached the paytable.`
        : "No qualifying payline. The wager was deducted from the credit meter.";
    item.append(cell);
    breakdownList.append(item);
    winMeta.textContent = purchasedBonus
      ? `${purchasedBonus.title} completed with no 3-symbol qualifying payline.`
      : "No payline reached 3 matching symbols.";
    fadeInElement(winMeta, { duration: 0.4 });
    animateBreakdownEntrance();
    return;
  }

  if (paidWin) {
    const paidItem = document.createElement("tr");
    paidItem.className = "breakdown-item";
    paidItem.innerHTML = `
      <td class="paid-item breakdown-result">Paid</td>
      <td class="paid-item breakdown-detail">${paidWin.line.name}: ${paidWin.symbol.name} ${paidWin.matchCount} of a kind for ${paidWin.multiplier}x${paidWin.bonusMultiplierApplied ? ` (boosted from ${paidWin.baseMultiplier}x by ${paidWin.bonusOffer.title})` : ""}</td>
      <td class="paid-item breakdown-award">${formatNumber(paidWin.award)} credits</td>
    `;
    breakdownList.append(paidItem);
  }

  if (bonusReward) {
    const bonusItem = document.createElement("tr");
    bonusItem.className = "breakdown-item";
    bonusItem.innerHTML = `
      <td class="paid-item breakdown-result">Bonus</td>
      <td class="paid-item breakdown-detail">${bonusReward.label}: ${bonusReward.multiplier}x wager awarded after an undisclosed number of completed spins</td>
      <td class="paid-item breakdown-award">${formatNumber(bonusReward.award)} credits</td>
    `;
    breakdownList.append(bonusItem);
  }

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

  if (paidWin && bonusReward) {
    winMeta.textContent =
      `${paidWin.line.name} paid ${paidWin.multiplier}x and ${bonusReward.label} ` +
      `added ${bonusReward.multiplier}x. ${candidates.length - 1} additional ` +
      `qualifying payline${candidates.length === 2 ? "" : "s"} not paid.`;
  } else if (paidWin) {
    winMeta.textContent =
      `${paidWin.line.name} paid ${paidWin.multiplier}x${purchasedBonus ? ` with ${purchasedBonus.title}` : ""}. ${candidates.length - 1} ` +
      `additional qualifying payline${candidates.length === 2 ? "" : "s"} not paid.`;
  } else {
    winMeta.textContent =
      `${bonusReward.label} awarded a hidden bonus after a completed spin with no qualifying payline.`;
  }
  fadeInElement(winMeta, { duration: 0.4 });
  animateBreakdownEntrance();
}

function recordSpinHistory(paidWin, bonusReward, spinContext = {}) {
  const spinNumber = state.spinHistory.length > 0
    ? state.spinHistory[0].spinNumber + 1
    : 1;
  const outcome = describeSpinOutcome(paidWin, bonusReward, spinContext);

  state.spinHistory.unshift(
    {
      spinNumber,
      outcomeLabel: outcome.outcomeLabel,
      summary: outcome.summary,
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

/**
 * Launches pre-spin presentation for a purchased multiplier.
 *
 * @param {object | null} offer - The purchased bonus offer for the live spin.
 * @returns {void}
 */
function triggerBonusSpinPresentation(offer) {
  if (!offer) {
    return;
  }

  updateBonusBuyDisplay();
  playBonusAudioCue(offer);

  if (prefersReducedMotion()) {
    return;
  }

  emitParticleBurst(reelStage, {
    count: offer.visualIntensity === 1 ? 16 : offer.visualIntensity === 2 ? 24 : 34,
    spread: offer.visualIntensity === 1 ? 150 : offer.visualIntensity === 2 ? 210 : 300,
    lift: offer.visualIntensity === 1 ? 34 : offer.visualIntensity === 2 ? 48 : 72,
    minSize: 0.22,
    maxSize: offer.visualIntensity === 3 ? 0.88 : 0.62,
    palette: offer.visualIntensity === 3
      ? [...celebrationPalette, "#FFFFFF"]
      : celebrationPalette.slice(0, offer.visualIntensity + 1),
  });

  startPulse(
    glowRing,
    {
      scale: [1, 1.018, 1],
      boxShadow: [
        `0 0 18px ${themedRgba("--win-glow-rgb", 0.1)}`,
        `0 0 34px ${themedRgba("--win-glow-rgb", 0.22)}`,
        `0 0 18px ${themedRgba("--win-glow-rgb", 0.1)}`,
      ],
    },
    { duration: offer.visualIntensity === 3 ? 0.78 : 1.05 },
  );

  if (offer.visualIntensity >= 2) {
    emitParticleBurst(lastAwardCard, {
      count: offer.visualIntensity === 2 ? 12 : 18,
      spread: 150,
      lift: offer.visualIntensity === 2 ? 26 : 36,
      minSize: 0.2,
      maxSize: offer.visualIntensity === 2 ? 0.56 : 0.72,
      palette: [celebrationPalette[0], celebrationPalette[1], "#FFFFFF"],
    });
  }

  if (offer.visualIntensity >= 3) {
    createCoinRain(offer.multiplier * 2);
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

  const purchasedBonus = selectedBonusOffer();
  const spinDebit = calculateBonusSpinCost(state.spinCost, purchasedBonus);

  if (state.tokens < spinDebit) {
    startTokenRefillCountdown();
    showWagerWarningModal();
    setMessage(
      `Insufficient credits. Automatic refill in ${formatCountdown(state.tokenRefill.endsAt - Date.now())}.`,
    );
    return { completed: false };
  }

  state.spinning = true;
  state.bonusBuy.activeOfferId = purchasedBonus?.id || null;
  state.bonusBuy.selectedOfferId = null;
  updateControlStates();
  clearHighlights();
  clearCelebration();
  clearBonusPresentationTimer();
  updateBonusBuyDisplay();
  triggerBonusSpinPresentation(purchasedBonus);

  try {
    state.tokens -= spinDebit;
    state.lastAward = 0;
    updateHud();
    renderPendingBreakdown();
    setMessage(
      purchasedBonus
        ? `${purchasedBonus.title} spin live. Resolving enhanced reel odds...`
        : "Reels spinning. Resolving wager outcome...",
    );

    const finalGrid = createSpinGrid(purchasedBonus?.symbolWeights);

    await Promise.all(
      finalGrid.map((column, colIndex) => animateColumn(colIndex, column)),
    );

    state.visibleGrid = finalGrid;

    const baseOutcome = evaluateGrid(finalGrid, state.spinCost);
    const paidWin = applyBonusMultiplierToWin(baseOutcome.paidWin, purchasedBonus);
    const candidates = baseOutcome.candidates;
    const bonusReward = purchasedBonus
      ? null
      : advanceVariableRatioReward(
        state.variableReward,
        state.spinCost,
        randomInt,
      );
    const totalAward = totalAwardForSpin(paidWin, bonusReward);
    if (!purchasedBonus) {
      persistVariableReward();
    }
    const spinContext = {
      wagerCost: spinDebit,
      bonusOffer: purchasedBonus,
    };

    if (totalAward > 0) {
      state.tokens += totalAward;
      state.lastAward = totalAward;
    }

    updateHud();
    renderBreakdown(paidWin, candidates, bonusReward, spinContext);
    recordSpinHistory(paidWin, bonusReward, spinContext);
    applyHighlights(paidWin, candidates);

    try {
      triggerCelebration(paidWin);
    } catch (error) {
      console.error("Celebration effect failed after spin resolution.", error);
    }

    if (!paidWin && !bonusReward) {
      setMessage(
        purchasedBonus
          ? `${purchasedBonus.title} was consumed with no qualifying payline.`
          : "No win. No qualifying paylines were awarded.",
      );
    } else if (!paidWin && bonusReward) {
      setMessage(
        `${bonusReward.label} awarded ${formatNumber(bonusReward.award)} credits after an undisclosed number of completed spins.`,
      );
    } else if (paidWin && bonusReward) {
      setMessage(
        `${paidWin.line.name} paid ${formatNumber(paidWin.award)} credits and ${bonusReward.label} added ${formatNumber(bonusReward.award)} credits.`,
      );
    } else if (purchasedBonus) {
      setMessage(
        `${purchasedBonus.title} boosted ${paidWin.line.name} from ${formatNumber(paidWin.baseAward)} to ${formatNumber(paidWin.award)} credits.`,
      );
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

    scheduleBonusPresentationClear(purchasedBonus);
    syncTokenRefillCountdown();
    if (state.tokens < nextSpinDebit()) {
      showWagerWarningModal();
    }

    return { completed: true, paidWin };
  } finally {
    if (state.bonusBuy.activeOfferId && !state.bonusBuy.presentationTimerId) {
      scheduleBonusPresentationClear(purchasedBonus);
    }
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
    state.autoSpin.cost = nextSpinDebit();
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
  const openingSpinDebit = nextSpinDebit();

  if (state.tokens < openingSpinDebit) {
    startTokenRefillCountdown();
    showWagerWarningModal();
    setMessage(
      `Auto-play could not start. Automatic refill in ${formatCountdown(state.tokenRefill.endsAt - Date.now())}.`,
    );
    return;
  }

  state.autoSpin.active = true;
  state.autoSpin.remaining = selectedCount;
  state.autoSpin.stopRequested = false;
  state.autoSpin.cost = openingSpinDebit;
  updateHud();
  updateAutoSpinStatus();
  updateControlStates();
  setMessage(
    `${selectedBonusOffer() ? `${selectedBonusOffer().title} is armed for the opening auto-play spin. ` : ""}Auto-play set for ${formatNumber(selectedCount)} spin${selectedCount === 1 ? "" : "s"} starting at ${formatNumber(openingSpinDebit)} credits.`,
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
  state.bonusBuy.activeOfferId = null;
  clearBonusPresentationTimer();
  clearTokenRefillCountdown();
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
    window.setTimeout(showDailyBonusModal, 120);
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
    [variableRewardLastAmount, state.variableReward?.lastReward?.award || 0],
    [bonusBuyTotalCost, nextSpinDebit()],
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
renderBonusBuyOptions();
initializeWallet();
initializePlayerProfile();
const initialDailyBonusAward = initializeDailyReward();
initializeVariableReward();
seedDisplayValues();
updateHud();
syncTokenRefillCountdown();
updateAutoSpinStatus();
renderIdleBreakdown();
renderSpinHistory();
setupAnimatedButtons();
initializeConsent();
fadeInInitialLayout();
startPlayTimeClock();

if (state.tokens < nextSpinDebit()) {
  window.setTimeout(showWagerWarningModal, 180);
}

if (initialDailyBonusAward > 0) {
  setMessage(
    `Daily bonus awarded: ${formatNumber(initialDailyBonusAward)} credits. ${formatDayCount(state.dailyReward.streak)} streak active.`,
  );
}

themeToggle?.addEventListener("click", toggleTheme);

costSlider.addEventListener("input", () => {
  state.spinCost = clampNumber(
    Number.parseInt(costSlider.value, 10) || defaultSpinCost,
    minSpinCost,
    maxSpinCost,
  );
  updateSliderLabels();
  updateHud();
  syncTokenRefillCountdown();
  if (state.tokens < nextSpinDebit()) {
    showWagerWarningModal();
  }
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
inviteButton.addEventListener("click", inviteFriends);
locationButton.addEventListener("click", requestLocation);
stateSelect.addEventListener("change", applyManualStateSelection);
privacyCheckbox.addEventListener("change", updateConsentButtonState);
termsCheckbox.addEventListener("change", updateConsentButtonState);
dailyBonusCloseButton.addEventListener("click", closeDailyBonusModal);
wagerWarningCloseButton.addEventListener("click", closeWagerWarningModal);
wagerWarningRefillButton.addEventListener("click", () => {
  closeWagerWarningModal();
  resetGame();
});
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
attachBurstToControl(inviteButton, {
  count: 12,
  spread: 132,
  lift: 26,
  palette: [celebrationPalette[2], celebrationPalette[0], celebrationPalette[1]],
});
attachBurstToControl(saveNameButton, {
  count: 10,
  spread: 120,
  lift: 24,
  palette: [celebrationPalette[0], celebrationPalette[2], celebrationPalette[1]],
});
attachBurstToControl(locationButton, {
  count: 10,
  spread: 120,
  lift: 26,
  palette: [celebrationPalette[1], celebrationPalette[2], celebrationPalette[0]],
});
attachBurstToControl(dailyBonusCloseButton, {
  count: 16,
  spread: 160,
  lift: 34,
  palette: [celebrationPalette[0], celebrationPalette[1], "#FFFFFF"],
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
  buildBonusPresentationState,
  bonusOffers,
  calculateBonusSpinCost,
  emitParticleBurst,
  fadeInElement,
  prefersReducedMotion,
  isMobileViewport,
  playBonusAudioCue,
  seedAmbientSparkles,
  triggerCelebration,
  triggerBonusSpinPresentation,
  updateBonusBuyDisplay,
  selectBonusOffer: (offerId) => {
    state.bonusBuy.selectedOfferId = offerId;
    updateBonusBuyDisplay();
    updateHud();
    updateControlStates();
  },
  clearBonusOffer: () => {
    state.bonusBuy.selectedOfferId = null;
    updateBonusBuyDisplay();
    updateHud();
    updateControlStates();
  },
  getMotionState: () => ({
    readyPulse: pulseAnimations.has(spinButton),
    pulseTargets: pulseAnimations.size,
    bounceTargets: bounceAnimations.size,
  }),
  getBonusState: () => ({
    selectedOfferId: state.bonusBuy.selectedOfferId,
    activeOfferId: state.bonusBuy.activeOfferId,
    lastAudioCue: state.bonusBuy.lastAudioCue,
    nextSpinDebit: nextSpinDebit(),
    reelStageClasses: Array.from(reelStage.classList),
    overlayText: {
      badge: bonusSpinBadge?.textContent || "",
      copy: bonusSpinCopy?.textContent || "",
      status: bonusBuyStatus?.textContent || "",
    },
  }),
  state,
};

window.addEventListener("resize", () => {
  seedAmbientSparkles();
  seedSparkles();
});
