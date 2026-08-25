import { type Locator, type Page } from "@playwright/test";

export class ForgotPasscodePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /^Reset Passcode$/i });
    this.emailInput = page.getByPlaceholder("your@email.com");
    this.submitButton = page.locator('button[type="submit"]');
  }

  async waitForVisible() {
    await this.heading.waitFor({ state: "visible" });
  }

  async enterEmail(email: string) {
    await this.emailInput.waitFor({ state: "visible" });
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.submitButton.click();
  }
}
