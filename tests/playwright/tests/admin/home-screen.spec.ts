import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

// Seed database once before running all tests in this file
test.beforeAll(async () => {
  await seed();
});

test.describe("ADMIN HOME SCREEN", () => {

  test(
    "Shows login screen",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      // Navigate to root (should show login for unauthenticated user)
      await page.goto("/");

      // Verify login UI elements are visible
      await expect(page.getByText("Sign In", { exact: true })).toBeVisible();

      await expect(
        page.getByText("Sign in to your account", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Can login",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");

      // Fill login form
      await page.getByLabel("Email", { exact: true }).fill("admin@test.com");
      await page.getByLabel("Password", { exact: true }).fill("admin123");

      // Submit login and wait for redirect
      await Promise.all([
        page.waitForURL("/"),
        page.getByText("Sign In", { exact: true }).click(),
      ]);

      // Verify admin dashboard loaded
      await expect(page.getByText("Admin of Products")).toBeVisible();

      // Check auth cookie exists
      const cookies = await page.context().cookies();
      const passwordCookie = cookies.find(
        (cookie) => cookie.name === "auth_token",
      );
      expect(passwordCookie).toBeDefined();

      // Logout flow
      await Promise.all([
        page.waitForResponse((res) =>
          res.url().includes("/api/auth") &&
          res.request().method() === "DELETE"
        ),
        page.getByText("Logout").click(),
      ]);

      // Ensure user is returned to login screen
      await expect(page.getByText("Sign in to your account")).toBeVisible();

      // Ensure no admin data remains visible
      await expect(page.locator("article")).toHaveCount(0);
    },
  );

  test(
    "Shows home screen to authorised user",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {

      // Load homepage as logged-in user
      await userPage.goto("/");

      // Verify dashboard is visible
      await expect(
        userPage.getByText("Admin of Products", { exact: true }),
      ).toBeVisible();

      // Verify products are rendered
      await expect(await userPage.locator("article").count()).toBe(4);
    },
  );

  test(
    "Can navigate to purchase records page",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {

      await userPage.goto("/");

      // Verify link exists
      await expect(
        userPage.getByText("View Purchases")
      ).toBeVisible();

      // Navigate to purchases page
      await userPage
        .locator('a:has-text("View Purchases")')
        .click();

      await userPage.waitForURL("**/purchases");

      // Verify purchases page loaded
      await expect(
        userPage.getByText("Purchase Records", {
          exact: true,
        })
      ).toBeVisible();
    },
  );
});