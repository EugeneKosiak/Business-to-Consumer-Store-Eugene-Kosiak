import { expect, test } from "./fixtures";


test.describe("TAG SCREEN", () => {
  test("Existing Tag with one product", async ({ page }) => {
    await page.goto("/tags/wireless");

    const articles = await page.locator('[data-test-id^="b2c-"]');
    await expect(articles).toHaveCount(1);

    await expect(page.getByTestId("b2c-1")).toBeVisible();
    await expect(page.getByText("Wireless Headphones")).toBeVisible();
  });

  test("Existing Tag with multiple products", async ({ page }) => {
    await page.goto("/tags/gaming");

    const articles = await page.locator('[data-test-id^="b2c-"]');
    await expect(articles).toHaveCount(2);

    await expect(page.getByTestId("b2c-1")).toBeVisible(); // Wireless Headphones
    await expect(page.getByTestId("b2c-2")).toBeVisible(); // RGB Keyboard

    await expect(page.getByText("Wireless Headphones")).toBeVisible();
    await expect(page.getByText("RGB Gaming Keyboard")).toBeVisible();
  });

  test("Invalid Tag", async ({ page }) => {
    await page.goto("/tags/abc");

    const articles = await page.locator('[data-test-id^="b2c-"]');
    await expect(articles).toHaveCount(0);

    await expect(page.getByText("0 Products")).toBeVisible();
  });
});