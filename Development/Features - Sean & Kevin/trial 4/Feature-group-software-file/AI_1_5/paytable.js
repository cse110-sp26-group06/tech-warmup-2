const paytableBody = document.getElementById("paytableBody");
const waysValue = document.getElementById("waysValue");
const gridSize = document.getElementById("gridSize");
const frequencyNote = document.getElementById("frequencyNote");

const { rows, reels, totalWays, symbols, payoutForMatch, frequencyNote: reelNote } =
  window.SLOT_CONFIG;

function formatNumber(value) {
  return value.toLocaleString();
}

gridSize.textContent = `${rows} x ${reels}`;
waysValue.textContent = formatNumber(totalWays);
frequencyNote.textContent = reelNote;

symbols
  .slice()
  .sort((left, right) => {
    if (left.group === right.group) {
      return right.baseAward - left.baseAward;
    }

    return left.group === "high" ? -1 : 1;
  })
  .forEach((symbol) => {
    const row = document.createElement("tr");

    const symbolCell = document.createElement("td");
    symbolCell.textContent = `${symbol.code} - ${symbol.name}`;

    const groupCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `table-badge ${symbol.group}`;
    badge.textContent = symbol.group;
    groupCell.append(badge);

    const weightCell = document.createElement("td");
    weightCell.textContent = String(symbol.weight);

    const match3Cell = document.createElement("td");
    match3Cell.textContent = formatNumber(payoutForMatch(symbol, 3));

    const match4Cell = document.createElement("td");
    match4Cell.textContent = formatNumber(payoutForMatch(symbol, 4));

    const match5Cell = document.createElement("td");
    match5Cell.textContent = formatNumber(payoutForMatch(symbol, 5));

    const flavorCell = document.createElement("td");
    flavorCell.textContent = symbol.flavor;

    row.append(
      symbolCell,
      groupCell,
      weightCell,
      match3Cell,
      match4Cell,
      match5Cell,
      flavorCell,
    );
    paytableBody.append(row);
  });
