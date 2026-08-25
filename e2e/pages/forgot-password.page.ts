import { type Locator, type Page } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /^Reset Passcode$/i });
    this.emailInput = page.locator('input[id="forgot-email"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async waitForVisible() {
    await this.emailInput.waitFor({ state: "visible", timeout: 10000 });
  }

  async enterEmail(email: string) {
    await this.waitForVisible();
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.submitButton.waitFor({ state: "visible", timeout: 10000 });
    await this.submitButton.click();
  }
}
