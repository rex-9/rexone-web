import { test, expect } from "@playwright/test";
import { users, generateTestUser } from "../../data/users";
import { AuthPage } from "../../pages/auth.page";
import { SignInPasswordPage } from "../../pages/sign-in-password.page";
import { SignUpPasswordPage } from "../../pages/sign-up-password.page";
import { HomePage } from "../../pages/home.page";

test.describe("Authentication > Password verification", () => {
  let authPage: AuthPage;
  let signInPage: SignInPasswordPage;
  let signUpPasswordPage: SignUpPasswordPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    signInPage = new SignInPasswordPage(page);
    signUpPasswordPage = new SignUpPasswordPage(page);
    homePage = new HomePage(page);
  });

  test("accepts a correct password and advances to the next step", async () => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.enterPassword(users.existing.password);
    await homePage.assertIsAuthenticated();
  });

  test("rejects a password mismatch in the confirmation step", async ({ page }) => {
    const user = generateTestUser("mismatch");
    await authPage.goto();
    await authPage.enterEmail(user.email);
    await authPage.submit();

    await signUpPasswordPage.waitForCreate();
    await signUpPasswordPage.enterPassword(user.password);

    await signUpPasswordPage.waitForConfirm();
    await signUpPasswordPage.enterPassword("000000"); // Mismatch

    await expect(page.getByText(/Passcodes do not match/i)).toBeVisible();
  });

  test("allows retry after entering an incorrect password", async ({ page }) => {
    await authPage.goto();
    await authPage.enterEmail(users.existing.email);
    await authPage.submit();

    await signInPage.waitForVisible();
    await signInPage.enterPassword("000000"); // Wrong
    
    await expect(page.getByText(/Incorrect password|Incorrect passcode/i)).toBeVisible();

    // Brief delay between tries for clean state transition
    await page.waitForTimeout(200);

    // Now enter correct password
    await signInPage.enterPassword(users.existing.password);
    await homePage.assertIsAuthenticated();
  });

  test("preserves the email across password create and confirm steps", async ({ page }) => {
    const user = generateTestUser("emailpersist");
    await authPage.goto();
    await authPage.enterEmail(user.email);
    await authPage.submit();

    await signUpPasswordPage.waitForCreate();
    expect(page.url()).toContain(`email=${encodeURIComponent(user.email)}`);

    await signUpPasswordPage.enterPassword(user.password);

    await signUpPasswordPage.waitForConfirm();
    expect(page.url()).toContain(`email=${encodeURIComponent(user.email)}`);
  });
});
