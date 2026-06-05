import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

// Helper function to log in a test user before purchase-related actions
async function login(page: any) {
  await page.goto("/login");

  await page.getByPlaceholder("Enter email").fill("user@test.com");
  await page.getByPlaceholder("Enter password").fill("user123");

  await page.getByRole("button", { name: /login/i }).click();

  await page.waitForURL("/");
}

test.beforeAll(async () => {
  // Seed database once before running purchase tests
  await seed();
});

test.describe("PURCHASES SCREEN", () => {

  test.beforeEach(async ({ page }) => {
    // Reset session and ensure clean state before each test
    await page.context().clearCookies();

    await page.goto("/api/seed");

    await login(page);

    // Clear previous purchases to ensure test isolation
    await page.evaluate(async () => {
      await fetch("/api/purchase?reset=true", {
        method: "DELETE",
      });
    });
  });

  test(
    "Displays purchases after checkout",
    { 
      tag: "@a1" 
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page.getByRole("button", { name: /add to cart/i }).click();

      // Create purchase directly via API to simulate checkout flow
      await page.request.post("/api/purchase", {
        data: {
          cart: [
            {
              id: 1,
              title: "Wireless Headphones",
              price: 100,
              quantity: 1,
            },
          ],
        },
      });

      await page.goto("/purchases");

      // Ensure purchase record is created and displayed
      await expect(page.getByTestId("purchase-item")).toHaveCount(1);
      await expect(page.getByText(/wireless headphones/i)).toBeVisible();
    }
  );

  test(
    "Can remove purchase and show toast",
    { 
      tag: "@a1" 
    },
    async ({ page }) => {
      await page.goto("/product/wireless-headphones");

      await page.getByRole("button", { name: /add to cart/i }).click();

      // Create purchase entry for testing delete flow
      await page.request.post("/api/purchase", {
        data: {
          cart: [
            {
              id: 1,
              title: "Wireless Headphones",
              price: 100,
              quantity: 1,
            },
          ],
        }
      });

      await page.goto("/purchases");

      await expect(page.getByTestId("purchase-item").first()).toBeVisible();

      // Remove purchase record
      await page.getByRole("button", { name: "Remove" }).click();

      // Ensure it is removed from UI
      await expect(page.getByTestId("purchase-item")).toHaveCount(0);

      // Confirm success feedback
      await expect(
        page.getByText("Purchase removed successfully")
      ).toBeVisible();
    }
  );

  test(
    "Shows error toast when API fails",
    { 
      tag: "@a1" 
    },
    async ({ page }) => {

      // Mock DELETE request failure from API
      await page.route("**/api/purchase*", async (route) => {
        if (route.request().method() === "DELETE") {
          await route.fulfill({
            status: 404,
            contentType: "application/json",
            body: JSON.stringify({ error: "Purchase not found" }),
          });
        } else {
          await route.continue();
        }
      });

      await page.goto("/product/wireless-headphones");

      await page.getByRole("button", { name: /add to cart/i }).click();

      // Create purchase entry
      await page.request.post("/api/purchase", {
        data: {
          cart: [
            {
              id: 1,
              title: "Wireless Headphones",
              price: 100,
              quantity: 1,
            },
          ],
        }
      });

      await page.goto("/purchases");

      await expect(page.getByTestId("purchase-item").first()).toBeVisible();

      // Attempt deletion (will fail due to mocked API)
      await page.getByRole("button", { name: "Remove" }).click();

      // Confirm error handling UI appears
      await expect(page.getByText("Failed to remove purchase")).toBeVisible();
    }
  );
});