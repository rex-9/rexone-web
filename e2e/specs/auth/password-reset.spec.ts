import { test, expect } from "@playwright/test";
import { users } from "../../data/users";
import { AuthPage } from "../../pages/auth.page";
import { SignInPasswordPage } from "../../pages/sign-in-password.page";
import { ForgotPasswordPage } from "../../pages/forgot-password.page";

test.describe("Authentication > Password reset", () => {
  let authPage: AuthPage;
  let signInPage: SignInPasswordPage;
  let forgotPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    signInPage = new SignInPasswordPage(page);
    forgotPage = new ForgotPasswordPage(page);
  });

  test("allows a user to request a password reset link", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.clickForgotPassword();

    await forgotPage.emailInput.waitFor({ state: "visible" });
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
    await signInPage.clickForgotPassword();

    await forgotPage.emailInput.waitFor({ state: "visible" });
    await forgotPage.submit();

    await expect(page.getByText(/Reset link sent to your email/i)).toBeVisible();
    await expect(forgotPage.submitButton).toBeDisabled();
    await expect(forgotPage.submitButton).toHaveText(/Resend in/i);
  });
});
