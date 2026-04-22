import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const trial24Dir = path.join(
  process.cwd(),
  "Development",
  "Gamification & Engagement Patterns - Zayn & Nicholas",
  "Trial 24",
);

const htmlExpectations = {
  "index.html": [
    "vendor/motion.js",
    "game-data.js",
    "bonus-feature.js",
    "variable-ratio-reward.js",
    "script.js",
  ],
  "profile.html": ["vendor/motion.js", "game-data.js", "profile.js"],
  "paytable.html": ["vendor/motion.js", "game-data.js", "paytable.js"],
} as const;

const jsFiles = [
  "game-data.js",
  "bonus-feature.js",
  "variable-ratio-reward.js",
  "script.js",
  "paytable.js",
  "profile.js",
] as const;

function trial24Url(fileName: keyof typeof htmlExpectations) {
  return `/${[
    "Development",
    "Gamification & Engagement Patterns - Zayn & Nicholas",
    "Trial 24",
    fileName,
  ]
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

async function readTrial24File(fileName: string) {
  return fs.readFile(path.join(trial24Dir, fileName), "utf8");
}

function extractAttributeValues(source: string, tagName: string, attributeName: string) {
  const tagPattern = new RegExp(`<${tagName}\\b[^>]*\\b${attributeName}="([^"]+)"[^>]*>`, "gi");
  return Array.from(source.matchAll(tagPattern), (match) => match[1]);
}

test.describe("Trial 24 lint coverage", () => {
  test("HTML pages keep valid structure and local asset wiring", async () => {
    for (const [fileName, expectedScripts] of Object.entries(htmlExpectations)) {
      const source = await readTrial24File(fileName);
      const scriptSrcs = extractAttributeValues(source, "script", "src");
      const stylesheetHrefs = extractAttributeValues(source, "link", "href");
      const inlineScripts = Array.from(
        source.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi),
        (match) => match[1].trim(),
      ).filter(Boolean);

      expect(source).toMatch(/^<!DOCTYPE html>/i);
      expect(source).toMatch(/<html\s+lang="en"/i);
      expect(source).toMatch(/<meta\s+charset="UTF-8"\s*\/?>/i);
      expect(source).toMatch(
        /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1\.0"\s*\/?>/i,
      );
      expect(source.match(/<title>[\s\S]*?<\/title>/gi)?.length ?? 0).toBe(1);
      expect(source.match(/<main\b/gi)?.length ?? 0).toBe(1);
      expect(source.match(/<h1\b/gi)?.length ?? 0).toBe(1);
      expect(source).not.toMatch(/\sstyle\s*=/i);
      expect(source).not.toMatch(/\son[a-z-]+\s*=/i);

      expect(stylesheetHrefs).toContain("styles.css");
      expect(
        stylesheetHrefs.filter((href) => href === "styles.css").length,
        `${fileName} should link the shared Trial 24 stylesheet exactly once.`,
      ).toBe(1);

      expect(scriptSrcs, `${fileName} should load the expected local script stack.`).toEqual(
        expectedScripts,
      );
      expect(inlineScripts, `${fileName} should only keep the theme bootstrap inline.`).toHaveLength(
        1,
      );
      expect(inlineScripts[0]).toContain("prompt-drop-theme-v1");
      expect(inlineScripts[0]).toContain("document.documentElement.dataset.theme");

      for (const assetPath of [...scriptSrcs, ...stylesheetHrefs]) {
        expect(assetPath).not.toMatch(/^(https?:)?\/\//i);
        await expect(fs.access(path.join(trial24Dir, assetPath))).resolves.toBeUndefined();
      }
    }
  });

  test("CSS keeps shared theme, responsive, and accessibility rules", async () => {
    const source = await readTrial24File("styles.css");
    const breakpointMatches = source.match(/@media \(max-width: \d+px\)/g) ?? [];
    const importantMatches = source.match(/!important/g) ?? [];

    expect(source).toContain(':root[data-theme="light"]');
    expect(source).toContain(':root[data-theme="dark"]');
    expect(source).toContain("color-scheme: light;");
    expect(source).toContain("color-scheme: dark;");
    expect(source).toContain("--font-title:");
    expect(source).toContain("--font-ui:");
    expect(source).toContain("@media (prefers-reduced-motion: reduce)");
    expect(source).toMatch(/button:focus-visible,/);
    expect(source).toContain(".text-input:focus-visible");
    expect(source).toContain(".app-shell");
    expect(source).toContain(".info-shell");
    expect(source).toContain(".hero");
    expect(breakpointMatches.length).toBeGreaterThanOrEqual(3);
    expect(importantMatches.length).toBeLessThanOrEqual(2);
  });

  test("JavaScript files avoid banned patterns and keep page controllers explicit", async () => {
    const jsSources = await Promise.all(
      jsFiles.map(async (fileName) => [fileName, await readTrial24File(fileName)] as const),
    );

    for (const [fileName, source] of jsSources) {
      expect(source, `${fileName} should avoid legacy var declarations.`).not.toMatch(
        /(^|\n)\s*var\s+[A-Za-z_$]/,
      );
      expect(source, `${fileName} should avoid document.write usage.`).not.toMatch(
        /\bdocument\.write\s*\(/,
      );
      expect(source, `${fileName} should avoid eval usage.`).not.toMatch(/\beval\s*\(/);
      expect(source, `${fileName} should avoid Function-constructor usage.`).not.toMatch(
        /\bnew Function\b/,
      );
    }

    expect(jsSources.find(([fileName]) => fileName === "game-data.js")?.[1]).toContain(
      "window.SLOT_CONFIG",
    );
    expect(jsSources.find(([fileName]) => fileName === "bonus-feature.js")?.[1]).toContain(
      "window.BONUS_FEATURES",
    );
    expect(
      jsSources.find(([fileName]) => fileName === "variable-ratio-reward.js")?.[1],
    ).toContain("window.VARIABLE_RATIO_REWARD");

    for (const pageController of ["script.js", "paytable.js", "profile.js"]) {
      const source = jsSources.find(([fileName]) => fileName === pageController)?.[1] ?? "";
      expect(source, `${pageController} should wire UI behavior through event listeners.`).toMatch(
        /\.addEventListener\(/,
      );
    }
  });

  test("Trial 24 pages initialize styled UI without missing core hooks", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    await page.goto(trial24Url("index.html"));
    await page.waitForFunction(() => Boolean((window as Window & { promptDropDebug?: unknown }).promptDropDebug));
    await expect(page.locator("#reelBoard .reel-column")).toHaveCount(5);
    await expect(page.locator("#message")).toContainText(/Place your wager|Daily bonus awarded/);

    const indexStyles = await page.evaluate(() => ({
      backgroundImage: window.getComputedStyle(document.body).backgroundImage,
      colorScheme: window.getComputedStyle(document.documentElement).colorScheme,
    }));
    expect(indexStyles.backgroundImage).not.toBe("none");
    expect(indexStyles.colorScheme).toBeTruthy();

    await page.goto(trial24Url("paytable.html"));
    expect(await page.locator("#paytableBody tr").count()).toBeGreaterThan(0);
    await expect(page.locator("#paylineGallery .line-card")).toHaveCount(10);

    await page.goto(trial24Url("profile.html"));
    expect(await page.locator("#iconShopList button").count()).toBeGreaterThan(0);
    expect((await page.locator("#profileNameDisplay").textContent())?.trim().length ?? 0).toBeGreaterThan(0);

    expect(pageErrors).toEqual([]);
  });
});
