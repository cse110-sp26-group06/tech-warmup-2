const { animate } = window.Motion;
const { startingTokens } = window.SLOT_CONFIG;

const rootElement = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const profileTokenCount = document.getElementById("profileTokenCount");
const profileIconDisplay = document.getElementById("profileIconDisplay");
const profileNameDisplay = document.getElementById("profileNameDisplay");
const playerNameInput = document.getElementById("playerNameInput");
const saveNameButton = document.getElementById("saveNameButton");
const playerNameStatus = document.getElementById("playerNameStatus");
const iconShopList = document.getElementById("iconShopList");

const themeStorageKey = "prompt-drop-theme-v1";
const playerProfileStorageKey = "prompt-drop-player-profile-v1";
const walletStorageKey = "prompt-drop-wallet-v1";
const defaultPlayerIcon = "🙂";
const iconCatalog = [
  { icon: "🙂", name: "Starter Smile", cost: 0 },
  { icon: "🤖", name: "Bot Buddy", cost: 350 },
  { icon: "💎", name: "Diamond Drop", cost: 700 },
  { icon: "🚀", name: "Launch Mode", cost: 1100 },
  { icon: "👑", name: "Crown Signal", cost: 1800 },
  { icon: "🌟", name: "Star Surge", cost: 2400 },
];

let tokens = startingTokens;
let playerProfile = {
  name: "Guest",
  selectedIcon: defaultPlayerIcon,
  ownedIcons: [defaultPlayerIcon],
};

function formatNumber(value) {
  return value.toLocaleString();
}

function readStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return storedTheme === "dark" ? "dark" : "light";
  } catch (error) {
    return "light";
  }
}

function persistTheme(theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    return;
  }
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  const nextLabel = nextTheme === "dark" ? "Light Mode" : "Dark Mode";

  rootElement.dataset.theme = nextTheme;
  themeToggle.textContent = nextLabel;
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
  themeToggle.setAttribute("aria-label", `Switch to ${nextLabel.toLowerCase()}`);
}

function toggleTheme() {
  const nextTheme = rootElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  persistTheme(nextTheme);
}

function fadeInElement(element) {
  if (!element) {
    return;
  }

  animate(element, { opacity: [0, 1], y: [12, 0] }, { duration: 0.35, ease: "easeOut" });
}

function sanitizePlayerName(name) {
  const cleanName = String(name || "").trim().replace(/\s+/g, " ").slice(0, 18);

  return cleanName || "Guest";
}

function readStoredWallet() {
  try {
    const raw = window.localStorage.getItem(walletStorageKey);

    if (!raw) {
      return null;
    }

    const storedWallet = JSON.parse(raw);

    return Number.isFinite(storedWallet?.tokens) ? storedWallet.tokens : null;
  } catch (error) {
    return null;
  }
}

function persistWallet() {
  try {
    window.localStorage.setItem(walletStorageKey, JSON.stringify({ tokens }));
  } catch (error) {
    return;
  }
}

function readStoredPlayerProfile() {
  try {
    const raw = window.localStorage.getItem(playerProfileStorageKey);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function persistPlayerProfile() {
  try {
    window.localStorage.setItem(playerProfileStorageKey, JSON.stringify(playerProfile));
  } catch (error) {
    return;
  }
}

function setStatus(text) {
  playerNameStatus.textContent = text;
  fadeInElement(playerNameStatus);
}

function updateProfileDisplay() {
  profileTokenCount.textContent = formatNumber(tokens);
  profileIconDisplay.textContent = playerProfile.selectedIcon;
  profileNameDisplay.textContent = playerProfile.name;

  if (document.activeElement !== playerNameInput) {
    playerNameInput.value = playerProfile.name === "Guest" ? "" : playerProfile.name;
  }
}

function renderIconShop() {
  iconShopList.textContent = "";

  iconCatalog.forEach((item) => {
    const owned = playerProfile.ownedIcons.includes(item.icon);
    const selected = playerProfile.selectedIcon === item.icon;
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const label = document.createElement("span");
    const meta = document.createElement("span");

    button.className = "icon-shop-button";
    button.type = "button";
    button.disabled = !owned && tokens < item.cost;
    button.classList.toggle("is-owned", owned);
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));

    icon.className = "icon-shop-symbol";
    icon.textContent = item.icon;
    label.className = "icon-shop-name";
    label.textContent = item.name;
    meta.className = "icon-shop-meta";
    meta.textContent = selected
      ? "Equipped"
      : owned
        ? "Equip"
        : `${formatNumber(item.cost)} credits`;

    button.append(icon, label, meta);
    button.addEventListener("click", () => {
      purchaseOrEquipIcon(item);
    });
    iconShopList.append(button);
  });
}

function savePlayerName() {
  playerProfile.name = sanitizePlayerName(playerNameInput.value);
  persistPlayerProfile();
  updateProfileDisplay();
  setStatus(`Welcome, ${playerProfile.name}.`);
}

function purchaseOrEquipIcon(item) {
  const owned = playerProfile.ownedIcons.includes(item.icon);

  if (!owned && tokens < item.cost) {
    setStatus(`Need ${formatNumber(item.cost)} credits for ${item.name}.`);
    return;
  }

  if (!owned) {
    tokens -= item.cost;
    playerProfile.ownedIcons.push(item.icon);
    setStatus(`${item.name} purchased and equipped.`);
  } else {
    setStatus(`${item.name} equipped.`);
  }

  playerProfile.selectedIcon = item.icon;
  persistWallet();
  persistPlayerProfile();
  updateProfileDisplay();
  renderIconShop();
}

function initializeWallet() {
  const storedTokens = readStoredWallet();
  tokens = Number.isFinite(storedTokens) ? Math.max(0, storedTokens) : startingTokens;
  persistWallet();
}

function initializePlayerProfile() {
  const storedProfile = readStoredPlayerProfile();
  const ownedIcons = Array.isArray(storedProfile?.ownedIcons)
    ? [...new Set([defaultPlayerIcon, ...storedProfile.ownedIcons])]
    : [defaultPlayerIcon];
  const selectedIcon = ownedIcons.includes(storedProfile?.selectedIcon)
    ? storedProfile.selectedIcon
    : defaultPlayerIcon;

  playerProfile = {
    name: sanitizePlayerName(storedProfile?.name),
    selectedIcon,
    ownedIcons,
  };

  persistPlayerProfile();
  updateProfileDisplay();
  renderIconShop();
}

applyTheme(readStoredTheme());
initializeWallet();
initializePlayerProfile();

themeToggle.addEventListener("click", toggleTheme);
saveNameButton.addEventListener("click", savePlayerName);
playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    savePlayerName();
  }
});
