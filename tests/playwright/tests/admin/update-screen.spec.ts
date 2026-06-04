import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

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
      await page.goto("/product/wireless-headphones");

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
      await userPage.goto("/product/wireless-headphones");

      const saveButton = await userPage.getByText("Save");

      await userPage.getByLabel("Title").clear();
      await saveButton.click();
      await expect(userPage.getByText("Title is required")).toBeVisible();

      await userPage.getByLabel("Title").fill("New title");

      await userPage.getByLabel("Description").clear();
      await saveButton.click();
      await expect(userPage.getByText("Description is required")).toBeVisible();

      await userPage.getByLabel("Content").clear();
      await saveButton.click();
      await expect(userPage.getByText("Content is required")).toBeVisible();

      await userPage.getByLabel("Image URL").clear();
      await saveButton.click();
      await expect(userPage.getByText("Image URL is required")).toBeVisible();

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
      await userPage.goto("/product/wireless-headphones");

      await userPage.getByLabel("Title").fill("New title");
      await userPage.getByLabel("Description").fill("New Description");
      await userPage.getByLabel("Content").fill("New Content");
      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await userPage.getByLabel("Tags").fill("Tag");

      await userPage.getByText("Save").click();

      await expect(
        userPage.getByText("Product updated successfully"),
      ).toBeVisible();

      await userPage.goto("/");

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
      await userPage.goto("/products/create");

      await userPage.getByLabel("Title").fill("New title");
      await userPage.getByLabel("Category").fill("React");
      await userPage.getByLabel("Description").fill("New Description");
      await userPage.getByLabel("Content").fill("New Content");
      await userPage.getByLabel("Brand").fill("Sony");
      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await userPage.getByLabel("Tags").fill("Tag");

      await userPage.getByText("Save").click();

      await expect(
        userPage.getByText("Product created successfully"),
      ).toBeVisible();

      await userPage.goto("/");

      const article = await userPage.locator("article").first();
      await expect(article.getByText("New title")).toBeVisible();
    },
  );
});