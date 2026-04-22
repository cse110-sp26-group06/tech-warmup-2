const SLOT_CONFIG = {
  STORAGE_KEY: "golden-grid-multiway",
  INFO_PAGE: "paytable.html",
  GRID_ROWS: 3,
  GRID_REELS: 5,
  SPIN_COST: 45,
  STARTING_BALANCE: 2500,
  COIN_RAIN_THRESHOLD: 1000,
  GROUP_FREQUENCIES: {
    high: 1,
    low: 6,
  },
  MATCH_MULTIPLIERS: {
    3: 1,
    4: 2,
    5: 4,
  },
  REEL_SEEDS: [11, 23, 37, 49, 61],
  SYMBOLS: [
    {
      id: "spark",
      short: "SPK",
      label: "Spark",
      group: "low",
      award3: 60,
    },
    {
      id: "bell",
      short: "BEL",
      label: "Bell",
      group: "low",
      award3: 100,
    },
    {
      id: "bar",
      short: "BAR",
      label: "Bar",
      group: "low",
      award3: 140,
    },
    {
      id: "luck",
      short: "LCK",
      label: "Lucky",
      group: "low",
      award3: 180,
    },
    {
      id: "orbit",
      short: "ORB",
      label: "Orbit",
      group: "high",
      award3: 1200,
    },
    {
      id: "crown",
      short: "CRN",
      label: "Crown",
      group: "high",
      award3: 1600,
    },
    {
      id: "comet",
      short: "CMT",
      label: "Comet",
      group: "high",
      award3: 2200,
    },
  ],
  DEFAULT_STATE: {
    balance: 2500,
    totalSpent: 0,
    totalWon: 0,
    totalSpins: 0,
    bestWin: 0,
    soundEnabled: true,
    board: [],
    lastOutcome: null,
    recentSpins: [],
  },
};

if (typeof window !== "undefined") {
  window.SLOT_CONFIG = SLOT_CONFIG;
}

const appRootEl = document.querySelector("[data-slot-app]");

if (appRootEl) {
  initializeSlotApp(appRootEl);
}

function initializeSlotApp(rootEl) {
  const symbolMap = new Map(SLOT_CONFIG.SYMBOLS.map((symbol) => [symbol.id, symbol]));
  const reelStrips = buildReelStrips(SLOT_CONFIG);
  const refs = {
    boardGrid: rootEl.querySelector("#board-grid"),
    balance: rootEl.querySelector("#token-balance"),
    totalWon: rootEl.querySelector("#total-won"),
    bestWin: rootEl.querySelector("#best-win"),
    totalSpins: rootEl.querySelector("#total-spins"),
    spinCost: rootEl.querySelector("#spin-cost"),
    lastAward: rootEl.querySelector("#last-award"),
    lastWays: rootEl.querySelector("#last-ways"),
    awardBreakdown: rootEl.querySelector("#award-breakdown"),
    historyList: rootEl.querySelector("#history-list"),
    statusLine: rootEl.querySelector("#status-line"),
    soundToggle: rootEl.querySelector("#sound-toggle"),
    spinButton: rootEl.querySelector("#spin-button"),
    resetButton: rootEl.querySelector("#reset-button"),
    infoButton: rootEl.querySelector("#info-button"),
    machineCard: rootEl.querySelector(".machine"),
    heroCard: rootEl.querySelector(".hero"),
    coinRain: document.querySelector("#coin-rain"),
  };
  const cellEls = buildBoardCells(refs.boardGrid);
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let state = loadState(reelStrips);
  let audioContext = null;
  let isSpinning = false;
  let statusMessage = state.lastOutcome.summary;
  let statusTone = state.recentSpins.length
    ? state.recentSpins[0].payout > 0
      ? "win"
      : "loss"
    : "neutral";

  bindEvents();
  render();

  function bindEvents() {
    refs.spinButton.addEventListener("click", handleSpin);
    refs.resetButton.addEventListener("click", handleReset);
    refs.soundToggle.addEventListener("click", toggleSound);
    refs.infoButton.addEventListener("click", openInfoPage);
  }

  function loadState(strips) {
    const fallbackState = createFreshState(strips, SLOT_CONFIG.DEFAULT_STATE.soundEnabled);

    try {
      const raw = window.localStorage.getItem(SLOT_CONFIG.STORAGE_KEY);
      if (!raw) {
        return fallbackState;
      }

      const parsed = JSON.parse(raw);
      const lastOutcome = normalizeOutcome(parsed.lastOutcome);
      const recentSpins = Array.isArray(parsed.recentSpins) ? parsed.recentSpins.slice(0, 6) : [];

      return {
        ...fallbackState,
        ...parsed,
        soundEnabled:
          typeof parsed.soundEnabled === "boolean"
            ? parsed.soundEnabled
            : fallbackState.soundEnabled,
        board: isValidBoard(parsed.board) ? parsed.board : fallbackState.board,
        lastOutcome,
        recentSpins,
      };
    } catch {
      return fallbackState;
    }
  }

  function createFreshState(strips, soundEnabled) {
    return {
      balance: SLOT_CONFIG.STARTING_BALANCE,
      totalSpent: 0,
      totalWon: 0,
      totalSpins: 0,
      bestWin: 0,
      soundEnabled,
      board: generateRandomBoard(strips, SLOT_CONFIG),
      lastOutcome: createEmptyOutcome(),
      recentSpins: [],
    };
  }

  function normalizeOutcome(outcome) {
    if (!outcome || typeof outcome !== "object") {
      return createEmptyOutcome();
    }

    return {
      totalAward: Number(outcome.totalAward) || 0,
      totalWays: Number(outcome.totalWays) || 0,
      summary:
        typeof outcome.summary === "string" && outcome.summary
          ? outcome.summary
          : createEmptyOutcome().summary,
      wins: Array.isArray(outcome.wins) ? outcome.wins.slice(0, SLOT_CONFIG.SYMBOLS.length) : [],
    };
  }

  function saveState() {
    try {
      window.localStorage.setItem(SLOT_CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage failures so the app still runs in restricted contexts.
    }
  }

  function render() {
    const winningSet = buildWinningPositionSet(state.lastOutcome.wins);

    renderBoard(state.board, winningSet);
    renderAwardBreakdown(state.lastOutcome.wins);
    renderHistory(state.recentSpins);

    refs.balance.textContent = formatCredits(state.balance);
    refs.totalWon.textContent = formatCredits(state.totalWon);
    refs.bestWin.textContent = formatCredits(state.bestWin);
    refs.totalSpins.textContent = formatNumber(state.totalSpins);
    refs.spinCost.textContent = formatCredits(SLOT_CONFIG.SPIN_COST);
    refs.lastAward.textContent = formatCredits(state.lastOutcome.totalAward);
    refs.lastWays.textContent = formatNumber(state.lastOutcome.totalWays);
    refs.soundToggle.textContent = `Sound: ${state.soundEnabled ? "on" : "off"}`;
    refs.soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
    refs.spinButton.disabled = isSpinning || state.balance < SLOT_CONFIG.SPIN_COST;
    refs.resetButton.disabled = isSpinning;
    refs.spinButton.textContent =
      state.balance < SLOT_CONFIG.SPIN_COST ? "Reset bank to spin" : "Spin the 3x5 grid";

    setStatus(statusMessage, statusTone);
  }

  function renderBoard(board, winningSet) {
    for (let row = 0; row < SLOT_CONFIG.GRID_ROWS; row += 1) {
      for (let reel = 0; reel < SLOT_CONFIG.GRID_REELS; reel += 1) {
        const symbolId = board[row][reel];
        const symbol = symbolMap.get(symbolId) || SLOT_CONFIG.SYMBOLS[0];
        const cellEl = cellEls[row][reel];
        const key = buildPositionKey(row, reel);

        cellEl.classList.remove("is-high", "is-low", "is-winning");
        cellEl.classList.add(symbol.group === "high" ? "is-high" : "is-low");
        cellEl.classList.toggle("is-winning", winningSet.has(key));
        cellEl.querySelector(".slot-mark").textContent = symbol.short;
        cellEl.querySelector(".slot-name").textContent = symbol.label;
        cellEl.querySelector(".slot-meta").textContent =
          symbol.group === "high" ? "High award" : "Low award";
        cellEl.setAttribute("aria-label", `${symbol.label} symbol`);
      }
    }
  }

  function renderAwardBreakdown(wins) {
    refs.awardBreakdown.replaceChildren();

    if (!wins.length) {
      const emptyEl = document.createElement("p");
      emptyEl.className = "empty-state";
      emptyEl.textContent = "No multiway award yet. Match 3 reels from the left to get paid.";
      refs.awardBreakdown.appendChild(emptyEl);
      return;
    }

    wins.forEach((win) => {
      const symbol = symbolMap.get(win.symbolId);
      const awardEl = document.createElement("article");
      awardEl.className = "award-item";
      awardEl.innerHTML = `
        <div class="award-top">
          <div>
            <div class="award-title">${symbol.short} ${symbol.label}</div>
            <div class="award-meta">${win.matchCount} reels x ${formatNumber(win.ways)} ways x ${formatCredits(win.awardPerWay)} per way</div>
          </div>
          <div class="award-value">${formatCredits(win.totalAward)}</div>
        </div>
      `;
      refs.awardBreakdown.appendChild(awardEl);
    });
  }

  function renderHistory(spins) {
    refs.historyList.replaceChildren();

    if (!spins.length) {
      const emptyEl = document.createElement("li");
      emptyEl.className = "history-empty";
      emptyEl.textContent = "No spins yet. The first 3-reel chain is still waiting.";
      refs.historyList.appendChild(emptyEl);
      return;
    }

    spins.forEach((entry) => {
      const historyEl = document.createElement("li");
      const deltaClass = entry.net >= 0 ? "is-positive" : "is-negative";
      const prefix = entry.net >= 0 ? "+" : "";

      historyEl.className = "history-item";
      historyEl.innerHTML = `
        <div class="history-top">
          <span class="award-title">${formatCredits(entry.payout)}</span>
          <span class="history-delta ${deltaClass}">${prefix}${formatCredits(entry.net)}</span>
        </div>
        <p class="history-note">${entry.summary}</p>
      `;

      refs.historyList.appendChild(historyEl);
    });
  }

  function setStatus(message, tone) {
    refs.statusLine.textContent = message;
    refs.statusLine.classList.remove("is-neutral", "is-win", "is-loss");
    refs.statusLine.classList.add(
      tone === "win" ? "is-win" : tone === "loss" ? "is-loss" : "is-neutral"
    );
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    render();
  }

  function openInfoPage() {
    const openedWindow = window.open(SLOT_CONFIG.INFO_PAGE, "_blank", "noopener");

    if (!openedWindow) {
      window.location.href = SLOT_CONFIG.INFO_PAGE;
    }
  }

  function handleReset() {
    if (isSpinning) {
      return;
    }

    const confirmed = window.confirm("Reset the bank, board, and spin history?");
    if (!confirmed) {
      return;
    }

    state = createFreshState(reelStrips, state.soundEnabled);
    statusMessage = "Fresh bankroll loaded. Match 3 reels from the left to start paying.";
    statusTone = "neutral";
    saveState();
    render();
  }

  async function handleSpin() {
    if (isSpinning) {
      return;
    }

    if (state.balance < SLOT_CONFIG.SPIN_COST) {
      statusMessage = `You need ${formatCredits(SLOT_CONFIG.SPIN_COST)} to spin. Reset the bank to continue.`;
      statusTone = "loss";
      render();
      return;
    }

    isSpinning = true;
    state.balance -= SLOT_CONFIG.SPIN_COST;
    state.totalSpent += SLOT_CONFIG.SPIN_COST;
    state.totalSpins += 1;
    saveState();

    statusMessage = "Reels are locking in. Multiway awards begin at 3 consecutive reels.";
    statusTone = "neutral";
    render();

    const nextBoard = generateRandomBoard(reelStrips, SLOT_CONFIG);
    playToneSequence("spin");
    await animateBoard(nextBoard);

    const outcome = evaluateBoard(nextBoard, SLOT_CONFIG);
    state.board = nextBoard;
    state.lastOutcome = outcome;

    if (outcome.totalAward > 0) {
      state.balance += outcome.totalAward;
      state.totalWon += outcome.totalAward;
      state.bestWin = Math.max(state.bestWin, outcome.totalAward);
    }

    state.recentSpins = [
      {
        payout: outcome.totalAward,
        net: outcome.totalAward - SLOT_CONFIG.SPIN_COST,
        summary: outcome.summary,
      },
      ...state.recentSpins,
    ].slice(0, 6);

    saveState();

    statusMessage =
      outcome.totalAward > 0
        ? `${outcome.summary} Total payout: ${formatCredits(outcome.totalAward)}.`
        : `${outcome.summary} No payout this spin.`;
    statusTone = outcome.totalAward > 0 ? "win" : "loss";

    isSpinning = false;
    render();
    celebrateOutcome(outcome);
  }

  async function animateBoard(finalBoard) {
    if (prefersReducedMotion) {
      renderBoard(finalBoard, new Set());
      return;
    }

    const columns = boardToColumns(finalBoard);
    await Promise.all(
      columns.map((column, reelIndex) => animateReelColumn(reelIndex, column, 620 + reelIndex * 120))
    );
  }

  function animateReelColumn(reelIndex, finalColumn, duration) {
    return new Promise((resolve) => {
      const startedAt = performance.now();
      const reelCellEls = [0, 1, 2].map((row) => cellEls[row][reelIndex]);
      const intervalId = window.setInterval(() => {
        const randomColumn = getRandomColumnFromStrip(reelStrips[reelIndex]);
        applyColumn(reelIndex, randomColumn);
      }, 85);

      reelCellEls.forEach((cellEl, rowIndex) => {
        cellEl.animate(
          [
            { transform: "translateY(0) scale(1)" },
            { transform: "translateY(-8px) scale(1.03)" },
            { transform: "translateY(8px) scale(0.97)" },
            { transform: "translateY(0) scale(1)" },
          ],
          {
            duration,
            delay: rowIndex * 35,
            easing: "ease-in-out",
          }
        );
      });

      const tick = () => {
        if (performance.now() - startedAt >= duration) {
          window.clearInterval(intervalId);
          applyColumn(reelIndex, finalColumn);
          resolve();
          return;
        }

        window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    });
  }

  function applyColumn(reelIndex, symbolIds) {
    symbolIds.forEach((symbolId, rowIndex) => {
      const symbol = symbolMap.get(symbolId) || SLOT_CONFIG.SYMBOLS[0];
      const cellEl = cellEls[rowIndex][reelIndex];
      cellEl.classList.remove("is-high", "is-low", "is-winning");
      cellEl.classList.add(symbol.group === "high" ? "is-high" : "is-low");
      cellEl.querySelector(".slot-mark").textContent = symbol.short;
      cellEl.querySelector(".slot-name").textContent = symbol.label;
      cellEl.querySelector(".slot-meta").textContent =
        symbol.group === "high" ? "High award" : "Low award";
    });
  }

  function celebrateOutcome(outcome) {
    if (outcome.totalAward > 0) {
      playToneSequence(
        outcome.totalAward > SLOT_CONFIG.COIN_RAIN_THRESHOLD ? "jackpot" : "win"
      );
      vibrateDevice(
        outcome.totalAward > SLOT_CONFIG.COIN_RAIN_THRESHOLD ? [80, 40, 120] : [40, 20, 40]
      );
      flashCard(refs.machineCard);
      flashCard(refs.heroCard);

      if (outcome.totalAward > SLOT_CONFIG.COIN_RAIN_THRESHOLD) {
        launchCoinRain(outcome.totalAward);
      }
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

  function launchCoinRain(totalAward) {
    refs.coinRain.replaceChildren();

    const coinCount = clamp(Math.floor(totalAward / 180), 18, 42);
    for (let index = 0; index < coinCount; index += 1) {
      const coinEl = document.createElement("span");
      const duration = 1200 + Math.random() * 900;
      const delay = Math.random() * 280;
      const drift = -140 + Math.random() * 280;
      const rotation = -540 + Math.random() * 1080;
      const size = 12 + Math.random() * 18;

      coinEl.className = "coin-chip";
      coinEl.style.left = `${Math.random() * 100}%`;
      coinEl.style.setProperty("--coin-size", `${size}px`);
      refs.coinRain.appendChild(coinEl);

      const animation = coinEl.animate(
        [
          { transform: "translate3d(0, -12vh, 0) rotate(0deg)", opacity: 0 },
          { transform: "translate3d(0, 5vh, 0) rotate(120deg)", opacity: 1, offset: 0.15 },
          {
            transform: `translate3d(${drift}px, 110vh, 0) rotate(${rotation}deg)`,
            opacity: 1,
          },
        ],
        {
          duration,
          delay,
          easing: "cubic-bezier(.2,.8,.28,1)",
          fill: "forwards",
        }
      );

      animation.finished.finally(() => {
        coinEl.remove();
      });
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
        [160, 0.05, 0, "square", 0.016],
        [210, 0.05, 0.08, "square", 0.014],
        [260, 0.06, 0.16, "triangle", 0.014],
      ],
      win: [
        [360, 0.08, 0, "triangle", 0.022],
        [520, 0.1, 0.1, "triangle", 0.022],
        [700, 0.12, 0.22, "sine", 0.018],
      ],
      jackpot: [
        [420, 0.08, 0, "sawtooth", 0.018],
        [630, 0.12, 0.08, "triangle", 0.022],
        [860, 0.14, 0.22, "triangle", 0.022],
        [1120, 0.2, 0.4, "sine", 0.018],
      ],
      loss: [[140, 0.12, 0, "sine", 0.018]],
    };

    const sequence = toneMap[kind] || [];
    const now = audioContext.currentTime;

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
}

function buildBoardCells(boardGridEl) {
  boardGridEl.replaceChildren();

  return Array.from({ length: SLOT_CONFIG.GRID_ROWS }, (_, row) =>
    Array.from({ length: SLOT_CONFIG.GRID_REELS }, (_, reel) => {
      const cellEl = document.createElement("div");

      cellEl.className = "slot-cell";
      cellEl.setAttribute("role", "gridcell");
      cellEl.dataset.row = String(row);
      cellEl.dataset.reel = String(reel);
      cellEl.innerHTML = `
        <span class="slot-mark">---</span>
        <span class="slot-name">Loading</span>
        <span class="slot-meta">Slot</span>
      `;

      boardGridEl.appendChild(cellEl);
      return cellEl;
    })
  );
}

function createEmptyOutcome() {
  return {
    totalAward: 0,
    totalWays: 0,
    summary: "Match 3 or more consecutive reels from the left to collect awards.",
    wins: [],
  };
}

function buildReelStrips(config) {
  return config.REEL_SEEDS.map((seed, reelIndex) => {
    const strip = [];

    config.SYMBOLS.forEach((symbol) => {
      const repeats = config.GROUP_FREQUENCIES[symbol.group];
      for (let count = 0; count < repeats; count += 1) {
        strip.push(symbol.id);
      }
    });

    return rotateArray(deterministicShuffle(strip, seed), reelIndex * 3);
  });
}

function deterministicShuffle(items, seed) {
  const random = createSeededRandom(seed);
  const copy = items.slice();

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function createSeededRandom(seed) {
  let value = seed >>> 0;

  return function seededRandom() {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function rotateArray(items, offset) {
  const normalizedOffset = offset % items.length;
  return items.slice(normalizedOffset).concat(items.slice(0, normalizedOffset));
}

function generateRandomBoard(reelStrips, config) {
  const columns = reelStrips.map((strip) => getRandomColumnFromStrip(strip));
  return columnsToBoard(columns, config);
}

function getRandomColumnFromStrip(strip) {
  const stopIndex = Math.floor(Math.random() * strip.length);
  return [0, 1, 2].map((offset) => strip[(stopIndex + offset) % strip.length]);
}

function columnsToBoard(columns, config) {
  return Array.from({ length: config.GRID_ROWS }, (_, row) =>
    columns.map((column) => column[row])
  );
}

function boardToColumns(board) {
  return Array.from({ length: SLOT_CONFIG.GRID_REELS }, (_, reel) =>
    Array.from({ length: SLOT_CONFIG.GRID_ROWS }, (_, row) => board[row][reel])
  );
}

function evaluateBoard(board, config) {
  const columns = boardToColumns(board);
  const wins = config.SYMBOLS.map((symbol) => {
    const counts = columns.map(
      (column) => column.filter((symbolId) => symbolId === symbol.id).length
    );
    let matchCount = 0;

    while (matchCount < config.GRID_REELS && counts[matchCount] > 0) {
      matchCount += 1;
    }

    if (matchCount < 3) {
      return null;
    }

    const ways = counts.slice(0, matchCount).reduce((product, count) => product * count, 1);
    const awardPerWay = symbol.award3 * config.MATCH_MULTIPLIERS[matchCount];
    const totalAward = ways * awardPerWay;
    const positions = [];

    for (let reel = 0; reel < matchCount; reel += 1) {
      for (let row = 0; row < config.GRID_ROWS; row += 1) {
        if (board[row][reel] === symbol.id) {
          positions.push([row, reel]);
        }
      }
    }

    return {
      symbolId: symbol.id,
      matchCount,
      ways,
      awardPerWay,
      totalAward,
      positions,
    };
  })
    .filter(Boolean)
    .sort((left, right) => right.totalAward - left.totalAward);

  const totalAward = wins.reduce((sum, win) => sum + win.totalAward, 0);
  const totalWays = wins.reduce((sum, win) => sum + win.ways, 0);

  return {
    totalAward,
    totalWays,
    summary: summarizeOutcome(wins, totalAward, totalWays, config),
    wins,
  };
}

function summarizeOutcome(wins, totalAward, totalWays, config) {
  if (!wins.length) {
    return "No symbol reached 3 consecutive reels from reel 1.";
  }

  const topWin = wins[0];
  const topSymbol = config.SYMBOLS.find((symbol) => symbol.id === topWin.symbolId);

  if (wins.length === 1) {
    return `${topSymbol.label} connected across ${topWin.matchCount} reels for ${formatNumber(topWin.ways)} ways.`;
  }

  return `${wins.length} symbols paid ${formatCredits(totalAward)} across ${formatNumber(totalWays)} ways. Top symbol: ${topSymbol.label}.`;
}

function buildWinningPositionSet(wins) {
  const positionSet = new Set();

  wins.forEach((win) => {
    win.positions.forEach(([row, reel]) => {
      positionSet.add(buildPositionKey(row, reel));
    });
  });

  return positionSet;
}

function buildPositionKey(row, reel) {
  return `${row}-${reel}`;
}

function isValidBoard(board) {
  return (
    Array.isArray(board) &&
    board.length === SLOT_CONFIG.GRID_ROWS &&
    board.every(
      (row) =>
        Array.isArray(row) &&
        row.length === SLOT_CONFIG.GRID_REELS &&
        row.every((symbolId) => typeof symbolId === "string")
    )
  );
}

function vibrateDevice(pattern) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function formatCredits(value) {
  return `${new Intl.NumberFormat("en-US").format(value)} coins`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Math.round(value)));
}
