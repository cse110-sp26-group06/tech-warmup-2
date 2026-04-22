const path = require("node:path");
const { defineConfig, devices } = require("@playwright/test");

const repoRoot = __dirname;
const localServerPort = 4173;
const localServerUrl = `http://127.0.0.1:${localServerPort}`;

module.exports = defineConfig({
  testDir: path.join(repoRoot, "tests"),
  testMatch: ["**/*.spec.{js,ts}", "**/*-tests.ts"],
  outputDir: path.join(repoRoot, "test-results"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["json", { outputFile: path.join(repoRoot, "test-results", "results.json") }],
    ["html", { outputFolder: path.join(repoRoot, "playwright-report"), open: "never" }],
  ],
  use: {
    baseURL: localServerUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: `python3 -m http.server ${localServerPort} --bind 127.0.0.1`,
    cwd: repoRoot,
    url: localServerUrl,
    reuseExistingServer: !process.env.CI,
  },
});
