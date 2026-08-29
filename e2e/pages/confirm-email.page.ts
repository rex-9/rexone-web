import { type Locator, type Page } from "@playwright/test";

export class ConfirmEmailPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly inputs: Locator;
  readonly submitButton: Locator;
  readonly resendLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /^Verify Your Email$/i });
    this.inputs = page.locator('input[inputmode="numeric"]');
    this.submitButton = page.locator('[role="dialog"] button[type="submit"]');
    this.resendLink = page.getByText(/Did not receive the code\? Resend|Resend code in/i);
  }

  async waitForVisible() {
    await this.heading.waitFor({ state: "visible" });
  }

  async enterOtp(otp: string) {
    const firstInput = this.inputs.first();
    await firstInput.waitFor({ state: "visible" });
    await firstInput.click();
    await this.page.keyboard.press("ControlOrMeta+A");
    await this.page.keyboard.press("Backspace");
    await this.page.keyboard.type(otp, { delay: 30 });
  }

  async submit() {
    if (await this.submitButton.isEnabled()) {
      await this.submitButton.click();
    }
  }

  async clickResend() {
    await this.resendLink.click();
  }
}
