import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

// Seed database before running admin list screen tests
test.beforeAll(async () => {
  await seed();
});

test.describe("ADMIN LIST SCREEN", () => {

  // Verify all products load on initial page render
  test(
    "Show all products",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // Expect all seeded products to be visible
      await expect(await userPage.locator("article").count()).toBe(4);
    },
  );

  // Test filtering products by title/content text
  test(
    "Filter by content",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // Filter by "Wireless"
      await userPage.getByLabel("Filter by Content:").fill("Wireless");
      await expect(await userPage.locator("article").count()).toBe(1);
      await expect(
        userPage.getByText("Wireless Headphones"),
      ).toBeVisible();

      // Filter by "RGB"
      await userPage.getByLabel("Filter by Content:").fill("RGB");
      await expect(
        userPage.getByText("RGB Gaming Keyboard"),
      ).toBeVisible();

      // Clear filter and restore full list
      await userPage.getByLabel("Filter by Content:").clear();
      await expect(await userPage.locator("article").count()).toBe(4);
    },
  ),

  // Test filtering products by tag/category
  test(
    "Filter by tag",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // Filter by Tech tag
      await userPage.getByLabel("Filter by Tag:").fill("Tech");
      await expect(await userPage.locator("article").count()).toBe(2);

      // Verify correct items appear
      await expect(
        userPage.getByText("Wireless Headphones"),
      ).toBeVisible();

      await expect(
        userPage.getByText("Smart Watch Pro"),
      ).toBeVisible();

      // Clear tag filter
      await userPage.getByLabel("Filter by Tag:").clear();
    },
  ),

  // Test filtering by creation date
  test(
    "Filter by date",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // Enter date filter (MMDDYYYY format)
      await userPage
        .getByLabel("Filter by Date Created:")
        .pressSequentially("10012025");

      // Expect filtered results
      await expect(await userPage.locator("article").count()).toBe(2);

      await expect(
        userPage.getByText("Wireless Headphones"),
      ).toBeVisible();

      // Clear date filter
      await userPage.getByLabel("Filter by Date Created:").clear();
    },
  ),

  // Test combining multiple filters together
  test(
    "Combine Filters",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // Apply tag filter
      await userPage.getByLabel("Filter by Tag:").fill("Tech");

      // Apply date filter at same time
      await userPage
        .getByLabel("Filter by Date Created:")
        .pressSequentially("10012025");

      // Only one product should match both filters
      await expect(await userPage.locator("article").count()).toBe(1);

      await expect(
        userPage.getByText("Wireless Headphones"),
      ).toBeVisible();
    },
  ),

  // Test sorting functionality
  test(
    "Sort items",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // Sort by title ascending
      await userPage.getByLabel("Sort By:").selectOption("title-asc");
      let articles = await userPage.locator("article").all();

      expect(await articles[0].innerText()).toContain("RGB Gaming Keyboard");
      expect(await articles[1].innerText()).toContain("Running Shoes");
      expect(await articles[2].innerText()).toContain("Smart Watch Pro");
      expect(await articles[3].innerText()).toContain("Wireless Headphones");

      // Sort by title descending
      await userPage.getByLabel("Sort By:").selectOption("title-desc");
      articles = await userPage.locator("article").all();

      expect(await articles[0].innerText()).toContain("Wireless Headphones");
      expect(await articles[3].innerText()).toContain("RGB Gaming Keyboard");

      // Sort by date ascending
      await userPage.getByLabel("Sort By:").selectOption("date-asc");
      articles = await userPage.locator("article").all();

      // Sort by date descending
      await userPage.getByLabel("Sort By:").selectOption("date-desc");
      articles = await userPage.locator("article").all();
    },
  ),

  // Verify individual product card layout/content
  test(
    "List items",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      const article = await userPage.locator("article").first();

      // Check product title and image
      await expect(article.getByText("Wireless Headphones")).toBeVisible();
      await expect(article.locator("img")).toBeVisible();

      // Check tags display correctly
      await expect(
        article.getByText("#Audio, #Wireless, #Tech, #Gaming"),
      ).toBeVisible();

      // Check metadata labels
      await expect(
        article.getByText("Posted on"),
      ).toBeVisible();

      await expect(article.getByText("Active")).toBeVisible();
    },
  ),

  // Navigate to product detail page
  test(
    "Move to detail screen",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage.getByText("Wireless Headphones").click();

      // Verify route change
      await expect(userPage).toHaveURL(
        "/product/wireless-headphones",
      );
    },
  ),

  // Navigate to product creation page
  test(
    "Move to create product screen",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await expect(userPage.getByText("Create Product")).toBeVisible();

      await userPage.locator('a:has-text("Create Product")').click();

      await expect(userPage).toHaveURL("/products/create");
    },
  );

  // Test deleting a product with confirmation modal
  test(
    "Can delete a product",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {

      // Reset seed state for consistent test data
      await seed();
      await userPage.goto("/");

      // Confirm initial product count
      await expect(userPage.locator("article")).toHaveCount(4);

      // Get first product for deletion
      const firstArticle = userPage.locator("article").first();
      const productName = await firstArticle
        .locator("h2")
        .innerText();

      // Click delete button
      await firstArticle.getByTestId(/delete-/).click();

      // Confirm modal appears
      await expect(
        userPage.getByText("Delete Product")
      ).toBeVisible();

      await expect(
        userPage.getByText("Are you sure you want to delete this product?")
      ).toBeVisible();

      // Confirm deletion
      await userPage.getByRole("button", { name: "Yes, Delete" }).click();

      // Ensure product removed
      await expect(userPage.locator("article")).toHaveCount(3);

      // Ensure deleted product is no longer visible
      await expect(
        userPage.getByText(productName)
      ).not.toBeVisible();
    },
  );
});