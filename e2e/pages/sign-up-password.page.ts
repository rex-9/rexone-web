import { type Locator, type Page } from "@playwright/test";

export class SignUpPasswordPage {
  readonly page: Page;
  readonly createHeading: Locator;
  readonly confirmHeading: Locator;
  readonly createInputs: Locator;
  readonly confirmInputs: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createHeading = page.getByRole("heading", {
      name: /^Create Passcode$/i,
    });
    this.confirmHeading = page.getByRole("heading", {
      name: /^Confirm Passcode$/i,
    });
    this.createInputs = page.locator('input[id^="create-password-"]');
    this.confirmInputs = page.locator('input[id^="confirm-password-"]');
    this.continueButton = page.locator('[role="dialog"] button[type="submit"]');
  }

  async waitForCreate() {
    await this.createInputs
      .first()
      .waitFor({ state: "visible", timeout: 10000 });
  }

  async waitForConfirm() {
    await this.confirmInputs
      .first()
      .waitFor({ state: "visible", timeout: 10000 });
  }

  async enterPassword(password: string) {
    const isConfirm = await this.confirmInputs.first().isVisible();
    const inputs = isConfirm ? this.confirmInputs : this.createInputs;
    await inputs.first().waitFor({ state: "visible", timeout: 10000 });
    for (let i = 0; i < 6; i++) {
      await inputs.nth(i).fill("");
    }
    await inputs.first().click();
    await this.page.keyboard.type(password, { delay: 60 });
    if (
      (await this.continueButton.isVisible()) &&
      (await this.continueButton.isEnabled())
    ) {
      await this.continueButton.click().catch(() => {});
    }
  }

  async submit() {
    if (
      (await this.continueButton.isVisible()) &&
      (await this.continueButton.isEnabled())
    ) {
      await this.continueButton.click().catch(() => {});
    }
  }
}
