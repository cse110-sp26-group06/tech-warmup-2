const paytableRootEl = document.querySelector("[data-paytable-root]");

if (paytableRootEl && typeof window !== "undefined" && window.SLOT_CONFIG) {
  renderPaytable(paytableRootEl, window.SLOT_CONFIG);
}

function renderPaytable(rootEl, config) {
  const paytableListEl = rootEl.querySelector("#paytable-list");
  const lowGroupListEl = rootEl.querySelector("#low-group-list");
  const highGroupListEl = rootEl.querySelector("#high-group-list");

  config.SYMBOLS.forEach((symbol) => {
    const awardThree = symbol.award3;
    const awardFour = symbol.award3 * config.MATCH_MULTIPLIERS[4];
    const awardFive = symbol.award3 * config.MATCH_MULTIPLIERS[5];
    const groupListEl = symbol.group === "high" ? highGroupListEl : lowGroupListEl;
    const groupLabel = symbol.group === "high" ? "High award" : "Low award";

    const listItemEl = document.createElement("li");
    listItemEl.textContent = `${symbol.label} (${symbol.short}) - 3 reels pay ${formatCredits(awardThree)}.`;
    groupListEl.appendChild(listItemEl);

    const payCardEl = document.createElement("article");
    payCardEl.className = `pay-card group-${symbol.group}`;
    payCardEl.innerHTML = `
      <div class="pay-card-top">
        <div>
          <span class="pay-card-mark">${symbol.short}</span>
          <h3>${symbol.label}</h3>
        </div>
        <span class="group-badge">${groupLabel}</span>
      </div>
      <div class="pay-values">
        <div>
          <span>3 reels</span>
          <strong>${formatCredits(awardThree)}</strong>
        </div>
        <div>
          <span>4 reels</span>
          <strong>${formatCredits(awardFour)}</strong>
        </div>
        <div>
          <span>5 reels</span>
          <strong>${formatCredits(awardFive)}</strong>
        </div>
      </div>
    `;

    paytableListEl.appendChild(payCardEl);
  });
}

function formatCredits(value) {
  return `${new Intl.NumberFormat("en-US").format(value)} coins`;
}
