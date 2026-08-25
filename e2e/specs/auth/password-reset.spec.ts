import { test, expect } from "@playwright/test";
import { users } from "../../data/users";
import { AuthPage } from "../../pages/auth.page";
import { SignInPasscodePage } from "../../pages/sign-in-passcode.page";
import { ForgotPasscodePage } from "../../pages/forgot-passcode.page";

test.describe("Authentication > Password reset", () => {
  let authPage: AuthPage;
  let signInPage: SignInPasscodePage;
  let forgotPage: ForgotPasscodePage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    signInPage = new SignInPasscodePage(page);
    forgotPage = new ForgotPasscodePage(page);
  });

  test("allows a user to request a password reset link", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.clickForgotPasscode();

    await forgotPage.waitForVisible();
    // Email should carry over
    await expect(forgotPage.emailInput).toHaveValue(users.existing.email);
    
    await forgotPage.submit();

    await expect(page.getByText(/Reset link sent to your email/i)).toBeVisible();
  });

  test("shows a cooldown timer after requesting a reset", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.clickForgotPasscode();

    await forgotPage.waitForVisible();
    await forgotPage.submit();

    await expect(page.getByText(/Reset link sent to your email/i)).toBeVisible();
    await expect(forgotPage.submitButton).toBeDisabled();
    await expect(forgotPage.submitButton).toHaveText(/Resend in/i);
  });
});
