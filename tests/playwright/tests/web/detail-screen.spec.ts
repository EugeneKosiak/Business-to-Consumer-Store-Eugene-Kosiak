import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("DETAIL SCREEN", () => {

  test.beforeEach(async ({ page }) => {
    // Reset backend state before each test
    await page.goto("/api/seed");
  });

  test(
    "Product Detail View",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      // Open product detail page
      await page.goto("/product/wireless-headphones");

      // Check product title is visible
      await expect(
        page.getByRole("heading", {
          name: "Wireless Headphones",
        })
      ).toBeVisible();

      // Check product description text
      await expect(
        page.locator("p").filter({
          hasText: /Experience premium sound quality/i,
        })
      ).toBeVisible();

      // Check price is shown correctly
      await expect(page.getByText("$199 AUD")).toBeVisible();

      // Ensure add to cart button exists
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
      // Open product page
      await page.goto("/product/wireless-headphones");

      // Locate markdown content section
      const markdown = page.getByTestId("product-markdown");

      // Verify markdown content renders correctly
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
      // Login before adding to cart
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

      // Wait for successful login redirect
      await page.waitForURL("/");

      // Navigate to product page
      await page.goto("/product/wireless-headphones");

      // Add product to cart
      await page
        .getByRole("button", {
          name: /add to cart/i,
        })
        .click();

      // Confirm item added message
      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();
    }
  );
});