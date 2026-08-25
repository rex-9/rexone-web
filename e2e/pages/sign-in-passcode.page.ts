import { type Locator, type Page } from "@playwright/test";

export class SignInPasscodePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly inputs: Locator;
  readonly submitButton: Locator;
  readonly forgotPasscodeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /^Sign In$/i });
    this.inputs = page.locator('input[id^="signin-passcode-"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.forgotPasscodeLink = page.getByText(/Forgot (your )?passcode\?/i);
  }

  async waitForVisible() {
    // Wait for the specific numeric passcode input on SigninPasscodeDialog (differentiates from InitialDialog)
    await this.inputs.first().waitFor({ state: "visible", timeout: 10000 });
  }

  async enterPasscode(passcode: string) {
    const firstInput = this.inputs.first();
    await firstInput.waitFor({ state: "visible" });
    if (await firstInput.isDisabled()) {
      return;
    }
    await firstInput.click();
    await this.page.keyboard.press("ControlOrMeta+A");
    await this.page.keyboard.press("Backspace");
    await this.page.keyboard.type(passcode, { delay: 100 });
    await this.page.waitForTimeout(100);
    // If submit button is enabled, click it to guarantee submission
    if (await this.submitButton.isVisible() && await this.submitButton.isEnabled()) {
      await this.submitButton.click().catch(() => {});
    }
  }

  async submit() {
    if (await this.submitButton.isVisible() && await this.submitButton.isEnabled()) {
      await this.submitButton.click();
    }
  }

  async clickForgotPasscode() {
    await this.forgotPasscodeLink.waitFor({ state: "visible" });
    await this.forgotPasscodeLink.click();
  }
}
