const STORAGE_KEY = "token-tumbler-9000";

const SYMBOLS = [
  {
    key: "TOKEN",
    blurb: "A usable unit of synthetic hope.",
  },
  {
    key: "PROMPT",
    blurb: "A politely phrased plea for competence.",
  },
  {
    key: "GPU",
    blurb: "The glowing rectangle that eats budgets.",
  },
  {
    key: "AGENT",
    blurb: "An eager intern with terminal access.",
  },
  {
    key: "VC",
    blurb: "Temporary money disguised as destiny.",
  },
  {
    key: "HALLU",
    blurb: "Confident fiction at production speed.",
  },
  {
    key: "404",
    blurb: "Your result exists in another tab.",
  },
];

const PROFILES = {
  1: {
    name: "Dry run",
    cost: 8,
    multiplier: 1,
    risk: 12,
    weights: {
      TOKEN: 18,
      PROMPT: 17,
      GPU: 13,
      AGENT: 13,
      VC: 10,
      HALLU: 8,
      404: 9,
    },
  },
  2: {
    name: "Launch week",
    cost: 12,
    multiplier: 1.35,
    risk: 24,
    weights: {
      TOKEN: 16,
      PROMPT: 14,
      GPU: 13,
      AGENT: 13,
      VC: 11,
      HALLU: 11,
      404: 10,
    },
  },
  3: {
    name: "Series A",
    cost: 20,
    multiplier: 1.85,
    risk: 37,
    weights: {
      TOKEN: 13,
      PROMPT: 12,
      GPU: 14,
      AGENT: 12,
      VC: 12,
      HALLU: 18,
      404: 12,
    },
  },
  4: {
    name: "VC mode",
    cost: 30,
    multiplier: 2.45,
    risk: 53,
    weights: {
      TOKEN: 11,
      PROMPT: 10,
      GPU: 13,
      AGENT: 11,
      VC: 16,
      HALLU: 22,
      404: 17,
    },
  },
};

const DEFAULT_STATE = {
  balance: 120,
  totalSpent: 0,
  totalWon: 0,
  totalSpins: 0,
  bestWin: 0,
  hypeLevel: 2,
  soundEnabled: true,
  halluHits: 0,
  lastSymbols: ["PROMPT", "TOKEN", "GPU"],
  recentRuns: [],
};

const currency = new Intl.NumberFormat("en-US");

const tokenBalanceEl = document.querySelector("#token-balance");
const totalSpentEl = document.querySelector("#total-spent");
const bestWinEl = document.querySelector("#best-win");
const spinCostEl = document.querySelector("#spin-cost");
const modeNameEl = document.querySelector("#mode-name");
const totalSpinsEl = document.querySelector("#total-spins");
const statusLineEl = document.querySelector("#status-line");
const historyListEl = document.querySelector("#history-list");
const soundToggleEl = document.querySelector("#sound-toggle");
const spinButtonEl = document.querySelector("#spin-button");
const resetButtonEl = document.querySelector("#reset-button");
const hypeSliderEl = document.querySelector("#hype-level");
const hypeLabelEl = document.querySelector("#hype-label");
const hallucinationMeterEl = document.querySelector("#hallucination-meter");
const hallucinationValueEl = document.querySelector("#hallucination-value");
const hypeMeterEl = document.querySelector("#hype-meter");
const hypeValueEl = document.querySelector("#hype-value");
const contextMeterEl = document.querySelector("#context-meter");
const contextValueEl = document.querySelector("#context-value");
const machineCardEl = document.querySelector(".machine");
const heroCardEl = document.querySelector(".hero");
const bailoutDialogEl = document.querySelector("#bailout-dialog");
const claimBailoutEl = document.querySelector("#claim-bailout");
const restartRunEl = document.querySelector("#restart-run");
const reelEls = Array.from(document.querySelectorAll(".reel-face"));

let state = loadState();
let audioContext = null;
let isSpinning = false;

initialize();

function initialize() {
  hypeSliderEl.value = String(state.hypeLevel);
  bindEvents();
  renderReels(state.lastSymbols);
  render();
}

function bindEvents() {
  spinButtonEl.addEventListener("click", handleSpin);
  resetButtonEl.addEventListener("click", handleReset);
  soundToggleEl.addEventListener("click", toggleSound);
  hypeSliderEl.addEventListener("input", handleHypeChange);
  claimBailoutEl.addEventListener("click", claimBailout);
  restartRunEl.addEventListener("click", resetState);
  bailoutDialogEl.addEventListener("click", (event) => {
    if (event.target === bailoutDialogEl) {
      bailoutDialogEl.close();
    }
  });
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STATE };
    }

    const parsed = JSON.parse(raw);

    return {
      ...DEFAULT_STATE,
      ...parsed,
      recentRuns: Array.isArray(parsed.recentRuns) ? parsed.recentRuns.slice(0, 5) : [],
      lastSymbols:
        Array.isArray(parsed.lastSymbols) && parsed.lastSymbols.length === 3
          ? parsed.lastSymbols
          : DEFAULT_STATE.lastSymbols,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures so the game still works in restricted contexts.
  }
}

function getProfile() {
  const level = clamp(Number(state.hypeLevel) || DEFAULT_STATE.hypeLevel, 1, 4);
  state.hypeLevel = level;
  return PROFILES[level];
}

function formatTokens(value) {
  return `${currency.format(value)} tokens`;
}

function handleHypeChange(event) {
  state.hypeLevel = Number(event.target.value);
  saveState();
  render();
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  saveState();
  render();
}

function handleReset() {
  if (isSpinning) {
    return;
  }

  const confirmed = window.confirm(
    "Reset the token economy and erase your current streak?"
  );

  if (confirmed) {
    resetState();
  }
}

function resetState() {
  const soundEnabled = state.soundEnabled;
  state = {
    ...DEFAULT_STATE,
    soundEnabled,
  };
  hypeSliderEl.value = String(state.hypeLevel);

  if (bailoutDialogEl.open) {
    bailoutDialogEl.close();
  }

  saveState();
  renderReels(state.lastSymbols);
  setStatus("Fresh slate. The machine already misses your previous bad choices.", "win");
  render();
}

function claimBailout() {
  state.balance += 60;
  saveState();

  if (bailoutDialogEl.open) {
    bailoutDialogEl.close();
  }

  playToneSequence("bailout");
  setStatus("Bailout approved. Sixty rescue tokens have entered the chat.", "win");
  render();
}

async function handleSpin() {
  const profile = getProfile();

  if (isSpinning) {
    return;
  }

  if (state.balance < profile.cost) {
    openBailoutDialog();
    setStatus(
      "Not enough tokens. Even fake AI wealth eventually meets a runway problem.",
      "loss"
    );
    return;
  }

  isSpinning = true;
  state.balance -= profile.cost;
  state.totalSpent += profile.cost;
  state.totalSpins += 1;
  saveState();

  spinButtonEl.disabled = true;
  resetButtonEl.disabled = true;
  setStatus(
    `Spent ${formatTokens(profile.cost)}. The reels are generating suspicious confidence.`,
    "loss"
  );

  const result = rollReels(profile);
  playToneSequence("spin");
  await animateSpin(result);

  const outcome = evaluateSpin(result, profile);
  state.lastSymbols = result;
  state.halluHits += result.filter((symbol) => symbol === "HALLU").length;

  if (outcome.payout > 0) {
    state.balance += outcome.payout;
    state.totalWon += outcome.payout;
    state.bestWin = Math.max(state.bestWin, outcome.payout);
  }

  state.recentRuns = [
    {
      symbols: result,
      delta: outcome.payout - profile.cost,
      note: outcome.message,
    },
    ...state.recentRuns,
  ].slice(0, 5);

  saveState();
  render();
  celebrateOutcome(outcome);
  setStatus(
    `${outcome.message} ${outcome.payout > 0 ? `You pocket ${formatTokens(outcome.payout)}.` : "The machine keeps everything."}`,
    outcome.payout > 0 ? "win" : "loss"
  );

  isSpinning = false;
  spinButtonEl.disabled = false;
  resetButtonEl.disabled = false;
  render();

  if (state.balance < getProfile().cost) {
    openBailoutDialog();
  }
}

function render() {
  const profile = getProfile();
  const historyMarkup = state.recentRuns.length
    ? state.recentRuns
        .map((entry) => {
          const deltaClass = entry.delta >= 0 ? "is-positive" : "is-negative";
          const prefix = entry.delta >= 0 ? "+" : "";
          return `
            <li class="history-item">
              <div class="history-top">
                <span class="history-symbols">${entry.symbols.join(" / ")}</span>
                <span class="history-delta ${deltaClass}">${prefix}${currency.format(entry.delta)}</span>
              </div>
              <p class="history-note">${entry.note}</p>
            </li>
          `;
        })
        .join("")
    : '<li class="history-empty">No runs yet. The machine is still pretending to be ethical.</li>';

  tokenBalanceEl.textContent = formatTokens(state.balance);
  totalSpentEl.textContent = formatTokens(state.totalSpent);
  bestWinEl.textContent = formatTokens(state.bestWin);
  spinCostEl.textContent = formatTokens(profile.cost);
  modeNameEl.textContent = profile.name;
  totalSpinsEl.textContent = currency.format(state.totalSpins);
  historyListEl.innerHTML = historyMarkup;
  soundToggleEl.textContent = `Sound: ${state.soundEnabled ? "on" : "off"}`;
  soundToggleEl.setAttribute("aria-pressed", String(state.soundEnabled));
  spinButtonEl.disabled = isSpinning;
  resetButtonEl.disabled = isSpinning;
  spinButtonEl.textContent =
    state.balance < profile.cost ? "Get bailout tokens" : "Burn tokens and spin";
  hypeLabelEl.textContent = profile.name;

  renderMeters(profile);
}

function renderMeters(profile) {
  const recentLosses = state.recentRuns.filter((entry) => entry.delta < 0).length;
  const recentWins = state.recentRuns.filter((entry) => entry.delta >= 0).length;
  const averageSpend = state.totalSpins ? state.totalSpent / state.totalSpins : 0;

  const hallucination = clamp(
    profile.risk + state.halluHits * 2 + recentLosses * 6 - recentWins * 4,
    6,
    99
  );
  const hypeSaturation = clamp(
    profile.risk + state.totalSpins * 2 + Math.round(averageSpend),
    10,
    100
  );
  const contextHealth = clamp(
    88 - recentLosses * 9 + recentWins * 5 - Math.floor(state.totalSpins / 2),
    9,
    97
  );

  setMeter(hallucinationMeterEl, hallucinationValueEl, hallucination);
  setMeter(hypeMeterEl, hypeValueEl, hypeSaturation);
  setMeter(contextMeterEl, contextValueEl, contextHealth);
}

function setMeter(barEl, labelEl, value) {
  barEl.style.width = `${value}%`;
  labelEl.textContent = `${value}%`;
}

function setStatus(message, tone) {
  statusLineEl.textContent = message;
  statusLineEl.classList.remove("is-win", "is-loss");
  statusLineEl.classList.add(tone === "win" ? "is-win" : "is-loss");
}

function renderReels(symbolKeys) {
  symbolKeys.forEach((symbolKey, index) => {
    const symbol = SYMBOLS.find((entry) => entry.key === symbolKey) || SYMBOLS[0];
    const reelEl = reelEls[index];
    reelEl.querySelector(".reel-key").textContent = symbol.key;
    reelEl.querySelector(".reel-blurb").textContent = symbol.blurb;
  });
}

function rollReels(profile) {
  return [0, 1, 2].map(() => pickWeightedSymbol(profile.weights));
}

function pickWeightedSymbol(weights) {
  const entries = Object.entries(weights);
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const [symbol, weight] of entries) {
    random -= weight;
    if (random <= 0) {
      return symbol;
    }
  }

  return SYMBOLS[0].key;
}

function evaluateSpin(result, profile) {
  const counts = result.reduce((accumulator, symbol) => {
    accumulator[symbol] = (accumulator[symbol] || 0) + 1;
    return accumulator;
  }, {});
  const allSame = Object.values(counts).includes(3);
  const pair = Object.keys(counts).find((symbol) => counts[symbol] === 2);
  const sortedSignature = [...result].sort().join("|");

  if (result.includes("HALLU") && result.includes("404")) {
    return {
      payout: 0,
      message: "The model invented a jackpot and immediately lost the route to it.",
    };
  }

  if (allSame) {
    const symbol = result[0];
    return evaluateTriple(symbol, profile.multiplier);
  }

  if (sortedSignature === "AGENT|PROMPT|TOKEN") {
    return {
      payout: Math.round(72 * profile.multiplier),
      message: "Prompt plus token plus agent. Congratulations, you built a demo nobody can price.",
    };
  }

  if (counts.TOKEN === 2) {
    return {
      payout: Math.round(34 * profile.multiplier),
      message: "Two TOKENs. Enough traction to justify one more keynote slide.",
    };
  }

  if (counts.HALLU === 2) {
    return {
      payout: 0,
      message: "Double HALLU. The machine has switched from math to improv.",
    };
  }

  if (pair) {
    return {
      payout: Math.round(20 * profile.multiplier),
      message: `Pair of ${pair}. The machine calls that a pilot program.`,
    };
  }

  return {
    payout: 0,
    message: randomLossLine(),
  };
}

function evaluateTriple(symbol, multiplier) {
  const payouts = {
    TOKEN: {
      payout: Math.round(160 * multiplier),
      message: "Three TOKENs. For one radiant second, the business model looked real.",
    },
    GPU: {
      payout: Math.round(128 * multiplier),
      message: "Triple GPU. Your cloud invoice briefly pays you back.",
    },
    AGENT: {
      payout: Math.round(116 * multiplier),
      message: "Triple AGENT. The interns have unionized into a profit center.",
    },
    PROMPT: {
      payout: Math.round(96 * multiplier),
      message: "Triple PROMPT. You have successfully monetized asking nicely.",
    },
    VC: {
      payout: Math.round(88 * multiplier),
      message: "Triple VC. Someone funded the deck before reading the unit economics.",
    },
    "404": {
      payout: Math.round(36 * multiplier),
      message: "Triple 404. The prize was missing, but the excuse memo was excellent.",
    },
    HALLU: {
      payout: 0,
      message: "Triple HALLU. The machine says you won infinity, which is awkwardly non-transferable.",
    },
  };

  return payouts[symbol];
}

function randomLossLine() {
  const lines = [
    "No match. The machine recommends pivoting to enterprise.",
    "Nothing landed. Your valuation remains mostly narrative.",
    "Missed again. The deck was strong, the revenue less so.",
    "No payout. The AI assures you this counts as strategic learning.",
    "Blank spin. Somewhere a founder just called this product-market fit.",
  ];

  return lines[Math.floor(Math.random() * lines.length)];
}

async function animateSpin(result) {
  const animationPromises = reelEls.map((reelEl, index) =>
    animateReel(reelEl, result[index], 760 + index * 170)
  );

  await Promise.all(animationPromises);
}

function animateReel(reelEl, finalSymbolKey, duration) {
  return new Promise((resolve) => {
    const started = performance.now();
    const temporaryCycle = window.setInterval(() => {
      const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      reelEl.querySelector(".reel-key").textContent = randomSymbol.key;
      reelEl.querySelector(".reel-blurb").textContent = randomSymbol.blurb;
    }, 80);

    reelEl.animate(
      [
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-10px) scale(1.02)" },
        { transform: "translateY(10px) scale(0.98)" },
        { transform: "translateY(0) scale(1)" },
      ],
      {
        duration,
        easing: "ease-in-out",
      }
    );

    const finalize = () => {
      window.clearInterval(temporaryCycle);
      const symbol = SYMBOLS.find((entry) => entry.key === finalSymbolKey) || SYMBOLS[0];
      reelEl.querySelector(".reel-key").textContent = symbol.key;
      reelEl.querySelector(".reel-blurb").textContent = symbol.blurb;
      reelEl.animate(
        [{ transform: "scale(1.06)" }, { transform: "scale(1)" }],
        { duration: 220, easing: "ease-out" }
      );
      resolve();
    };

    const tick = () => {
      if (performance.now() - started >= duration) {
        finalize();
        return;
      }

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });
}

function celebrateOutcome(outcome) {
  if (outcome.payout > 0) {
    playToneSequence(outcome.payout >= 120 ? "jackpot" : "win");
    vibrateDevice(outcome.payout >= 120 ? [70, 40, 90] : [40, 20, 40]);
    flashCard(machineCardEl);
    flashCard(heroCardEl);
    return;
  }

  playToneSequence("loss");
  vibrateDevice([25]);
}

function flashCard(cardEl) {
  cardEl.classList.add("flash-win");
  cardEl.animate(
    [
      { transform: "translateY(0)" },
      { transform: "translateY(-4px)" },
      { transform: "translateY(0)" },
    ],
    { duration: 360, easing: "ease-out" }
  );

  window.setTimeout(() => {
    cardEl.classList.remove("flash-win");
  }, 420);
}

function openBailoutDialog() {
  if (typeof bailoutDialogEl.showModal === "function" && !bailoutDialogEl.open) {
    bailoutDialogEl.showModal();
  }
}

function vibrateDevice(pattern) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function playToneSequence(kind) {
  if (!state.soundEnabled) {
    return;
  }

  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) {
    return;
  }

  if (!audioContext) {
    audioContext = new AudioCtor();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const toneMap = {
    spin: [
      [180, 0.06, 0, "square", 0.018],
      [240, 0.05, 0.08, "triangle", 0.015],
    ],
    win: [
      [360, 0.08, 0, "triangle", 0.024],
      [520, 0.09, 0.1, "triangle", 0.024],
      [660, 0.12, 0.2, "triangle", 0.02],
    ],
    jackpot: [
      [420, 0.09, 0, "sawtooth", 0.02],
      [620, 0.11, 0.11, "triangle", 0.022],
      [820, 0.14, 0.24, "triangle", 0.022],
      [1020, 0.18, 0.39, "sine", 0.018],
    ],
    loss: [[150, 0.1, 0, "sine", 0.018]],
    bailout: [
      [280, 0.08, 0, "triangle", 0.02],
      [420, 0.11, 0.1, "triangle", 0.02],
    ],
  };

  const now = audioContext.currentTime;
  const sequence = toneMap[kind] || [];

  sequence.forEach(([frequency, duration, offset, type, volume]) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(volume, now + offset + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now + offset);
    oscillator.stop(now + offset + duration);
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Math.round(value)));
}
