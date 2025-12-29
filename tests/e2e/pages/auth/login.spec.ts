import { test, expect } from "@playwright/test";
import { TEST_USER } from "../../utils/test-data";
import { authSelectors } from "../../utils/selectors";

test.describe("User Login Flow", () => {
  test("should successfully login with valid credentials", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Verify login page is loaded
    await expect(
      page.locator(authSelectors.loginPage.emailInput)
    ).toBeVisible();
    await expect(
      page.locator(authSelectors.loginPage.passwordInput)
    ).toBeVisible();

    // Fill login form
    await page.fill(authSelectors.loginPage.emailInput, TEST_USER.email);
    await page.fill(authSelectors.loginPage.passwordInput, TEST_USER.password);

    // Submit form
    await page.click(authSelectors.loginPage.submitButton);

    // Verify redirect to dashboard after successful login
    await page.waitForURL("/dashboard");
    await expect(page).toHaveURL("/dashboard");

    // Verify user is on dashboard
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Submit form without filling any fields
    await page.click(authSelectors.loginPage.submitButton);

    // Verify validation errors are shown
    await expect(
      page.locator(authSelectors.loginPage.emailInput)
    ).toBeFocused();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    // Navigate to login page
    await page.goto("/login");

    // Fill login form with invalid credentials
    await page.fill(authSelectors.loginPage.emailInput, "invalid@example.com");
    await page.fill(authSelectors.loginPage.passwordInput, "wrongpassword");

    // Submit form
    await page.click(authSelectors.loginPage.submitButton);

    // Verify error message is shown
    // Note: Adjust selector based on actual error UI
    await expect(
      page.locator(authSelectors.loginPage.emailInput)
    ).toBeVisible();
  });

  test("should navigate to signup page when clicking signup link", async ({
    page,
  }) => {
    // Navigate to login page
    await page.goto("/login");

    // Click signup link
    await page.click(authSelectors.loginPage.signupLink);

    // Verify redirect to signup page
    await page.waitForURL("/signup");
    await expect(page).toHaveURL("/signup");
  });
});
