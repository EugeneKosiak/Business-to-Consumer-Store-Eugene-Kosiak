import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

test.describe("ADMIN LIST SCREEN", () => {
  test(
    "Show all products",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await expect(await userPage.locator("article").count()).toBe(4);
    },
  );

  test(
    "Filter by content",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage.getByLabel("Filter by Content:").fill("Wireless");
      await expect(await userPage.locator("article").count()).toBe(1);
      await expect(
        userPage.getByText("Wireless Headphones"),
      ).toBeVisible();

      await userPage.getByLabel("Filter by Content:").fill("RGB");
      await expect(
        userPage.getByText("RGB Gaming Keyboard"),
      ).toBeVisible();

      await userPage.getByLabel("Filter by Content:").clear();
      await expect(await userPage.locator("article").count()).toBe(4);
    },
  ),

  test(
    "Filter by tag",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage.getByLabel("Filter by Tag:").fill("Tech");
      await expect(await userPage.locator("article").count()).toBe(2);

      await expect(
        userPage.getByText("Wireless Headphones"),
      ).toBeVisible();

      await expect(
        userPage.getByText("Smart Watch Pro"),
      ).toBeVisible();

      await userPage.getByLabel("Filter by Tag:").clear();
    },
  ),

  test(
    "Filter by date",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage
        .getByLabel("Filter by Date Created:")
        .pressSequentially("10012025");

      await expect(await userPage.locator("article").count()).toBe(2);

      await expect(
        userPage.getByText("Wireless Headphones"),
      ).toBeVisible();

      await userPage.getByLabel("Filter by Date Created:").clear();
    },
  ),

  test(
    "Combine Filters",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage.getByLabel("Filter by Tag:").fill("Tech");
      await userPage
        .getByLabel("Filter by Date Created:")
        .pressSequentially("10012025");

      await expect(await userPage.locator("article").count()).toBe(1);

      await expect(
        userPage.getByText("Wireless Headphones"),
      ).toBeVisible();
    },
  ),

  test(
    "Sort items",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage.getByLabel("Sort By:").selectOption("title-asc");
      let articles = await userPage.locator("article").all();

      expect(await articles[0].innerText()).toContain("RGB Gaming Keyboard");
      expect(await articles[1].innerText()).toContain("Running Shoes");
      expect(await articles[2].innerText()).toContain("Smart Watch Pro");
      expect(await articles[3].innerText()).toContain("Wireless Headphones");

      await userPage.getByLabel("Sort By:").selectOption("title-desc");
      articles = await userPage.locator("article").all();

      expect(await articles[0].innerText()).toContain("Wireless Headphones");
      expect(await articles[3].innerText()).toContain("RGB Gaming Keyboard");

      await userPage.getByLabel("Sort By:").selectOption("date-asc");
      articles = await userPage.locator("article").all();

      await userPage.getByLabel("Sort By:").selectOption("date-desc");
      articles = await userPage.locator("article").all();
    },
  ),

  test(
    "List items",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      const article = await userPage.locator("article").first();

      await expect(article.getByText("Wireless Headphones")).toBeVisible();
      await expect(article.locator("img")).toBeVisible();

      await expect(
        article.getByText("#Audio, #Wireless, #Tech, #Gaming"),
      ).toBeVisible();

      await expect(
        article.getByText("Posted on"),
      ).toBeVisible();

      await expect(article.getByText("Active")).toBeVisible();
    },
  ),

  test(
    "Move to detail screen",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      await userPage.getByText("Wireless Headphones").click();

      await expect(userPage).toHaveURL(
        "/product/wireless-headphones",
      );
    },
  ),

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

  test(
    "Can delete a product",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await seed();
      await userPage.goto("/");

      // initial state
      await expect(userPage.locator("article")).toHaveCount(4);

      // pick first product title for verification
      const firstArticle = userPage.locator("article").first();
      const productName = await firstArticle
        .locator("h2")
        .innerText();

      // click delete button
      await firstArticle
        .getByTestId(/delete-/)
        .click();

      // modal should appear
      await expect(
        userPage.getByText("Delete Product")
      ).toBeVisible();

      await expect(
        userPage.getByText("Are you sure you want to delete this product?")
      ).toBeVisible();

      // confirm delete
      await userPage.getByRole("button", { name: "Yes, Delete" }).click();

      // product removed
      await expect(userPage.locator("article")).toHaveCount(3);

      // deleted product no longer visible
      await expect(
        userPage.getByText(productName)
      ).not.toBeVisible();
    },
  );
});