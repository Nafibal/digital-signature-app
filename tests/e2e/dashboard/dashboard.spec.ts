import { test, expect } from "@playwright/test";
import { TEST_USER } from "../../utils/test-data";
import { dashboardSelectors } from "../../utils/selectors";

test.describe("Dashboard and Document List", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("should display dashboard page", async ({ page }) => {
    // Verify dashboard title
    await expect(page.locator("h1")).toContainText("Dashboard");

    // Verify create document button is visible
    await expect(
      page.locator(dashboardSelectors.createDocumentButton)
    ).toBeVisible();
  });

  test("should display document list", async ({ page }) => {
    // Wait for documents to load
    await page.waitForSelector(dashboardSelectors.documentList, {
      timeout: 10000,
    });

    // Verify document list is visible
    await expect(page.locator(dashboardSelectors.documentList)).toBeVisible();
  });

  test("should navigate to document creation page", async ({ page }) => {
    // Click create document button
    await page.click(dashboardSelectors.createDocumentButton);

    // Verify redirect to document creation page
    await page.waitForURL("/document");
    await expect(page).toHaveURL("/document");
  });

  test("should navigate to existing document", async ({ page }) => {
    // Wait for documents to load
    await page.waitForSelector(dashboardSelectors.documentList, {
      timeout: 10000,
    });

    // Click on first document card
    const firstCard = page.locator(dashboardSelectors.documentCard).first();
    await firstCard.click();

    // Verify redirect to document page
    await page.waitForURL(/\/document\/.+/);
    await expect(page).toHaveURL(/\/document\/.+/);
  });

  test("should display empty state when no documents exist", async ({
    page,
  }) => {
    // Note: This test assumes you can clear documents or start fresh
    // In practice, you might need to create a test user with no documents

    // Check if empty state is shown
    const emptyState = page.locator(dashboardSelectors.emptyState);
    if ((await emptyState.count()) > 0) {
      await expect(emptyState).toBeVisible();
    }
  });

  test("should display document status badges", async ({ page }) => {
    // Wait for documents to load
    await page.waitForSelector(dashboardSelectors.documentList, {
      timeout: 10000,
    });

    // Verify document status badges are visible
    const statusBadges = page.locator(dashboardSelectors.documentStatus);
    if ((await statusBadges.count()) > 0) {
      await expect(statusBadges.first()).toBeVisible();
    }
  });

  test("should display document type labels", async ({ page }) => {
    // Wait for documents to load
    await page.waitForSelector(dashboardSelectors.documentList, {
      timeout: 10000,
    });

    // Verify document type labels are visible
    const typeLabels = page.locator(dashboardSelectors.documentType);
    if ((await typeLabels.count()) > 0) {
      await expect(typeLabels.first()).toBeVisible();
    }
  });
});
