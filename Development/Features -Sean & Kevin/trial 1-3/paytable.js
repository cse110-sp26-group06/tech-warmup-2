const {
  rows,
  reels,
  paylines,
  symbols,
  payoutMultiplier,
  complianceReminder,
} = window.SLOT_CONFIG;

const gridSize = document.getElementById("gridSize");
const paylineCount = document.getElementById("paylineCount");
const paytableBody = document.getElementById("paytableBody");
const paylineGallery = document.getElementById("paylineGallery");
const complianceReminderText = document.getElementById("complianceReminder");

gridSize.textContent = `${reels} x ${rows}`;
paylineCount.textContent = String(paylines.length);
complianceReminderText.textContent = complianceReminder;

symbols.forEach((symbol) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${symbol.icon} ${symbol.name}</td>
    <td>${symbol.weight}</td>
    <td>${payoutMultiplier(symbol.key, 3)}x</td>
    <td>${payoutMultiplier(symbol.key, 4)}x</td>
    <td>${payoutMultiplier(symbol.key, 5)}x</td>
    <td>${symbol.flavor}</td>
  `;
  paytableBody.append(row);
});

paylines.forEach((line, index) => {
  const card = document.createElement("article");
  card.className = "line-card";
  card.style.setProperty("--line-accent", `hsl(${(index * 33) % 360} 85% 64%)`);

  const title = document.createElement("div");
  title.className = "line-card-title";
  title.innerHTML = `<strong>${line.name}</strong><span>${line.description}</span>`;

  const miniGrid = document.createElement("div");
  miniGrid.className = "mini-grid";

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < reels; col += 1) {
      const cell = document.createElement("span");
      cell.className = "mini-cell";

      if (line.cells.some((position) => position.col === col && position.row === row)) {
        cell.classList.add("is-on");
      }

      miniGrid.append(cell);
    }
  }

  card.append(title, miniGrid);
  paylineGallery.append(card);
});
