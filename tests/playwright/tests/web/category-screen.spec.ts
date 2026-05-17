import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("CATEGORY SCREEN", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test(
    "Existing Category - Electronics",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/electronics");

      // CATEGORY SCREEN > Displays products based on category from URL

      const products = page.locator('[data-test-id^="b2c-"]');
      await expect(products).toHaveCount(2);

      await expect(page.getByTestId("b2c-1")).toBeVisible(); // Wireless Headphones
      await expect(page.getByTestId("b2c-3")).toBeVisible(); // Smart Watch Pro

      await expect(page.getByTestId("b2c-2")).not.toBeVisible();
    },
  );

  test(
    "Existing Category - Gaming",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/gaming");

      // CATEGORY SCREEN > Displays only gaming products

      const products = page.locator('[data-test-id^="b2c-"]');
      await expect(products).toHaveCount(1);

      await expect(page.getByTestId("b2c-2")).toBeVisible(); // RGB Keyboard
    },
  );

  test(
    "Invalid Category",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/abc");

      // CATEGORY SCREEN > Displays empty state when no products match

      const products = page.locator('[data-test-id^="b2c-"]');
      await expect(products).toHaveCount(0);

      await expect(page.getByText("0 Products")).toBeVisible();
    },
  );
});