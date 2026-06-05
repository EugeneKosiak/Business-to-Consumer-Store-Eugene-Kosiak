import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

// Reset database before each test to ensure consistent state
test.beforeEach(async () => {
  await seed();
});

test.describe("ADMIN UPDATE SCREEN", () => {

  test(
    "Authorisation",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      // Try accessing product edit page without login
      await page.goto("/product/wireless-headphones");

      // Should show login screen if not authenticated
      await expect(
        page.getByText("Sign in to your account", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Update product form",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      // Open product edit page as logged-in user
      await userPage.goto("/product/wireless-headphones");

      const saveButton = await userPage.getByText("Save");

      // Validate required field: Title
      await userPage.getByLabel("Title").clear();
      await saveButton.click();
      await expect(userPage.getByText("Title is required")).toBeVisible();

      await userPage.getByLabel("Title").fill("New title");

      // Validate required field: Description
      await userPage.getByLabel("Description").clear();
      await saveButton.click();
      await expect(userPage.getByText("Description is required")).toBeVisible();

      // Validate required field: Content
      await userPage.getByLabel("Content").clear();
      await saveButton.click();
      await expect(userPage.getByText("Content is required")).toBeVisible();

      // Validate required field: Image URL
      await userPage.getByLabel("Image URL").clear();
      await saveButton.click();
      await expect(userPage.getByText("Image URL is required")).toBeVisible();

      // Validate required field: Tags
      await userPage.getByLabel("Tags").clear();
      await saveButton.click();
      await expect(
        userPage.getByText("At least one tag is required"),
      ).toBeVisible();
    },
  ),

  test(
    "Save product form",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      // Open product edit page
      await userPage.goto("/product/wireless-headphones");

      // Fill updated product details
      await userPage.getByLabel("Title").fill("New title");
      await userPage.getByLabel("Description").fill("New Description");
      await userPage.getByLabel("Content").fill("New Content");
      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await userPage.getByLabel("Tags").fill("Tag");

      // Submit form
      await userPage.getByText("Save").click();

      // Confirm update success message
      await expect(
        userPage.getByText("Product updated successfully"),
      ).toBeVisible();

      // Go back to dashboard
      await userPage.goto("/");

      // Verify updated product appears in list
      const article = await userPage.locator("article").first();
      await expect(article.getByText("New title")).toBeVisible();
    },
  ),

  test(
    "Create product form",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      // Open create product page
      await userPage.goto("/products/create");

      // Fill product creation form
      await userPage.getByLabel("Title").fill("New title");
      await userPage.getByLabel("Category").fill("React");
      await userPage.getByLabel("Description").fill("New Description");
      await userPage.getByLabel("Content").fill("New Content");
      await userPage.getByLabel("Brand").fill("Sony");
      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await userPage.getByLabel("Tags").fill("Tag");

      // Submit form
      await userPage.getByText("Save").click();

      // Confirm creation success message
      await expect(
        userPage.getByText("Product created successfully"),
      ).toBeVisible();

      // Return to dashboard
      await userPage.goto("/");

      // Verify new product appears in list
      const article = await userPage.locator("article").first();
      await expect(article.getByText("New title")).toBeVisible();
    },
  );
});