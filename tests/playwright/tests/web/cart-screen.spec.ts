import { expect, test } from "./fixtures";

// Helper function to log a test user in before cart actions
async function login(page: any) {
  await page.goto("/login");

  // Fill login credentials
  await page
    .getByPlaceholder("Enter email")
    .fill("user@test.com");

  await page
    .getByPlaceholder("Enter password")
    .fill("user123");

  // Submit login form
  await page
    .getByRole("button", { name: /login/i })
    .click();

  // Wait until redirect to home page confirms login success
  await page.waitForURL("/");
}

test.describe("CART SCREEN", () => {

  test.beforeEach(async ({ page }) => {
    // Reset backend state before each test
    await page.goto("/api/seed");
  });

  test(
    "Add Product To Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      // Open product page
      await page.goto("/product/wireless-headphones");

      // Add item to cart
      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      // Confirm item was added
      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      // Allow UI/cart state update to complete
      await page.waitForTimeout(500);

      // Go to cart page
      await page.goto("/cart");

      // Verify product appears in cart
      await expect(
        page.getByText("Wireless Headphones")
      ).toBeVisible();

      // Verify price and quantity display
      await expect(
        page.getByText("$199.00 each × 1")
      ).toBeVisible();
    },
  );

  test(
    "Remove Product From Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      // Add product to cart first
      await page.goto("/product/wireless-headphones");
      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      await page.waitForTimeout(500);

      // Go to cart
      await page.goto("/cart");

      // Ensure item exists before removal
      await expect(
        page.getByText("Wireless Headphones")
      ).toBeVisible();

      // Remove item from cart
      await page.getByText("Remove").click();

      // Cart should now be empty
      await expect(
        page.getByText("Cart is empty")
      ).toBeVisible();
    },
  );

  test(
    "Checkout from Cart",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      // Add product
      await page.goto("/product/wireless-headphones");
      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await expect(page.getByText(/item added to cart/i)).toBeVisible();

      await page.waitForTimeout(500);

      await page.goto("/cart");

      // Ensure checkout button exists
      await expect(
        page.getByRole("button", { name: /checkout/i })
      ).toBeVisible();

      // Mock Stripe checkout page so test doesn't leave environment
      await page.route("**/checkout.stripe.com/**", async route => {
        await route.fulfill({
          status: 200,
          body: "<html><body>Mock Stripe</body></html>",
        });
      });

      // Trigger checkout
      await page.getByRole("button", { name: /checkout/i }).click();

      // Skip real Stripe flow and simulate success page
      await page.goto("/success?session_id=cs_test_mock");

      // Confirm success UI
      await expect(
        page.getByText(/payment successful/i)
      ).toBeVisible();

      // Confirm order processing message appears
      await expect(
        page.getByText(/processing your order/i)
      ).toBeVisible();
    }
  );

  test(
    "Cart Quantity Increment Shows Max Message",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      // Add product to cart
      await page.goto("/product/wireless-headphones");
      await page
        .getByRole("button", { name: /add to cart/i })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      await page.waitForTimeout(500);

      await page.goto("/cart");

      // Locate increment button
      const plus = page.getByRole("button", {
        name: "+",
      });

      await expect(plus).toBeVisible();

      // Try to exceed max quantity
      for (let i = 0; i < 20; i++) {
        await plus.click();
      }

      // Verify max quantity warning appears
      await expect(
        page.getByTestId("max-qty-message")
      ).toBeVisible();

      await expect(
        page.getByTestId("max-qty-message")
      ).toContainText("Max quantity");
    },
  );

  test(
    "Cart Quantity Cannot Exceed Stock",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await login(page);

      // Add product
      await page.goto("/product/wireless-headphones");
      await page
        .getByRole("button", {
          name: /add to cart/i,
        })
        .click();

      await expect(
        page.getByText(/item added to cart/i)
      ).toBeVisible();

      await page.waitForTimeout(500);

      await page.goto("/cart");

      const plus = page.getByRole("button", {
        name: "+",
      });

      // Attempt to exceed stock limit
      for (let i = 0; i < 20; i++) {
        await plus.click();
      }

      // Verify stock limit message appears
      await expect(
        page.getByTestId("max-qty-message")
      ).toBeVisible();

      await expect(
        page.getByTestId("max-qty-message")
      ).toContainText(
        'Max quantity of "Wireless Headphones" has been reached'
      );

      // Ensure quantity doesn't exceed allowed range
      const qtyText = await page.getByText(/×/).textContent();

      expect(qtyText).not.toContain("13");
      expect(qtyText).not.toContain("14");
      expect(qtyText).not.toContain("15");
    },
  );
});