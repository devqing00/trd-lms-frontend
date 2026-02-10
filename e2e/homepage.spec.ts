import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/TRD LMS/);
  });

  test("displays hero section with headline", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Grow Your Skills")).toBeVisible();
  });

  test("navigation links are visible on desktop", async ({ page }) => {
    await expect(page.getByRole("link", { name: /browse courses/i })).toBeVisible();
  });

  test("skip to content link is functional", async ({ page }) => {
    // Tab to skip-to-content link
    await page.keyboard.press("Tab");
    const skipLink = page.getByText("Skip to main content");
    await expect(skipLink).toBeFocused();
  });

  test("categories section is present", async ({ page }) => {
    await expect(page.getByText("Explore Our Course Categories")).toBeVisible();
  });

  test("how it works section has 4 steps", async ({ page }) => {
    await expect(page.getByText("From Test to Certificate in 4 Steps")).toBeVisible();
    await expect(page.getByText("Take Prerequisite Test")).toBeVisible();
    await expect(page.getByText("Get Certified")).toBeVisible();
  });

  test("footer links are present", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer.getByText("TRD LMS")).toBeVisible();
    await expect(footer.getByText("Privacy Policy")).toBeVisible();
  });

  test("responsive: mobile nav toggle", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const menuButton = page.getByLabel("Toggle menu");
    await expect(menuButton).toBeVisible();
  });

  test("theme toggle is present", async ({ page }) => {
    await expect(page.getByLabel(/toggle theme/i)).toBeVisible();
  });
});
