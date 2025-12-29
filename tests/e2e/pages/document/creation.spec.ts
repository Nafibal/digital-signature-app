import { test, expect } from "@playwright/test";
import {
  TEST_USER,
  generateDocumentTitle,
  generateDocumentType,
} from "../../utils/test-data";
import { documentSelectors, dashboardSelectors } from "../../utils/selectors";

test.describe("Document Creation Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("should complete full document creation workflow", async ({ page }) => {
    // Navigate to document creation page
    await page.click(dashboardSelectors.createDocumentButton);
    await page.waitForURL("/document");

    // Step 1: Fill document details
    const title = generateDocumentTitle();
    const type = generateDocumentType();
    const description = "Test document for E2E testing";

    await page.fill(documentSelectors.step1.titleInput, title);
    await page.selectOption(documentSelectors.step1.documentTypeSelect, type);
    await page.fill(documentSelectors.step1.descriptionTextarea, description);
    await page.click(documentSelectors.step1.nextButton);

    // Step 2: Select create mode
    await page.click(documentSelectors.step2.createModeTab);
    await page.click(documentSelectors.step2.nextButton);

    // Step 3a: Fill content
    const content = "<p>This is test content for the document.</p>";
    await page.click(documentSelectors.step3a.editor);
    await page.keyboard.type(content);
    await page.click(documentSelectors.step3a.nextButton);

    // Step 3b: Add signature
    await page.fill(
      documentSelectors.step3b.organizationInput,
      "Test Organization"
    );
    await page.fill(documentSelectors.step3b.signerNameInput, "John Doe");
    await page.fill(documentSelectors.step3b.positionInput, "Manager");
    await page.click(documentSelectors.step3b.nextButton);

    // Step 4: Final review
    await expect(
      page.locator(documentSelectors.step4.documentSummary)
    ).toBeVisible();
    await expect(
      page.locator(documentSelectors.step4.pdfPreview)
    ).toBeVisible();
    await page.click(documentSelectors.step4.signDocumentButton);

    // Verify success message
    await expect(
      page.locator(documentSelectors.step4.successMessage)
    ).toBeVisible();

    // Verify redirect to dashboard
    await page.waitForURL("/dashboard");
    await expect(page).toHaveURL("/dashboard");
  });

  test("should validate step 1 before proceeding", async ({ page }) => {
    // Navigate to document creation page
    await page.click(dashboardSelectors.createDocumentButton);
    await page.waitForURL("/document");

    // Try to proceed without filling title
    await page.click(documentSelectors.step1.nextButton);

    // Verify validation error
    await expect(
      page.locator(documentSelectors.step1.titleInput)
    ).toBeFocused();
  });

  test("should navigate between steps correctly", async ({ page }) => {
    // Navigate to document creation page
    await page.click(dashboardSelectors.createDocumentButton);
    await page.waitForURL("/document");

    // Fill step 1
    await page.fill(documentSelectors.step1.titleInput, "Test Document");
    await page.click(documentSelectors.step1.nextButton);

    // Go back to step 1
    await page.click(documentSelectors.step2.previousButton);
    await expect(
      page.locator(documentSelectors.step1.titleInput)
    ).toBeVisible();

    // Proceed to step 2
    await page.click(documentSelectors.step1.nextButton);
    await page.click(documentSelectors.step2.createModeTab);
    await page.click(documentSelectors.step2.nextButton);

    // Go back to step 2
    await page.click(documentSelectors.step3a.previousButton);
    await expect(
      page.locator(documentSelectors.step2.createModeTab)
    ).toBeVisible();
  });
});
