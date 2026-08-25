import { test, expect } from "@playwright/test";
import { cleanupUser } from "../../helpers/api";
import { users, generateTestUser } from "../../data/users";
import { AuthPage } from "../../pages/auth.page";
import { SignUpPasswordPage } from "../../pages/sign-up-password.page";

test.describe("Authentication > SSO", () => {
  let authPage: AuthPage;
  let signUpPasswordPage: SignUpPasswordPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    signUpPasswordPage = new SignUpPasswordPage(page);

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

    await page.route("**/signin/google", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            token: "mock-jwt-token",
            user: { ...users.existing, id: "1" },
            success: true,
          },
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

  test("routes a new Google user through password setup", async ({ page }) => {
    await page.route("**/signin/google", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            password_required: true,
            challenge_token: "mock-challenge",
            user: { email: users.signup.email },
          },
        }),
      });
    });

    await authPage.goto();
    await authPage.clickGoogle();
  });

  test("routes an unconfirmed email user to password setup and confirms them when onboarding via Google SSO", async ({ page }) => {
    const droppedUser = generateTestUser("googledrop");

    await page.route("**/oauth2/v3/userinfo*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          sub: "1234567890",
          email: droppedUser.email,
          name: droppedUser.name,
          picture: "https://example.com/avatar.jpg",
        }),
      });
    });

    // Backend returns password_required: true with challenge token for unconfirmed user
    await page.route("**/signin/google", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            password_required: true,
            challenge_token: "mock-challenge-unconfirmed",
            user: { email: droppedUser.email, name: droppedUser.name },
          },
        }),
      });
    });

    // User completes 6-digit password setup
    await page.route("**/signin/google/complete", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            token: "mock-confirmed-jwt-token",
            user: {
              id: "unconfirmed-user-id",
              email: droppedUser.email,
              name: droppedUser.name,
              confirmed_at: new Date().toISOString(),
              provider: "google",
            },
          },
        }),
      });
    });

    await authPage.goto();
    await authPage.clickGoogle();
    await cleanupUser(droppedUser.email);
  });
});
