import { test, expect } from "@playwright/test";
import { cleanupUser } from "../../helpers/api";
import { generateTestUser } from "../../data/users";
import { AuthPage } from "../../pages/auth.page";
import { SignUpPasscodePage } from "../../pages/sign-up-passcode.page";
import { SignUpInfoPage } from "../../pages/sign-up-info.page";
import { ConfirmEmailPage } from "../../pages/confirm-email.page";

test.describe("Authentication > Sign up", () => {
  let authPage: AuthPage;
  let signUpPasscodePage: SignUpPasscodePage;
  let signUpInfoPage: SignUpInfoPage;
  let confirmEmailPage: ConfirmEmailPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    signUpPasscodePage = new SignUpPasscodePage(page);
    signUpInfoPage = new SignUpInfoPage(page);
    confirmEmailPage = new ConfirmEmailPage(page);
  });

  test("allows a new user to create an account with email", async () => {
    const user = generateTestUser("signup");
    await authPage.goto();
    await authPage.enterEmail(user.email);
    await authPage.submit();

    // Create passcode
    await signUpPasscodePage.waitForCreate();
    await signUpPasscodePage.enterPasscode(user.password);

    // Confirm passcode
    await signUpPasscodePage.waitForConfirm();
    await signUpPasscodePage.enterPasscode(user.password);

    // Sign up info
    await signUpInfoPage.waitForVisible();
    await signUpInfoPage.enterInfo(user.name, user.username);
    await signUpInfoPage.submit();

    // Confirm email step
    await confirmEmailPage.waitForVisible();
    await cleanupUser(user.email);
  });

  test("carries the email through every signup step", async ({ page }) => {
    const user = generateTestUser("flow");
    await authPage.goto();
    await authPage.enterEmail(user.email);
    await authPage.submit();

    await signUpPasscodePage.waitForCreate();
    await expect(page.getByText(user.email)).toBeVisible();

    await signUpPasscodePage.enterPasscode(user.password);

    await signUpPasscodePage.waitForConfirm();
    expect(page.url()).toContain(`email=${encodeURIComponent(user.email)}`);
  });

  test("auto-sanitizes the username to lowercase alphanumeric", async () => {
    const user = generateTestUser("sanitize");
    await authPage.goto();
    await authPage.enterEmail(user.email);
    await authPage.submit();

    await signUpPasscodePage.waitForCreate();
    await signUpPasscodePage.enterPasscode(user.password);

    await signUpPasscodePage.waitForConfirm();
    await signUpPasscodePage.enterPasscode(user.password);

    await signUpInfoPage.waitForVisible();
    await signUpInfoPage.enterInfo(user.name, "Invalid-User_Name!123");
    
    // The input itself auto sanitizes, so we check its value
    await expect(signUpInfoPage.usernameInput).toHaveValue("invaliduser_name123");
  });

  test("rejects registration with a name shorter than 2 characters", async ({ page }) => {
    const user = generateTestUser("shortname");
    await authPage.goto();
    await authPage.enterEmail(user.email);
    await authPage.submit();

    await signUpPasscodePage.waitForCreate();
    await signUpPasscodePage.enterPasscode(user.password);

    await signUpPasscodePage.waitForConfirm();
    await signUpPasscodePage.enterPasscode(user.password);

    await signUpInfoPage.waitForVisible();
    await signUpInfoPage.enterInfo("A", user.username);
    await signUpInfoPage.submit();

    await expect(page.getByText(/Please enter your full name/i)).toBeVisible();
  });

  test("rejects registration with a username shorter than 3 characters", async ({ page }) => {
    const user = generateTestUser("shortuser");
    await authPage.goto();
    await authPage.enterEmail(user.email);
    await authPage.submit();

    await signUpPasscodePage.waitForCreate();
    await signUpPasscodePage.enterPasscode(user.password);

    await signUpPasscodePage.waitForConfirm();
    await signUpPasscodePage.enterPasscode(user.password);

    await signUpInfoPage.waitForVisible();
    await signUpInfoPage.enterInfo(user.name, "ab");
    await signUpInfoPage.submit();

    await expect(page.getByText(/Username must be at least 3 characters/i)).toBeVisible();
  });
});
