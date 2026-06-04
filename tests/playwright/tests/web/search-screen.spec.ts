import { expect, test } from "./fixtures";


test.describe("SEARCH SCREEN", () => {
  test(
    "Existing Search Result",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/search?q=headphones");

      await expect(
        page.getByText("Wireless Headphones"),
      ).toBeVisible();
    },
  );

  test(
    "Search Finds Multiple Products",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/search?q=wireless");

      await expect(
        page.getByText("Wireless Headphones"),
      ).toBeVisible();
    },
  );

  test(
    "Invalid Search",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/search?q=abcxyz");

      await expect(
        page.getByText("0 Products"),
      ).toBeVisible();
    },
  );
});