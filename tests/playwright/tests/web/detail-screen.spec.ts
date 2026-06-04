import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("DETAIL SCREEN", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/api/seed");
  });

  
  test(
    "Product Detail View",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await expect(
        page.getByRole("heading", {
          name: "Wireless Headphones",
        })
      ).toBeVisible();

      // description paragraph specifically
      await expect(
        page.locator("p").filter({
          hasText: /Experience premium sound quality/i,
        })
      ).toBeVisible();

      await expect(page.getByText("$199 AUD")).toBeVisible();

      await expect(
        page.getByRole("button", {
          name: /add to cart/i,
        })
      ).toBeVisible();
    },
  );

  test(
    "Markdown Content Displays",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      const markdown = page.getByTestId("product-markdown");

      await expect(markdown).toContainText("Active Noise Cancellation");
      await expect(markdown).toContainText("USB-C Fast Charging");
    }
  );

  test(
    "Add Product To Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/login");

      await page
        .getByPlaceholder("Enter email")
        .fill("user@test.com");

      await page
        .getByPlaceholder("Enter password")
        .fill("user123");

      await page
        .getByRole("button", { name: /login/i })
        .click();

      await page.waitForURL("/");

      await page.goto("/product/wireless-headphones");

      await page
        .getByRole("button", {
          name: /add to cart/i,
        })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();
    },
  );
});