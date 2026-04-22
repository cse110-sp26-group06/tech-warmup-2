const { test, expect } = require("@playwright/test");

test("trial 21 app loads", async ({ page }) => {
  await page.goto(
    encodeURI(
      "/Development/Gamification & Engagement Patterns - Zayn & Nicholas/Trial 21/index.html",
    ),
  );

  await expect(page).toHaveTitle(/Prompt Drop Casino/i);
  await expect(page.locator("body")).toContainText("SPIN");
});
