import { test, expect } from "@playwright/test";
import { users, generateTestUser } from "../../data/users";
import { AuthPage } from "../../pages/auth.page";
import { SignInPasscodePage } from "../../pages/sign-in-passcode.page";
import { SignUpPasscodePage } from "../../pages/sign-up-passcode.page";
import { HomePage } from "../../pages/home.page";

test.describe("Authentication > Passcode verification", () => {
  let authPage: AuthPage;
  let signInPage: SignInPasscodePage;
  let signUpPasscodePage: SignUpPasscodePage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    signInPage = new SignInPasscodePage(page);
    signUpPasscodePage = new SignUpPasscodePage(page);
    homePage = new HomePage(page);
  });

  test("accepts a correct passcode and advances to the next step", async () => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.enterPasscode(users.existing.password);
    await homePage.assertIsAuthenticated();
  });

  test("rejects a passcode mismatch in the confirmation step", async ({ page }) => {
    const user = generateTestUser("mismatch");
    await authPage.goto();
    await authPage.enterEmail(user.email);
    await authPage.submit();

    await signUpPasscodePage.waitForCreate();
    await signUpPasscodePage.enterPasscode(user.password);

    await signUpPasscodePage.waitForConfirm();
    await signUpPasscodePage.enterPasscode("000000"); // Mismatch

    await expect(page.getByText(/Passcodes do not match/i)).toBeVisible();
  });

  test("allows retry after entering an incorrect passcode", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.superAdmin.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.enterPasscode("000000"); // Wrong
    
    await expect(page.getByText(/Incorrect passcode/i)).toBeVisible();

    // Brief delay between tries for clean state transition
    await page.waitForTimeout(200);

    // Now enter correct passcode
    await signInPage.enterPasscode(users.superAdmin.password);
    await homePage.assertIsAuthenticated();
  });

  test("preserves the email across passcode create and confirm steps", async ({ page }) => {
    const user = generateTestUser("emailpersist");
    await authPage.goto();
    await authPage.enterEmail(user.email);
    await authPage.submit();

    await signUpPasscodePage.waitForCreate();
    expect(page.url()).toContain(`email=${encodeURIComponent(user.email)}`);

    await signUpPasscodePage.enterPasscode(user.password);

    await signUpPasscodePage.waitForConfirm();
    expect(page.url()).toContain(`email=${encodeURIComponent(user.email)}`);
  });
});
