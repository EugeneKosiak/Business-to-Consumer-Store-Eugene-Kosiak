import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeEach(async () => {
  // Reset database before each test so results are consistent
  await seed();
});

test.describe("ADMIN PURCHASE RECORDS", () => {

  test(
    "Purchase page requires authentication",
    {
      tag: "@a3",
    },
    async ({ page }) => {
      // Try accessing purchases page without being logged in
      await page.goto("/purchases");

      // Should redirect or show login screen
      await expect(
        page.getByText("Sign in to your account", {
          exact: true,
        })
      ).toBeVisible();
    }
  );

  test(
    "Admin can navigate to View Purchase records page",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      // Open admin dashboard (logged-in session)
      await userPage.goto("/");

      // Ensure "View Purchases" link exists
      await expect(
        userPage.getByText("View Purchases")
      ).toBeVisible();

      // Navigate to purchases page
      await userPage
        .locator('a:has-text("View Purchases")')
        .click();

      // Confirm navigation worked
      await expect(userPage).toHaveURL("/purchases");

      // Confirm purchases page loaded
      await expect(
        userPage.getByText("Purchase Records", {
          exact: true,
        })
      ).toBeVisible();
    }
  );

  test(
    "Displays purchase information",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/purchases");

      // Check purchase ID heading exists
      await expect(userPage.getByText(/Purchase #/)).toBeVisible();

      // Check customer info is shown
      await expect(userPage.getByText(/Customer:/)).toBeVisible();

      // Check email is shown
      await expect(userPage.getByText(/Email:/)).toBeVisible();

      // Check total amount is shown
      await expect(userPage.getByText(/Total:/)).toBeVisible();

      // Check purchased items section exists
      await expect(userPage.getByText("Purchased Items")).toBeVisible();
    }
  );

  test(
    "Displays purchased products with images",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/purchases");

      // Ensure product images are rendered
      const images = userPage.locator("img");
      await expect(images.first()).toBeVisible();

      // Ensure product name appears
      await expect(
        userPage.getByText("Wireless Headphones")
      ).toBeVisible();
    }
  );

  test(
    "Displays item quantity and totals",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/purchases");

      // Check quantity field is displayed
      await expect(
        userPage.getByText(/Quantity:/).first()
      ).toBeVisible();

      // Check total field is displayed
      await expect(
        userPage.getByText(/Total:/).first()
      ).toBeVisible();
    }
  );

  test(
    "Can return to dashboard",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/purchases");

      // Click back button to return home
      await userPage.getByText("← Back to Dashboard").click();

      // Confirm redirect to dashboard
      await expect(userPage).toHaveURL("/");

      // Confirm admin dashboard is visible again
      await expect(
        userPage.getByText("Admin of Products")
      ).toBeVisible();
    }
  );
});