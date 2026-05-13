import { expect, test } from "./fixtures";

test.describe("CART SCREEN", () => {
  test(
    "Add Product To Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page.getByRole("button", { name: /add to cart/i }).click();

      await expect(page.getByText(/item added to cart/i)).toBeVisible();

      await page.goto("/cart");

      await expect(page.getByText("Wireless Headphones")).toBeVisible();

      await expect(page.getByText("$199.00 each × 1")).toBeVisible();
    },
  );

  test(
    "Remove Product From Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page.getByRole("button", { name: /add to cart/i }).click();

      await page.goto("/cart");

      await page.getByText("Remove").click();

      await expect(page.getByText("Cart is empty")).toBeVisible();
    },
  );

  test(
    "Mock Checkout",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page.getByRole("button", { name: /add to cart/i }).click();

      await page.goto("/cart");

      await page.getByRole("button", { name: /mock checkout/i }).click();

      await expect(page.getByText(/payment successful/i)).toBeVisible();

      await expect(page.getByText(/mock checkout complete/i)).toBeVisible();
    },
  );

  test(
    "Cart Quantity Increment Shows Max Message",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page.getByRole("button", { name: /add to cart/i }).click();

      await page.goto("/cart");

      const plus = page.getByRole("button", { name: "+" });

      for (let i = 0; i < 20; i++) {
        await plus.click();
      }

      await expect(page.getByTestId("max-qty-message")).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId("max-qty-message")).toContainText("Max quantity");
    },
  );

  test(
    "Cart Quantity Cannot Exceed Stock",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      for (let i = 0; i < 15; i++) {
        await page.getByRole("button", { name: /add to cart/i }).click();
      }

      await expect(
        page.getByText(/you already reached max stock/i),
      ).toBeVisible();

      await page.goto("/cart");

      const qtyText = await page.getByText(/×/).textContent();

      expect(qtyText).not.toContain("13");
      expect(qtyText).not.toContain("14");
      expect(qtyText).not.toContain("15");
    },
  );
});