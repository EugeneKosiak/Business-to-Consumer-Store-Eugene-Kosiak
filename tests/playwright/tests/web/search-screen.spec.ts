import { expect, test } from "./fixtures";

test.describe("SEARCH SCREEN", () => {

  test(
    "Existing Search Result",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/search?q=headphones");

      // Verify that a known product appears in search results
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

      // Ensure keyword search returns matching products
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

      // Ensure empty search state is shown when no results exist
      await expect(
        page.getByText("0 Products"),
      ).toBeVisible();
    },
  );
});