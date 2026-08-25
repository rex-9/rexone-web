import { test } from "@playwright/test";
import { cleanupUser } from "../../helpers/api";
import { users } from "../../data/users";
import { AuthPage } from "../../pages/auth.page";

test.describe("Authentication > SSO", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    
    await page.route("**/oauth2/v3/userinfo*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          sub: "1234567890",
          email: users.existing.email,
          name: users.existing.name,
          picture: "https://example.com/pic.jpg",
        }),
      });
    });
    
    await page.route("**/v1/signin/google", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            token: "mock-jwt-token",
            user: { ...users.existing, id: "1" },
            success: true
          }
        }),
      });
    });
  });

  test.afterEach(async () => {
    await cleanupUser(users.existing.email);
    await cleanupUser(users.signup.email);
  });

  test("authenticates an existing Google user via intercepted OAuth callback", async () => {
    await authPage.goto();
    await authPage.clickGoogle();
  });

  test("routes a new Google user through passcode setup", async ({ page }) => {
    await page.route("**/v1/signin/google", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            success: false,
            passcodeRequired: true,
            challengeToken: "mock-challenge",
            user: { email: users.signup.email }
          }
        }),
      });
    });

    await authPage.goto();
    await authPage.clickGoogle();
  });
});
