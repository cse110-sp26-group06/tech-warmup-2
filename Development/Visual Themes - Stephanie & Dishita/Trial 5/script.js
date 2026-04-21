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
const sparkleField = document.getElementById("sparkleField");
const coinRain = document.getElementById("coinRain");
const tokenCount = document.getElementById("tokenCount");
const spinCostDisplay = document.getElementById("spinCostDisplay");
const queueCount = document.getElementById("queueCount");
const lastAward = document.getElementById("lastAward");
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
const lineLegend = document.getElementById("lineLegend");
const privacyModal = document.getElementById("privacyModal");
const privacyCheckbox = document.getElementById("privacyCheckbox");
const termsCheckbox = document.getElementById("termsCheckbox");
const privacyAcceptButton = document.getElementById("privacyAcceptButton");
const locationButton = document.getElementById("locationButton");
const locationFeedback = document.getElementById("locationFeedback");
const stateSelect = document.getElementById("stateSelect");

const consentStorageKey = "prompt-drop-consent-v1";

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

function setMessage(text) {
  message.textContent = text;
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
  tokenCount.textContent = formatNumber(state.tokens);
  spinCostDisplay.textContent = formatNumber(state.spinCost);
  queueCount.textContent = formatNumber(
    state.autoSpin.active ? state.autoSpin.remaining : currentAutoSpinSelection(),
  );
  lastAward.textContent = formatNumber(state.lastAward);
  locationStatus.textContent = state.consent.locationLabel;
}

function updateSliderLabels() {
  costSliderValue.textContent = formatNumber(state.spinCost);
  autoSpinValue.textContent = formatNumber(currentAutoSpinSelection());
}

function updateAutoSpinStatus(text) {
  if (text) {
    autoSpinStatus.textContent = text;
    return;
  }

  if (!state.autoSpin.active) {
    autoSpinStatus.textContent = "Auto spin idle.";
    return;
  }

  autoSpinStatus.textContent = `${state.autoSpin.remaining} spin${state.autoSpin.remaining === 1 ? "" : "s"} remaining at ${formatNumber(state.autoSpin.cost)} tokens each.`;
}

function updateControlStates() {
  const locked = state.spinning || state.autoSpin.active || !state.consent.accepted;

  spinButton.disabled = locked;
  autoSpinButton.disabled = locked;
  resetButton.disabled = state.spinning || state.autoSpin.active;
  stopAutoSpinButton.disabled = !state.autoSpin.active;
  costSlider.disabled = locked;
  autoSpinSlider.disabled = locked;
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

function buildLineLegend() {
  lineLegend.textContent = "";

  paylines.forEach((line, index) => {
    const item = document.createElement("li");
    item.className = "line-item";
    item.dataset.lineId = line.id;
    item.style.setProperty("--line-accent", `hsl(${(index * 33) % 360} 85% 64%)`);

    const swatch = document.createElement("span");
    swatch.className = "line-swatch";

    const label = document.createElement("div");
    label.className = "line-copy";
    label.innerHTML = `<strong>${line.name}</strong><span>${line.cells.length} spots</span>`;

    item.append(swatch, label);
    lineLegend.append(item);
  });
}

function clearHighlights() {
  state.tileElements.flat().forEach((tile) => {
    tile.classList.remove("is-paid", "is-candidate");
  });

  lineLegend.querySelectorAll(".line-item").forEach((item) => {
    item.classList.remove("active");
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

  const legendItem = lineLegend.querySelector(`[data-line-id="${paidWin.line.id}"]`);

  if (legendItem) {
    legendItem.classList.add("active");
  }
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

function renderPendingBreakdown() {
  breakdownList.textContent = "";

  const item = document.createElement("li");
  item.className = "empty-state";
  item.textContent =
    "Spinning up a fresh narrative. The machine is benchmarking your luck against pure confidence.";
  breakdownList.append(item);
  winMeta.textContent = "Evaluating the best straight-line award.";
}

function renderIdleBreakdown() {
  breakdownList.textContent = "";

  const item = document.createElement("li");
  item.className = "empty-state";
  item.textContent =
    "Nothing has paid yet. The machine is stretching, preheating, and inventing a story about future upside.";
  breakdownList.append(item);
  winMeta.textContent = "Waiting for the first spin.";
}

function renderBreakdown(paidWin, candidates) {
  breakdownList.textContent = "";

  if (!paidWin) {
    const item = document.createElement("li");
    item.className = "empty-state";
    item.textContent =
      "No qualifying line. The tokens were immediately reclassified as model-training overhead.";
    breakdownList.append(item);
    winMeta.textContent = "No line reached 3 matching symbols.";
    return;
  }

  const paidItem = document.createElement("li");
  paidItem.className = "breakdown-item paid-item";
  paidItem.innerHTML = `
    <div class="breakdown-copy">
      <strong>Paid: ${paidWin.line.name}</strong>
      <span>${paidWin.symbol.name} ${paidWin.matchCount} in a row for ${paidWin.multiplier}x</span>
    </div>
    <div class="breakdown-award">${formatNumber(paidWin.award)} tokens</div>
  `;
  breakdownList.append(paidItem);

  candidates.slice(1).forEach((candidate) => {
    const item = document.createElement("li");
    item.className = "breakdown-item shadow-item";
    item.innerHTML = `
      <div class="breakdown-copy">
        <strong>Seen but unpaid: ${candidate.line.name}</strong>
        <span>${candidate.symbol.name} ${candidate.matchCount} in a row for ${candidate.multiplier}x</span>
      </div>
      <div class="breakdown-award">Shadow win</div>
    `;
    breakdownList.append(item);
  });

  winMeta.textContent = `${paidWin.line.name} billed at ${paidWin.multiplier}x. The house ignored ${candidates.length - 1} other qualifying line${candidates.length === 2 ? "" : "s"}.`;
}

function clearCelebration() {
  reelStage.classList.remove("sparkling", "jackpot");
  coinRain.textContent = "";

  if (state.activeCelebrationTimer) {
    window.clearTimeout(state.activeCelebrationTimer);
    state.activeCelebrationTimer = null;
  }
}

function createCoinRain(multiplier) {
  coinRain.textContent = "";

  const coinCount = Math.min(48, 14 + multiplier);

  for (let index = 0; index < coinCount; index += 1) {
    const coin = document.createElement("div");
    coin.className = "coin";
    coin.textContent = "TOK";
    coin.style.left = `${randomInt(96)}%`;
    coin.style.setProperty("--drift", `${randomInt(160) - 80}px`);
    coin.style.setProperty("--fall-duration", `${1.8 + randomInt(8) * 0.15}s`);
    coin.style.animationDelay = `${index * 0.04}s`;
    coinRain.append(coin);
  }
}

function triggerCelebration(paidWin) {
  clearCelebration();

  if (!paidWin) {
    return;
  }

  if (paidWin.multiplier >= 16) {
    reelStage.classList.add("sparkling");
  }

  if (paidWin.multiplier >= 30) {
    reelStage.classList.add("jackpot");
    createCoinRain(paidWin.multiplier);
  }

  if (paidWin.multiplier >= 16) {
    state.activeCelebrationTimer = window.setTimeout(() => {
      clearCelebration();
    }, 3200);
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

function animateColumn(colIndex, finalColumn) {
  const reelElement = state.reelElements[colIndex];
  const duration = 700 + colIndex * 180;

  return new Promise((resolve) => {
    reelElement.classList.add("spinning");

    const shuffler = window.setInterval(() => {
      const randomColumn = createRandomColumn();

      for (let row = 0; row < rows; row += 1) {
        renderTile(state.tileElements[colIndex][row], randomColumn[row]);
      }
    }, 90);

    window.setTimeout(() => {
      window.clearInterval(shuffler);
      reelElement.classList.remove("spinning");

      for (let row = 0; row < rows; row += 1) {
        renderTile(state.tileElements[colIndex][row], finalColumn[row]);
      }

      resolve();
    }, duration);
  });
}

async function spin() {
  if (state.spinning || !state.consent.accepted) {
    return { completed: false };
  }

  if (state.tokens < state.spinCost) {
    setMessage("Not enough tokens. Refill the wallet and pretend the burn rate was intentional.");
    return { completed: false };
  }

  state.spinning = true;
  updateControlStates();
  clearHighlights();
  clearCelebration();

  state.tokens -= state.spinCost;
  state.lastAward = 0;
  updateHud();
  renderPendingBreakdown();
  setMessage("The reels are consulting a large model trained mostly on confidence and copper wire...");

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
  applyHighlights(paidWin, candidates);
  triggerCelebration(paidWin);

  if (!paidWin) {
    setMessage("No line paid. The machine converted your spend into a stronger thought-leadership strategy.");
  } else if (paidWin.multiplier >= 30) {
    setMessage(
      `Massive hit: ${paidWin.line.name} landed ${paidWin.symbol.name} for ${paidWin.multiplier}x. Coin rain deployed like a totally reasonable KPI.`,
    );
  } else if (paidWin.multiplier >= 16) {
    setMessage(
      `Premium win: ${paidWin.symbol.name} connected on ${paidWin.line.name} for ${formatNumber(paidWin.award)} tokens. The background sparkles insist this is product-market fit.`,
    );
  } else {
    setMessage(
      `You banked ${formatNumber(paidWin.award)} tokens on ${paidWin.line.name}. The machine would like to call that a breakthrough.`,
    );
  }

  state.spinning = false;
  updateControlStates();
  return { completed: true, paidWin };
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
    setMessage("Auto spin finished. The machine respectfully suggests another round of irresponsible token management.");
    return;
  }

  if (stoppedByUser) {
    setMessage("Auto spin stopped after the current cycle. Human oversight has been restored.");
    return;
  }

  setMessage("Auto spin halted because the wallet could not cover the next spin.");
}

async function startAutoSpin() {
  if (state.spinning || state.autoSpin.active || !state.consent.accepted) {
    return;
  }

  const selectedCount = currentAutoSpinSelection();

  if (state.tokens < state.spinCost) {
    setMessage("Auto spin could not start because the current spin cost is higher than the token wallet.");
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
    `Auto spin armed for ${formatNumber(selectedCount)} spin${selectedCount === 1 ? "" : "s"} at ${formatNumber(state.spinCost)} tokens each.`,
  );

  await runAutoSpin();
}

function stopAutoSpin() {
  if (!state.autoSpin.active) {
    return;
  }

  state.autoSpin.stopRequested = true;
  updateAutoSpinStatus("Stop requested. The queue will end after the current spin.");
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
  setMessage("Fresh fake capital loaded. The machine is ready to ruin it all over again.");
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
    ? "No location shared yet. You can also choose your state manually."
    : `${state.consent.locationLabel}. ${complianceReminder}`;
  updateHud();
}

function applyConsentState(accepted) {
  state.consent.accepted = accepted;
  privacyModal.hidden = accepted;
  document.body.classList.toggle("modal-open", !accepted);
  updateControlStates();
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
      "This browser does not expose device location. Pick your state manually to continue.";
    return;
  }

  locationButton.disabled = true;
  locationFeedback.textContent = "Requesting device location...";

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
      state.consent.locationLabel = `Shared: ${latitude}, ${longitude}`;
      locationButton.disabled = false;
      updateLocationFeedback();
      updateConsentButtonState();
    },
    () => {
      locationButton.disabled = false;
      locationFeedback.textContent =
        "Location share was denied or unavailable. Pick your state manually to continue.";
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

buildBoard();
buildLineLegend();
seedSparkles();
seedBoard();
populateStateSelect();
initializeSliders();
updateHud();
updateAutoSpinStatus();
renderIdleBreakdown();
initializeConsent();

costSlider.addEventListener("input", () => {
  state.spinCost = clampNumber(
    Number.parseInt(costSlider.value, 10) || defaultSpinCost,
    minSpinCost,
    maxSpinCost,
  );
  updateSliderLabels();
  updateHud();
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
  setMessage("Consent recorded. The token machine is now cleared for deeply unserious business.");
});
