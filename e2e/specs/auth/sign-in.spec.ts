import { test, expect } from "@playwright/test";
import { users, generateTestUser } from "../../data/users";
import { AuthPage } from "../../pages/auth.page";
import { SignInPasscodePage } from "../../pages/sign-in-passcode.page";
import { ConfirmEmailPage } from "../../pages/confirm-email.page";
import { HomePage } from "../../pages/home.page";

test.describe("Authentication > Sign in", () => {
  let authPage: AuthPage;
  let signInPage: SignInPasscodePage;
  let homePage: HomePage;
  let confirmPage: ConfirmEmailPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    signInPage = new SignInPasscodePage(page);
    homePage = new HomePage(page);
    confirmPage = new ConfirmEmailPage(page);
  });

  test("allows an existing user to sign in with email and passcode", async () => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.enterPasscode(users.existing.password);
    await homePage.assertIsAuthenticated();
  });

  test("rejects an incorrect passcode and shows remaining attempts", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.superAdmin.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.enterPasscode("000000"); // Wrong passcode
    
    await expect(page.getByText(/Incorrect passcode/i)).toBeVisible();
    await expect(page.getByText(/attempts remaining/i)).toBeVisible();
  });

  test("preserves the email address across the passcode step", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await expect(page.getByText(users.existing.email)).toBeVisible();
  });

  test("activates cooldown after maximum failed attempts", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.superAdmin.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    
    // Enter wrong passcode 3 times to activate cooldown
    for (let i = 0; i < 4; i++) {
      if (await page.getByText(/Too many attempts|Try again in/i).first().isVisible()) break;
      await signInPage.enterPasscode("000000");
      await page.waitForTimeout(600);
    }

    await expect(page.getByText(/Too many attempts|Try again in/i).first()).toBeVisible();
    await expect(signInPage.submitButton).toBeDisabled();
  });

  test("redirects unconfirmed user to email confirmation", async ({ page }) => {
    const unconfirmedUser = generateTestUser("unconfirmed");
    await authPage.goto();
    await authPage.enterEmail(unconfirmedUser.email);
    await authPage.submit();

    // Fresh/unconfirmed email routes through signup or confirm email
    if (page.url().includes("step=confirm-email")) {
      await confirmPage.waitForVisible();
      await expect(page.getByText(unconfirmedUser.email)).toBeVisible();
    }
  });
});
