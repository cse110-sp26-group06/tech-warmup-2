import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const trial22Url = pathToFileURL(
  path.join(
    process.cwd(),
    "Development",
    "Gamification & Engagement Patterns - Zayn & Nicholas",
    "Trial 24",
    "index.html",
  ),
).toString();

const winningSpinQueue = [
  3, 21, 7,
  3, 13, 21,
  3, 1, 13,
  21, 7, 1,
  13, 21, 3,
];

async function installDeterministicHooks(page: Page) {
  await page.addInitScript(() => {
    const originalMatchMedia = window.matchMedia.bind(window);
    const originalGetRandomValues = window.crypto.getRandomValues.bind(window.crypto);
    let queuedValues: number[] = [];

    const reducedMotionResult = {
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    };

    window.matchMedia = (query: string) => {
      if (query === "(prefers-reduced-motion: reduce)") {
        return reducedMotionResult as MediaQueryList;
      }

      return originalMatchMedia(query);
    };

    (window as Window & { __setRandomQueue?: (values: number[]) => void }).__setRandomQueue = (
      values: number[],
    ) => {
      queuedValues = [...values];
    };

    const deterministicGetRandomValues = <T extends ArrayBufferView | null>(typedArray: T): T => {
      if (!typedArray) {
        return typedArray;
      }

      const view = typedArray as unknown as { length: number; [index: number]: number };

      if (queuedValues.length === 0) {
        return originalGetRandomValues(typedArray);
      }

      for (let index = 0; index < view.length; index += 1) {
        view[index] = queuedValues.length > 0 ? queuedValues.shift() ?? 0 : 0;
      }

      return typedArray;
    };

    try {
      window.crypto.getRandomValues = deterministicGetRandomValues;
    } catch (error) {
      Object.defineProperty(window.crypto, "getRandomValues", {
        configurable: true,
        value: deterministicGetRandomValues,
      });
    }
  });
}

async function loadTrial22(page: Page) {
  await installDeterministicHooks(page);
  await page.goto(trial22Url);
  await page.waitForFunction(() => Boolean((window as Window & { promptDropDebug?: unknown }).promptDropDebug));

  await page.evaluate(() => {
    const appWindow = window as Window & {
      SLOT_CONFIG: {
        reels: number;
        rows: number;
        defaultSpinCost: number;
        symbols: Array<{ key: string }>;
      };
      promptDropDebug: {
        state: {
          tokens: number;
          spinCost: number;
          visibleGrid: Array<Array<{ key: string }>>;
          variableReward: {
            spinsSinceLastReward: number;
            spinsUntilReward: number;
            rewardsTriggered: number;
            lastReward: null;
          };
          bonusBuy: {
            selectedOfferId: string | null;
            activeOfferId: string | null;
          };
          consent: {
            accepted: boolean;
            locationMode: string;
            locationLabel: string;
          };
          lastAward: number;
        };
        renderGrid: (grid: Array<Array<{ key: string }>>) => void;
        updateControlStates: () => void;
        updateBonusBuyDisplay: () => void;
      };
    };

    const blankSymbol = appWindow.SLOT_CONFIG.symbols.find((symbol) => symbol.key === "blank");
    const blankGrid = Array.from({ length: appWindow.SLOT_CONFIG.reels }, () =>
      Array.from({ length: appWindow.SLOT_CONFIG.rows }, () => blankSymbol),
    );

    appWindow.promptDropDebug.state.visibleGrid = blankGrid;
    appWindow.promptDropDebug.renderGrid(blankGrid);
    appWindow.promptDropDebug.state.tokens = 3000;
    appWindow.promptDropDebug.state.spinCost = appWindow.SLOT_CONFIG.defaultSpinCost;
    appWindow.promptDropDebug.state.lastAward = 0;
    appWindow.promptDropDebug.state.variableReward.spinsSinceLastReward = 0;
    appWindow.promptDropDebug.state.variableReward.spinsUntilReward = 999999;
    appWindow.promptDropDebug.state.variableReward.rewardsTriggered = 0;
    appWindow.promptDropDebug.state.variableReward.lastReward = null;
    appWindow.promptDropDebug.state.bonusBuy.selectedOfferId = null;
    appWindow.promptDropDebug.state.bonusBuy.activeOfferId = null;
    appWindow.promptDropDebug.state.consent.accepted = true;
    appWindow.promptDropDebug.state.consent.locationMode = "manual";
    appWindow.promptDropDebug.state.consent.locationLabel = "Manual: California";
    appWindow.promptDropDebug.updateBonusBuyDisplay();
    appWindow.promptDropDebug.updateControlStates();

    const tokenCount = document.getElementById("tokenCount");
    const lastAward = document.getElementById("lastAward");
    const spinCostDisplay = document.getElementById("spinCostDisplay");
    const costSlider = document.getElementById("costSlider") as HTMLInputElement | null;
    const costSliderValue = document.getElementById("costSliderValue");
    const privacyModal = document.getElementById("privacyModal");
    const dailyBonusModal = document.getElementById("dailyBonusModal");
    const wagerWarningModal = document.getElementById("wagerWarningModal");
    const message = document.getElementById("message");

    if (tokenCount) {
      tokenCount.textContent = "3,000";
    }
    if (lastAward) {
      lastAward.textContent = "0";
    }
    if (spinCostDisplay) {
      spinCostDisplay.textContent = String(appWindow.SLOT_CONFIG.defaultSpinCost);
    }
    if (costSlider) {
      costSlider.value = String(appWindow.SLOT_CONFIG.defaultSpinCost);
    }
    if (costSliderValue) {
      costSliderValue.textContent = String(appWindow.SLOT_CONFIG.defaultSpinCost);
    }
    if (privacyModal) {
      privacyModal.hidden = true;
    }
    if (dailyBonusModal) {
      dailyBonusModal.hidden = true;
    }
    if (wagerWarningModal) {
      wagerWarningModal.hidden = true;
    }
    if (message) {
      message.textContent = "Place your wager and spin the reels.";
    }

    document.body.classList.remove("modal-open");
  });
}

async function setCredits(page: Page, amount: number) {
  await page.evaluate((nextAmount) => {
    const appWindow = window as Window & {
      promptDropDebug: {
        state: {
          tokens: number;
          lastAward: number;
        };
        updateControlStates: () => void;
      };
    };

    appWindow.promptDropDebug.state.tokens = nextAmount;
    appWindow.promptDropDebug.state.lastAward = 0;
    appWindow.promptDropDebug.updateControlStates();

    const tokenCount = document.getElementById("tokenCount");
    const lastAward = document.getElementById("lastAward");

    if (tokenCount) {
      tokenCount.textContent = nextAmount.toLocaleString("en-US");
    }
    if (lastAward) {
      lastAward.textContent = "0";
    }
  }, amount);
}

async function runWinningSpin(page: Page) {
  return page.evaluate(async (queue) => {
    const appWindow = window as Window & {
      __setRandomQueue: (values: number[]) => void;
      promptDropDebug: {
        spin: () => Promise<{
          completed: boolean;
          paidWin?: {
            line: { name: string };
            award: number;
            multiplier: number;
          };
        }>;
      };
    };

    appWindow.__setRandomQueue(queue);
    return appWindow.promptDropDebug.spin();
  }, winningSpinQueue);
}

test.describe("Trial 22 spin flow", () => {
  test.beforeEach(async ({ page }) => {
    await loadTrial22(page);
  });

  test("spin changes the displayed result grid", async ({ page }) => {
    const beforeAndAfter = await page.evaluate(async (queue) => {
      const appWindow = window as Window & {
        __setRandomQueue: (values: number[]) => void;
        promptDropDebug: {
          state: {
            visibleGrid: Array<Array<{ key: string }>>;
          };
          spin: () => Promise<unknown>;
        };
      };

      const before = appWindow.promptDropDebug.state.visibleGrid.map((column) =>
        column.map((symbol) => symbol.key),
      );

      appWindow.__setRandomQueue(queue);
      await appWindow.promptDropDebug.spin();

      const after = appWindow.promptDropDebug.state.visibleGrid.map((column) =>
        column.map((symbol) => symbol.key),
      );

      return { before, after };
    }, winningSpinQueue);

    expect(beforeAndAfter.before).not.toEqual(beforeAndAfter.after);
    expect(beforeAndAfter.after[0][0]).toBe("gold");
    expect(beforeAndAfter.after[2][0]).toBe("gold");
  });

  test("balance updates correctly after a winning spin", async ({ page }) => {
    const outcome = await runWinningSpin(page);

    expect(outcome.completed).toBe(true);
    await expect(page.locator("#tokenCount")).toHaveText("3,300");
    await expect(page.locator("#lastAward")).toHaveText("360");
  });

  test("win condition displays after a winning spin", async ({ page }) => {
    await runWinningSpin(page);

    await expect(page.locator("#message")).toContainText("Win recorded: Top Row paid 360 credits.");
    await expect(page.locator("#winMeta")).toContainText("Top Row paid 6x");
    await expect(page.locator("#breakdownList")).toContainText("Top Row: Gold 3 of a kind for 6x");
    await expect(page.locator("#breakdownList")).toContainText("360 credits");
  });

  test("cannot spin with 0 balance", async ({ page }) => {
    await setCredits(page, 0);

    await expect(page.locator("#spinButton")).toBeDisabled();

    const result = await page.evaluate(async () => {
      const appWindow = window as Window & {
        promptDropDebug: {
          state: {
            tokens: number;
            spinning: boolean;
          };
          spin: () => Promise<{ completed: boolean }>;
        };
      };

      const spinResult = await appWindow.promptDropDebug.spin();

      return {
        completed: spinResult.completed,
        tokens: appWindow.promptDropDebug.state.tokens,
        spinning: appWindow.promptDropDebug.state.spinning,
        message: document.getElementById("message")?.textContent ?? "",
      };
    });

    expect(result.completed).toBe(false);
    expect(result.tokens).toBe(0);
    expect(result.spinning).toBe(false);
    expect(result.message).toContain("Insufficient credits.");
  });

  test("spin button disables during an active spin", async ({ page }) => {
    const duringSpin = await page.evaluate((queue) => {
      const appWindow = window as Window & {
        __setRandomQueue: (values: number[]) => void;
        promptDropDebug: {
          state: {
            spinning: boolean;
          };
          spin: () => Promise<unknown>;
        };
      };

      appWindow.__setRandomQueue(queue);
      appWindow.promptDropDebug.spin();

      return {
        spinning: appWindow.promptDropDebug.state.spinning,
        disabled: (document.getElementById("spinButton") as HTMLButtonElement | null)?.disabled,
      };
    }, winningSpinQueue);

    expect(duringSpin.spinning).toBe(true);
    expect(duringSpin.disabled).toBe(true);

    await page.waitForFunction(() => {
      const appWindow = window as Window & {
        promptDropDebug: {
          state: {
            spinning: boolean;
          };
        };
      };

      return appWindow.promptDropDebug.state.spinning === false;
    });
  });
});
