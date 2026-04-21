(function defineSlotConfig() {
  const rows = 3;
  const reels = 5;
  const startingTokens = 3000;
  const defaultSpinCost = 60;
  const minSpinCost = 10;
  const maxSpinCost = 500;
  const autoSpinRange = { min: 1, max: 30, defaultValue: 10 };

  const symbols = [
    {
      key: "star",
      name: "Star",
      label: "STAR",
      icon: "★",
      weight: 1,
      payouts: { 3: 25, 4: 80, 5: 240 },
      flavor: "Ultra-rare premium symbol with the largest fixed payout.",
    },
    {
      key: "diamond",
      name: "Diamond",
      label: "DIAMOND",
      icon: "◆",
      weight: 2,
      payouts: { 3: 14, 4: 44, 5: 132 },
      flavor: "Rare high-value symbol with stronger paytable returns.",
    },
    {
      key: "gold",
      name: "Gold",
      label: "GOLD",
      icon: "⬢",
      weight: 4,
      payouts: { 3: 6, 4: 18, 5: 54 },
      flavor: "Mid-tier premium symbol with expanded payouts.",
    },
    {
      key: "silver",
      name: "Silver",
      label: "SILVER",
      icon: "◈",
      weight: 6,
      payouts: { 3: 2, 4: 7, 5: 21 },
      flavor: "Standard symbol with modest but improved payout potential.",
    },
    {
      key: "bronze",
      name: "Bronze",
      label: "BRONZE",
      icon: "⬡",
      weight: 8,
      payouts: { 3: 1, 4: 3, 5: 9 },
      flavor: "Low-value symbol with small payouts when it lines up.",
    },
    {
      key: "blank",
      name: "Blank",
      label: "MISS",
      icon: "○",
      weight: 12,
      payouts: {},
      flavor: "Non-paying stop added to make high-limit wins harder to hit.",
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
      "Location is collected only for an on-device reminder that gaming requirements differ by state. This game does not determine legal eligibility.",
  };
})();
