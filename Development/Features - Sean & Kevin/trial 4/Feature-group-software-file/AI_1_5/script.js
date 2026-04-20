const {
  rows,
  reels,
  totalWays,
  spinCost: defaultSpinCost,
  startingTokens,
  symbols,
  payoutForMatch,
  createReelStrip,
} = window.SLOT_CONFIG;

const reelBoard = document.getElementById("reelBoard");
const coinRain = document.getElementById("coinRain");
const tokenCount = document.getElementById("tokenCount");
const spinCostDisplay = document.getElementById("spinCost");
const wayCount = document.getElementById("wayCount");
const lastAward = document.getElementById("lastAward");
const message = document.getElementById("message");
const breakdownList = document.getElementById("breakdownList");
const winMeta = document.getElementById("winMeta");
const spinButton = document.getElementById("spinButton");
const resetButton = document.getElementById("resetButton");
const costInput = document.getElementById("costInput");
const applyCostButton = document.getElementById("applyCostButton");
const autoSpinCountInput = document.getElementById("autoSpinCount");
const autoSpinCostInput = document.getElementById("autoSpinCost");
const autoSpinButton = document.getElementById("autoSpinButton");
const stopAutoSpinButton = document.getElementById("stopAutoSpinButton");
const autoSpinStatus = document.getElementById("autoSpinStatus");
const privacyModal = document.getElementById("privacyModal");
const privacyCheckbox = document.getElementById("privacyCheckbox");
const privacyAcceptButton = document.getElementById("privacyAcceptButton");
const reelStage = document.querySelector(".reel-stage");

const privacyStorageKey = "token-torrent-privacy-accepted";

const state = {
  tokens: startingTokens,
  currentSpinCost: defaultSpinCost,
  lastAward: 0,
  spinning: false,
  reelStrips: [],
  reelElements: [],
  tileElements: [],
  visibleGrid: [],
  autoSpin: {
    active: false,
    remaining: 0,
    cost: defaultSpinCost,
    stopRequested: false,
  },
};

function formatNumber(value) {
  return value.toLocaleString();
}

function randomInt(max) {
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function setMessage(text) {
  message.textContent = text;
}

function updateHud() {
  tokenCount.textContent = formatNumber(state.tokens);
  spinCostDisplay.textContent = formatNumber(state.currentSpinCost);
  wayCount.textContent = formatNumber(totalWays);
  lastAward.textContent = formatNumber(state.lastAward);
}

function updateAutoSpinStatus(text) {
  if (text) {
    autoSpinStatus.textContent = text;
    return;
  }

  if (state.autoSpin.active) {
    autoSpinStatus.textContent = `${state.autoSpin.remaining} spin${state.autoSpin.remaining === 1 ? "" : "s"} remaining at ${formatNumber(state.autoSpin.cost)} tokens each.`;
    return;
  }

  autoSpinStatus.textContent = "Auto spin idle.";
}

function updateControlStates() {
  const controlsLocked = state.spinning || state.autoSpin.active;

  spinButton.disabled = controlsLocked;
  applyCostButton.disabled = controlsLocked;
  autoSpinButton.disabled = controlsLocked;
  resetButton.disabled = state.spinning || state.autoSpin.active;
  stopAutoSpinButton.disabled = !state.autoSpin.active;

  costInput.disabled = controlsLocked;
  autoSpinCountInput.disabled = controlsLocked;
  autoSpinCostInput.disabled = controlsLocked;
}

function normalizePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function applySpinCost(value, syncAutoCost = false) {
  const normalizedCost = normalizePositiveInteger(value, state.currentSpinCost);
  state.currentSpinCost = normalizedCost;
  costInput.value = String(normalizedCost);

  if (syncAutoCost) {
    autoSpinCostInput.value = String(normalizedCost);
  }

  updateHud();
  return normalizedCost;
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function buildBoard() {
  reelBoard.textContent = "";
  state.reelElements = [];
  state.tileElements = [];

  for (let reelIndex = 0; reelIndex < reels; reelIndex += 1) {
    const reelColumn = document.createElement("div");
    reelColumn.className = "reel-column";
    reelColumn.setAttribute("aria-label", `Reel ${reelIndex + 1}`);

    const columnTiles = [];

    for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
      const tile = document.createElement("div");
      tile.className = "symbol-tile";
      tile.setAttribute("role", "presentation");
      reelColumn.append(tile);
      columnTiles.push(tile);
    }

    reelBoard.append(reelColumn);
    state.reelElements.push(reelColumn);
    state.tileElements.push(columnTiles);
  }
}

function randomWindowForStrip(strip) {
  const start = randomInt(strip.length);
  return Array.from({ length: rows }, (_, offset) => strip[(start + offset) % strip.length]);
}

function renderReel(reelIndex, reelSymbols) {
  reelSymbols.forEach((symbol, rowIndex) => {
    const tile = state.tileElements[reelIndex][rowIndex];
    tile.textContent = symbol.code;
    tile.title = symbol.name;
    tile.dataset.group = symbol.group === "high" ? "HIGH" : "LOW";
    tile.classList.toggle("group-high", symbol.group === "high");
    tile.classList.toggle("group-low", symbol.group === "low");
  });
}

function clearHighlights() {
  state.tileElements.flat().forEach((tile) => {
    tile.classList.remove("winner", "high-win");
  });
}

function applyHighlights(wins) {
  wins.forEach((win) => {
    win.positions.forEach(({ reelIndex, rowIndex }) => {
      const tile = state.tileElements[reelIndex][rowIndex];
      tile.classList.add("winner");

      if (win.symbol.group === "high") {
        tile.classList.add("high-win");
      }
    });
  });
}

function evaluateWins(gridByReel) {
  const wins = [];

  symbols.forEach((symbol) => {
    const positionsByReel = [];

    for (let reelIndex = 0; reelIndex < reels; reelIndex += 1) {
      const reelMatches = [];

      for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
        if (gridByReel[reelIndex][rowIndex].code === symbol.code) {
          reelMatches.push({ reelIndex, rowIndex });
        }
      }

      if (reelMatches.length === 0) {
        break;
      }

      positionsByReel.push(reelMatches);
    }

    if (positionsByReel.length >= 3) {
      const matchCount = positionsByReel.length;
      const ways = positionsByReel.reduce(
        (total, matchesOnReel) => total * matchesOnReel.length,
        1,
      );
      const lineAward = payoutForMatch(symbol, matchCount);
      const award = lineAward * ways;

      wins.push({
        symbol,
        matchCount,
        ways,
        lineAward,
        award,
        positions: positionsByReel.flat(),
      });
    }
  });

  wins.sort((left, right) => right.award - left.award);

  return {
    wins,
    totalAward: wins.reduce((total, win) => total + win.award, 0),
  };
}

function renderBreakdown(wins, totalAward) {
  breakdownList.textContent = "";

  if (wins.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent =
      "No 3-reel run from the left. The machine converted your budget into a stronger brand story.";
    breakdownList.append(empty);
    winMeta.textContent = "No multiway award this spin.";
    return;
  }

  winMeta.textContent = `${wins.length} payout${wins.length === 1 ? "" : "s"} for ${formatNumber(totalAward)} tokens.`;

  wins.forEach((win) => {
    const item = document.createElement("li");
    item.className = "breakdown-item";

    const main = document.createElement("div");
    main.className = "breakdown-main";
    main.innerHTML = `<strong>${win.symbol.code}</strong> across ${win.matchCount} reels`;

    const detail = document.createElement("div");
    detail.className = "breakdown-detail";
    detail.textContent = `${win.ways} way${win.ways === 1 ? "" : "s"} x ${formatNumber(win.lineAward)}`;

    const award = document.createElement("div");
    award.className = "breakdown-award";
    award.textContent = `${formatNumber(win.award)} tokens`;

    const textWrap = document.createElement("div");
    textWrap.append(main, detail);

    item.append(textWrap, award);
    breakdownList.append(item);
  });
}

function renderPendingBreakdown() {
  breakdownList.textContent = "";

  const pending = document.createElement("li");
  pending.className = "empty-state";
  pending.textContent =
    "Computing multiway awards. Please stand by while the machine invents a valuation.";
  breakdownList.append(pending);
  winMeta.textContent = "Evaluating 243 ways.";
}

function createCoinRain(amount) {
  coinRain.textContent = "";
  reelStage.classList.add("jackpot");

  const coinCount = Math.min(42, 18 + Math.floor(amount / 350));

  for (let index = 0; index < coinCount; index += 1) {
    const coin = document.createElement("div");
    coin.className = "coin";
    coin.textContent = "TOK";
    coin.style.left = `${randomInt(96)}%`;
    coin.style.setProperty("--drift", `${randomInt(160) - 80}px`);
    coin.style.setProperty("--fall-duration", `${1.8 + randomInt(8) * 0.15}s`);
    coin.style.animationDelay = `${index * 0.03}s`;
    coinRain.append(coin);
  }

  window.setTimeout(() => {
    coinRain.textContent = "";
    reelStage.classList.remove("jackpot");
  }, 3200);
}

function refreshReelStrips() {
  state.reelStrips = Array.from({ length: reels }, () => createReelStrip());
}

function seedBoard() {
  state.visibleGrid = state.reelStrips.map((strip, reelIndex) => {
    const windowSymbols = randomWindowForStrip(strip);
    renderReel(reelIndex, windowSymbols);
    return windowSymbols;
  });
}

function animateReel(reelIndex) {
  const reelElement = state.reelElements[reelIndex];
  const strip = state.reelStrips[reelIndex];
  const finalWindow = randomWindowForStrip(strip);
  const duration = 850 + reelIndex * 220;

  return new Promise((resolve) => {
    reelElement.classList.add("spinning");

    const shuffle = window.setInterval(() => {
      renderReel(reelIndex, randomWindowForStrip(strip));
    }, 90);

    window.setTimeout(() => {
      window.clearInterval(shuffle);
      reelElement.classList.remove("spinning");
      renderReel(reelIndex, finalWindow);
      resolve(finalWindow);
    }, duration);
  });
}

async function spin() {
  if (state.spinning) {
    return { completed: false, reason: "busy" };
  }

  const spinCost = state.currentSpinCost;

  if (state.tokens < spinCost) {
    setMessage("Not enough tokens for another spin. Refill the wallet and keep the hype alive.");
    return { completed: false, reason: "insufficient-funds" };
  }

  state.spinning = true;
  updateControlStates();
  clearHighlights();

  state.tokens -= spinCost;
  state.lastAward = 0;
  updateHud();
  renderPendingBreakdown();
  setMessage("Shuffling reel strips, rehearsing the keynote, and pricing the next token round...");

  const finalGrid = await Promise.all(
    Array.from({ length: reels }, (_, reelIndex) => animateReel(reelIndex)),
  );

  state.visibleGrid = finalGrid;

  const { wins, totalAward } = evaluateWins(finalGrid);
  state.tokens += totalAward;
  state.lastAward = totalAward;
  updateHud();
  renderBreakdown(wins, totalAward);

  if (totalAward > 0) {
    applyHighlights(wins);
  }

  if (totalAward > 1000) {
    createCoinRain(totalAward);
    setMessage(
      `Jackpot theater activated. You pulled in ${formatNumber(totalAward)} tokens and the machine responded with aggressive coin rain.`,
    );
  } else if (totalAward > 0) {
    setMessage(
      `You won ${formatNumber(totalAward)} tokens. The model claims this outcome was fully deterministic.`,
    );
  } else {
    setMessage("No award this time. Your tokens were sacrificed to the altar of confidence generation.");
  }

  if (state.tokens < spinCost) {
    setMessage(`${message.textContent} The balance is now too low for another spin.`);
  }

  state.spinning = false;
  updateControlStates();
  return { completed: true, totalAward };
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

    if (state.autoSpin.remaining > 0 && !state.autoSpin.stopRequested) {
      updateAutoSpinStatus();
      await delay(260);
    }
  }

  const spinsLeft = state.autoSpin.remaining;
  const stopRequested = state.autoSpin.stopRequested;

  state.autoSpin.active = false;
  state.autoSpin.stopRequested = false;
  updateAutoSpinStatus();
  updateControlStates();

  if (spinsLeft === 0) {
    setMessage(
      `Auto spin finished its run at ${formatNumber(state.currentSpinCost)} tokens per spin. The machine would like credit for your discipline.`,
    );
    return;
  }

  if (stopRequested) {
    setMessage("Auto spin stopped after the current reel cycle. Human supervision has returned.");
    return;
  }

  setMessage("Auto spin stopped because the token bank could not cover the next spin cost.");
}

function resetGame() {
  state.autoSpin.active = false;
  state.autoSpin.remaining = 0;
  state.autoSpin.stopRequested = false;
  state.tokens = startingTokens;
  state.lastAward = 0;
  state.spinning = false;
  clearHighlights();
  refreshReelStrips();
  seedBoard();
  updateHud();
  updateAutoSpinStatus();
  updateControlStates();
  breakdownList.textContent = "";

  const empty = document.createElement("li");
  empty.className = "empty-state";
  empty.textContent =
    "Fresh wallet loaded. The reels are reset and the investor deck has been updated.";
  breakdownList.append(empty);
  winMeta.textContent = "Need 3 consecutive reels from the left to pay.";
  setMessage("Fresh capital injected. The grid is ready for another deeply scientific session.");
}

function handleApplyCost() {
  const appliedCost = applySpinCost(costInput.value, true);
  updateAutoSpinStatus(
    `Manual spin cost updated to ${formatNumber(appliedCost)} tokens. Auto spin cost synced to match.`,
  );
  setMessage(
    `Spin cost changed to ${formatNumber(appliedCost)} tokens. The pricing committee feels powerful.`,
  );
}

async function startAutoSpin() {
  if (state.spinning || state.autoSpin.active) {
    return;
  }

  const spinCount = normalizePositiveInteger(autoSpinCountInput.value, 10);
  const autoCost = normalizePositiveInteger(autoSpinCostInput.value, state.currentSpinCost);

  autoSpinCountInput.value = String(spinCount);
  autoSpinCostInput.value = String(autoCost);
  applySpinCost(autoCost, false);

  if (state.tokens < autoCost) {
    setMessage("Auto spin could not start because the selected cost is higher than the current token bank.");
    updateAutoSpinStatus("Auto spin idle.");
    return;
  }

  state.autoSpin.active = true;
  state.autoSpin.remaining = spinCount;
  state.autoSpin.cost = autoCost;
  state.autoSpin.stopRequested = false;
  updateAutoSpinStatus();
  updateControlStates();
  setMessage(
    `Auto spin armed for ${formatNumber(spinCount)} spin${spinCount === 1 ? "" : "s"} at ${formatNumber(autoCost)} tokens each.`,
  );

  await runAutoSpin();
}

function stopAutoSpin() {
  if (!state.autoSpin.active) {
    return;
  }

  state.autoSpin.stopRequested = true;
  updateAutoSpinStatus("Stop requested. The machine will stop after the current spin finishes.");
}

function readStoredPrivacyConsent() {
  try {
    return window.localStorage.getItem(privacyStorageKey) === "accepted";
  } catch (error) {
    return false;
  }
}

function writeStoredPrivacyConsent() {
  try {
    window.localStorage.setItem(privacyStorageKey, "accepted");
  } catch (error) {
    return;
  }
}

function applyPrivacyModalState(accepted) {
  privacyModal.hidden = accepted;
  document.body.classList.toggle("modal-open", !accepted);
}

function initializePrivacyGate() {
  const hasConsent = readStoredPrivacyConsent();

  if (hasConsent) {
    applyPrivacyModalState(true);
    return;
  }

  applyPrivacyModalState(false);
  privacyCheckbox.checked = false;
  privacyAcceptButton.disabled = true;
}

buildBoard();
refreshReelStrips();
seedBoard();
applySpinCost(defaultSpinCost, true);
updateHud();
updateAutoSpinStatus();
updateControlStates();
initializePrivacyGate();

spinButton.addEventListener("click", spin);
resetButton.addEventListener("click", resetGame);
applyCostButton.addEventListener("click", handleApplyCost);
autoSpinButton.addEventListener("click", startAutoSpin);
stopAutoSpinButton.addEventListener("click", stopAutoSpin);
privacyCheckbox.addEventListener("change", () => {
  privacyAcceptButton.disabled = !privacyCheckbox.checked;
});
privacyAcceptButton.addEventListener("click", () => {
  if (!privacyCheckbox.checked) {
    return;
  }

  writeStoredPrivacyConsent();
  applyPrivacyModalState(true);
});
