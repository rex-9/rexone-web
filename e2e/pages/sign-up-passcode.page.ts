import { type Locator, type Page } from "@playwright/test";

export class SignUpPasscodePage {
  readonly page: Page;
  readonly createHeading: Locator;
  readonly confirmHeading: Locator;
  readonly createInputs: Locator;
  readonly confirmInputs: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createHeading = page.getByRole("heading", { name: /^Create Passcode$/i });
    this.confirmHeading = page.getByRole("heading", { name: /^Confirm Passcode$/i });
    this.createInputs = page.locator('input[id^="create-passcode-"]');
    this.confirmInputs = page.locator('input[id^="confirm-passcode-"]');
    this.continueButton = page.getByRole("button", { name: /^Continue$/i });
  }

  async waitForCreate() {
    await this.createInputs.first().waitFor({ state: "visible", timeout: 10000 });
  }

  async waitForConfirm() {
    await this.confirmInputs.first().waitFor({ state: "visible", timeout: 10000 });
  }

  async enterPasscode(passcode: string) {
    const input = (await this.confirmInputs.first().isVisible())
      ? this.confirmInputs.first()
      : this.createInputs.first();

    await input.waitFor({ state: "visible" });
    await input.click();
    await this.page.keyboard.press("ControlOrMeta+A");
    await this.page.keyboard.press("Backspace");
    await this.page.keyboard.type(passcode, { delay: 100 });
    if (await this.continueButton.isVisible() && await this.continueButton.isEnabled()) {
      await this.continueButton.click().catch(() => {});
    }
  }

  async submit() {
    if (await this.continueButton.isVisible() && await this.continueButton.isEnabled()) {
      await this.continueButton.click().catch(() => {});
    }
  }
}
