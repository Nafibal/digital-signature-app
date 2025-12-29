import { test as base } from "@playwright/test";
import { authSelectors } from "../utils/selectors";
import { TEST_USER } from "../utils/test-data";

/**
 * Authentication Fixture
 *
 * Provides helper methods for authentication in tests
 */
export const authTest = base.extend<{
  loginAsTestUser: () => Promise<void>;
  logout: () => Promise<void>;
  signupUser: (email: string, password: string, name: string) => Promise<void>;
}>({
  // Helper to login as test user
  loginAsTestUser: async ({ page }, use) => {
    const login = async () => {
      await page.goto("/login");
      await page.fill(authSelectors.loginPage.emailInput, TEST_USER.email);
      await page.fill(
        authSelectors.loginPage.passwordInput,
        TEST_USER.password
      );
      await page.click(authSelectors.loginPage.submitButton);
      // Wait for redirect to dashboard
      await page.waitForURL("/dashboard");
    };
    await use(login);
  },

  // Helper to logout
  logout: async ({ page }, use) => {
    const logout = async () => {
      await page.click(commonSelectors.navigation.logoutButton);
      // Wait for redirect to login
      await page.waitForURL("/login");
    };
    await use(logout);
  },

  // Helper to signup a new user
  signupUser: async ({ page }, use) => {
    const signup = async (email: string, password: string, name: string) => {
      await page.goto("/signup");
      await page.fill(authSelectors.signupPage.nameInput, name);
      await page.fill(authSelectors.signupPage.emailInput, email);
      await page.fill(authSelectors.signupPage.passwordInput, password);
      await page.click(authSelectors.signupPage.submitButton);
      // Wait for redirect to dashboard
      await page.waitForURL("/dashboard");
    };
    await use(signup);
  },
});

// Common selectors for logout
const commonSelectors = {
  navigation: {
    logoutButton: 'button:has-text("Logout")',
  },
};
