import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("CATEGORY SCREEN", () => {

  test.beforeAll(async () => {
    // Seed database once before running category tests
    await seed();
  });

  test(
    "Existing Category - Electronics",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      // Navigate to electronics category page
      await page.goto("/category/electronics");

      // Select all product cards in this category
      const products = page.locator('[data-test-id^="b2c-"]');

      // Should only show 2 products in this category
      await expect(products).toHaveCount(2);

      // Verify specific products are visible
      await expect(page.getByTestId("b2c-1")).toBeVisible(); // Wireless Headphones
      await expect(page.getByTestId("b2c-3")).toBeVisible(); // Smart Watch Pro

      // Ensure unrelated product is not shown
      await expect(page.getByTestId("b2c-2")).not.toBeVisible();
    },
  );

  test(
    "Existing Category - Gaming",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      // Navigate to gaming category page
      await page.goto("/category/gaming");

      // Select all product cards in this category
      const products = page.locator('[data-test-id^="b2c-"]');

      // Should only show 1 gaming product
      await expect(products).toHaveCount(1);

      // Verify gaming product is visible
      await expect(page.getByTestId("b2c-2")).toBeVisible(); // RGB Keyboard
    },
  );

  test(
    "Invalid Category",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      // Navigate to non-existent category
      await page.goto("/category/abc");

      // No products should be found
      const products = page.locator('[data-test-id^="b2c-"]');
      await expect(products).toHaveCount(0);

      // Show empty state message
      await expect(page.getByText("0 Products")).toBeVisible();
    },
  );
});