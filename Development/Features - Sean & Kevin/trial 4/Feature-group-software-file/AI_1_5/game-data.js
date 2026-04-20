(function defineSlotConfig() {
  const rows = 3;
  const reels = 5;
  const totalWays = rows ** reels;
  const spinCost = 80;
  const startingTokens = 3000;

  const symbols = [
    {
      code: "AGI",
      name: "AGI Launch",
      group: "high",
      weight: 1,
      baseAward: 2400,
      flavor: "Promises sentience next quarter with suspicious confidence.",
    },
    {
      code: "GPU",
      name: "GPU Cluster",
      group: "high",
      weight: 1,
      baseAward: 1800,
      flavor: "Enough compute to warm a small city.",
    },
    {
      code: "HYPE",
      name: "Hype Cycle",
      group: "high",
      weight: 1,
      baseAward: 1200,
      flavor: "Valuation rises faster than availability.",
    },
    {
      code: "TOK",
      name: "Token Faucet",
      group: "low",
      weight: 3,
      baseAward: 180,
      flavor: "Tiny prompt scraps still count as yield.",
    },
    {
      code: "404",
      name: "Benchmark Missing",
      group: "low",
      weight: 3,
      baseAward: 150,
      flavor: "Metrics unavailable, optimism unaffected.",
    },
    {
      code: "BOT",
      name: "Bot Farm",
      group: "low",
      weight: 3,
      baseAward: 120,
      flavor: "Engagement numbers from remarkably tireless users.",
    },
    {
      code: "VC",
      name: "VC Deck",
      group: "low",
      weight: 3,
      baseAward: 100,
      flavor: "Slides first, business model later.",
    },
    {
      code: "LAG",
      name: "Latency Spike",
      group: "low",
      weight: 3,
      baseAward: 80,
      flavor: "Inference arrives right after the demo ends.",
    },
    {
      code: "MEME",
      name: "Meme Coin",
      group: "low",
      weight: 3,
      baseAward: 60,
      flavor: "An unserious asset with deeply serious believers.",
    },
  ];

  function payoutForMatch(symbol, matchCount) {
    return symbol.baseAward * 2 ** (matchCount - 3);
  }

  function shuffle(items) {
    const copy = items.slice();

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }

    return copy;
  }

  function createReelStrip() {
    const strip = [];

    symbols.forEach((symbol) => {
      for (let count = 0; count < symbol.weight; count += 1) {
        strip.push(symbol);
      }
    });

    return shuffle(strip);
  }

  window.SLOT_CONFIG = {
    rows,
    reels,
    totalWays,
    spinCost,
    startingTokens,
    symbols,
    payoutForMatch,
    createReelStrip,
    frequencyNote:
      "The low award group appears 6x more often overall on the reel strips than the high award group.",
    awardNote:
      "Awards start at 3 consecutive reels from the left and double every time the match extends to another reel.",
  };
})();
