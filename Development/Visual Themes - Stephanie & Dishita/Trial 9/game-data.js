(function defineSlotConfig() {
  const rows = 3;
  const reels = 5;
  const startingTokens = 3000;
  const defaultSpinCost = 40;
  const minSpinCost = 10;
  const maxSpinCost = 120;
  const autoSpinRange = { min: 1, max: 30, defaultValue: 10 };

  const symbols = [
    {
      key: "star",
      name: "Star",
      label: "STAR",
      icon: "★",
      weight: 1,
      payouts: { 3: 15, 4: 30, 5: 60 },
      flavor: "Peak frontier-model swagger with a very expensive demo budget.",
    },
    {
      key: "diamond",
      name: "Diamond",
      label: "DIAMOND",
      icon: "◆",
      weight: 2,
      payouts: { 3: 8, 4: 16, 5: 32 },
      flavor: "Investor-grade sparkle for decks that mention agents 47 times.",
    },
    {
      key: "gold",
      name: "Gold",
      label: "GOLD",
      icon: "⬢",
      weight: 3,
      payouts: { 3: 4, 4: 8, 5: 16 },
      flavor: "Solid, premium, and somehow still bundled into the subscription.",
    },
    {
      key: "silver",
      name: "Silver",
      label: "SILVER",
      icon: "◈",
      weight: 4,
      payouts: { 3: 2, 4: 4, 5: 8 },
      flavor: "Respectable output with just enough latency to build suspense.",
    },
    {
      key: "bronze",
      name: "Bronze",
      label: "BRONZE",
      icon: "⬡",
      weight: 5,
      payouts: { 3: 1, 4: 2, 5: 4 },
      flavor: "Budget-tier inference for when the roadmap needs more optimism.",
    },
  ];

  const paylines = [
    {
      id: "top-row",
      name: "Top Row",
      description: "Five-cell horizontal payline across the top row.",
      cells: [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
      ],
    },
    {
      id: "middle-row",
      name: "Middle Row",
      description: "Five-cell horizontal payline across the middle row.",
      cells: [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
      ],
    },
    {
      id: "bottom-row",
      name: "Bottom Row",
      description: "Five-cell horizontal payline across the bottom row.",
      cells: [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
      ],
    },
    {
      id: "column-1",
      name: "Column 1",
      description: "Three-cell vertical payline on reel one.",
      cells: [
        { col: 0, row: 0 },
        { col: 0, row: 1 },
        { col: 0, row: 2 },
      ],
    },
    {
      id: "column-2",
      name: "Column 2",
      description: "Three-cell vertical payline on reel two.",
      cells: [
        { col: 1, row: 0 },
        { col: 1, row: 1 },
        { col: 1, row: 2 },
      ],
    },
    {
      id: "column-3",
      name: "Column 3",
      description: "Three-cell vertical payline on reel three.",
      cells: [
        { col: 2, row: 0 },
        { col: 2, row: 1 },
        { col: 2, row: 2 },
      ],
    },
    {
      id: "column-4",
      name: "Column 4",
      description: "Three-cell vertical payline on reel four.",
      cells: [
        { col: 3, row: 0 },
        { col: 3, row: 1 },
        { col: 3, row: 2 },
      ],
    },
    {
      id: "column-5",
      name: "Column 5",
      description: "Three-cell vertical payline on reel five.",
      cells: [
        { col: 4, row: 0 },
        { col: 4, row: 1 },
        { col: 4, row: 2 },
      ],
    },
    {
      id: "diagonal-down",
      name: "Top Left To Bottom Right",
      description: "Three-point diagonal running corner to corner through the center.",
      cells: [
        { col: 0, row: 0 },
        { col: 2, row: 1 },
        { col: 4, row: 2 },
      ],
    },
    {
      id: "diagonal-up",
      name: "Bottom Left To Top Right",
      description: "Three-point diagonal running corner to corner through the center.",
      cells: [
        { col: 0, row: 2 },
        { col: 2, row: 1 },
        { col: 4, row: 0 },
      ],
    },
  ];

  const states = [
    { code: "AL", name: "Alabama" },
    { code: "AK", name: "Alaska" },
    { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" },
    { code: "CA", name: "California" },
    { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" },
    { code: "DE", name: "Delaware" },
    { code: "DC", name: "District of Columbia" },
    { code: "FL", name: "Florida" },
    { code: "GA", name: "Georgia" },
    { code: "HI", name: "Hawaii" },
    { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinois" },
    { code: "IN", name: "Indiana" },
    { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" },
    { code: "KY", name: "Kentucky" },
    { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" },
    { code: "MD", name: "Maryland" },
    { code: "MA", name: "Massachusetts" },
    { code: "MI", name: "Michigan" },
    { code: "MN", name: "Minnesota" },
    { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" },
    { code: "MT", name: "Montana" },
    { code: "NE", name: "Nebraska" },
    { code: "NV", name: "Nevada" },
    { code: "NH", name: "New Hampshire" },
    { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" },
    { code: "NY", name: "New York" },
    { code: "NC", name: "North Carolina" },
    { code: "ND", name: "North Dakota" },
    { code: "OH", name: "Ohio" },
    { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" },
    { code: "PA", name: "Pennsylvania" },
    { code: "RI", name: "Rhode Island" },
    { code: "SC", name: "South Carolina" },
    { code: "SD", name: "South Dakota" },
    { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" },
    { code: "UT", name: "Utah" },
    { code: "VT", name: "Vermont" },
    { code: "VA", name: "Virginia" },
    { code: "WA", name: "Washington" },
    { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconsin" },
    { code: "WY", name: "Wyoming" },
  ];

  const weightedStops = symbols.flatMap((symbol) =>
    Array.from({ length: symbol.weight }, () => symbol),
  );

  function randomInt(max) {
    if (window.crypto && window.crypto.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] % max;
    }

    return Math.floor(Math.random() * max);
  }

  function pickWeightedSymbol() {
    return weightedStops[randomInt(weightedStops.length)];
  }

  function createSpinGrid() {
    return Array.from({ length: reels }, () =>
      Array.from({ length: rows }, () => pickWeightedSymbol()),
    );
  }

  function payoutMultiplier(symbolKey, matchCount) {
    const symbol = symbols.find((entry) => entry.key === symbolKey);

    if (!symbol) {
      return 0;
    }

    return symbol.payouts[matchCount] || 0;
  }

  window.SLOT_CONFIG = {
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
    complianceReminder:
      "Location is collected only for an on-device reminder that gambling rules differ by state. This demo does not determine legal eligibility.",
  };
})();
