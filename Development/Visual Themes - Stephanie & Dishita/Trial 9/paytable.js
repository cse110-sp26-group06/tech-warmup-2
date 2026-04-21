const { animate, stagger } = window.Motion;

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
const lineAccentPalette = ["#FFD166", "#FFEAA0", "#FF5F5F", "#FF9E8A", "#FFA9A3", "#C8860A"];
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const buttonStyleCache = new WeakMap();
const transientAnimations = new WeakMap();

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function clearMotionStyles(element, properties = ["transform", "opacity", "box-shadow"]) {
  if (!element) {
    return;
  }

  properties.forEach((property) => {
    element.style.removeProperty(property);
  });
}

function stopTransientAnimation(element, clearProperties) {
  const controls = transientAnimations.get(element);

  if (controls && typeof controls.stop === "function") {
    controls.stop();
  }

  transientAnimations.delete(element);

  if (clearProperties) {
    clearMotionStyles(element, clearProperties);
  }
}

function fadeInElements(elements, options = {}) {
  const visibleElements = Array.from(elements).filter(Boolean);

  if (!visibleElements.length || prefersReducedMotion()) {
    return;
  }

  const delayFor = stagger(options.staggerStep ?? 0.07, {
    startDelay: options.startDelay ?? 0,
  });

  visibleElements.forEach((element, index) => {
    const controls = animate(
      element,
      { opacity: [0, 1], y: [20, 0] },
      {
        duration: options.duration ?? 0.5,
        delay: delayFor(index, visibleElements.length),
        ease: "easeOut",
      },
    );
    transientAnimations.set(element, controls);
  });
}

function readButtonShadows(button) {
  if (buttonStyleCache.has(button)) {
    return buttonStyleCache.get(button);
  }

  const styles = window.getComputedStyle(button);
  const values = {
    baseShadow: styles.getPropertyValue("--button-shadow-base").trim() || styles.boxShadow,
    hoverShadow: styles.getPropertyValue("--button-shadow-hover").trim() || styles.boxShadow,
  };

  buttonStyleCache.set(button, values);
  return values;
}

function animateButtonState(button, keyframes) {
  if (prefersReducedMotion()) {
    return;
  }

  stopTransientAnimation(button, ["transform", "box-shadow"]);
  const controls = animate(button, keyframes, {
    duration: 0.3,
    ease: "easeInOut",
  });
  transientAnimations.set(button, controls);
}

function setupAnimatedButtons() {
  document.querySelectorAll("button, .button-link").forEach((button) => {
    readButtonShadows(button);

    button.addEventListener("pointerenter", () => {
      if (button.disabled || prefersReducedMotion()) {
        return;
      }

      const { hoverShadow } = readButtonShadows(button);
      animateButtonState(button, {
        scale: 1.05,
        boxShadow: hoverShadow,
      });
    });

    button.addEventListener("pointerleave", () => {
      if (prefersReducedMotion()) {
        return;
      }

      const { baseShadow } = readButtonShadows(button);
      animateButtonState(button, {
        scale: 1,
        boxShadow: baseShadow,
      });
    });

    button.addEventListener("pointerdown", () => {
      if (button.disabled || prefersReducedMotion()) {
        return;
      }

      animateButtonState(button, { scale: 0.95 });
    });

    const releasePointer = () => {
      if (prefersReducedMotion()) {
        return;
      }

      const hovered = button.matches(":hover");
      const { baseShadow, hoverShadow } = readButtonShadows(button);
      animateButtonState(button, {
        scale: hovered ? 1.05 : 1,
        boxShadow: hovered ? hoverShadow : baseShadow,
      });
    };

    button.addEventListener("pointerup", releasePointer);
    button.addEventListener("pointercancel", releasePointer);
  });
}

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
  card.style.setProperty("--line-accent", lineAccentPalette[index % lineAccentPalette.length]);

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

setupAnimatedButtons();
fadeInElements([document.querySelector(".hero"), document.querySelector(".info-panel")], {
  duration: 0.55,
  staggerStep: 0.08,
});
fadeInElements(document.querySelectorAll(".rule-card, .info-card, .table-panel, .line-card"), {
  duration: 0.45,
  staggerStep: 0.05,
  startDelay: 0.08,
});
