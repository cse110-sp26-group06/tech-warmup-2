const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const repoRoot = path.resolve(__dirname, "..");
const developmentRoot = path.join(repoRoot, "Development");
const harnessResultTimeoutMs = 15000;

function collectHarnessPages(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const harnessPages = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      harnessPages.push(...collectHarnessPages(absolutePath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".test.html")) {
      harnessPages.push(path.relative(repoRoot, absolutePath));
    }
  }

  return harnessPages.sort((left, right) => left.localeCompare(right));
}

const harnessPages = collectHarnessPages(developmentRoot);

for (const relativeHarnessPath of harnessPages) {
  test(`browser harness passes: ${relativeHarnessPath}`, async ({ page }) => {
    const harnessUrl = `/${relativeHarnessPath.split(path.sep).join("/")}`;

    await page.goto(encodeURI(harnessUrl));
    await expect(page.locator("#summary")).toContainText("tests passed", {
      timeout: harnessResultTimeoutMs,
    });
    await expect(page.locator("#results li")).not.toHaveCount(0, {
      timeout: harnessResultTimeoutMs,
    });
    await expect(page.locator("#results li.failed")).toHaveCount(0, {
      timeout: harnessResultTimeoutMs,
    });
  });
}
