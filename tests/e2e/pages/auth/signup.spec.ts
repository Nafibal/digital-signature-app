import { test, expect } from "@playwright/test";
import { generateTestEmail } from "../../utils/test-data";
import { authSelectors } from "../../utils/selectors";

test.describe("User Signup Flow", () => {
  test("should successfully signup a new user", async ({ page }) => {
    // Generate unique test credentials
    const email = generateTestEmail();
    const password = "Test123!@#";
    const name = "Test User";

    // Navigate to signup page
    await page.goto("/signup");

    // Verify signup page is loaded
    await expect(
      page.locator(authSelectors.signupPage.nameInput)
    ).toBeVisible();
    await expect(
      page.locator(authSelectors.signupPage.emailInput)
    ).toBeVisible();
    await expect(
      page.locator(authSelectors.signupPage.passwordInput)
    ).toBeVisible();

    // Fill signup form
    await page.fill(authSelectors.signupPage.nameInput, name);
    await page.fill(authSelectors.signupPage.emailInput, email);
    await page.fill(authSelectors.signupPage.passwordInput, password);

    // Submit form
    await page.click(authSelectors.signupPage.submitButton);

    // Verify redirect to dashboard after successful signup
    await page.waitForURL("/dashboard");
    await expect(page).toHaveURL("/dashboard");

    // Verify user is on dashboard
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    // Navigate to signup page
    await page.goto("/signup");

    // Submit form without filling any fields
    await page.click(authSelectors.signupPage.submitButton);

    // Verify validation errors are shown
    // Note: Adjust selector based on actual validation UI
    await expect(
      page.locator(authSelectors.signupPage.nameInput)
    ).toBeFocused();
  });

  test("should show error for weak password", async ({ page }) => {
    // Generate unique test credentials
    const email = generateTestEmail();
    const weakPassword = "123"; // Too short
    const name = "Test User";

    // Navigate to signup page
    await page.goto("/signup");

    // Fill signup form with weak password
    await page.fill(authSelectors.signupPage.nameInput, name);
    await page.fill(authSelectors.signupPage.emailInput, email);
    await page.fill(authSelectors.signupPage.passwordInput, weakPassword);

    // Submit form
    await page.click(authSelectors.signupPage.submitButton);

    // Verify password validation error
    // Note: Adjust selector based on actual validation UI
    await expect(
      page.locator(authSelectors.signupPage.passwordInput)
    ).toBeFocused();
  });

  test("should navigate to login page when clicking login link", async ({
    page,
  }) => {
    // Navigate to signup page
    await page.goto("/signup");

    // Click login link
    await page.click(authSelectors.signupPage.loginLink);

    // Verify redirect to login page
    await page.waitForURL("/login");
    await expect(page).toHaveURL("/login");
  });
});
