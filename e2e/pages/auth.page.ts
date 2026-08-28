import { type Locator, type Page } from "@playwright/test";
import AppRoutes from "../../src/AppRoutes";
import { DialogParams, DialogAuthSteps } from "../../src/modules/auth/constants";

export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly googleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder("your@email.com");
    this.continueButton = page.getByRole("button", { name: /^Continue$/i });
    this.googleButton = page.getByRole("button", { name: /Continue with Google/i });
  }

  async goto() {
    await this.page.goto(
      `${AppRoutes.client.public.ROOT}?${DialogParams.DIALOG}=${DialogParams.AUTH}&${DialogParams.STEP}=${DialogAuthSteps.INITIAL}`
    );
    await this.emailInput.waitFor({ state: "visible" });
  }

  async enterEmail(email: string) {
    await this.emailInput.waitFor({ state: "visible" });
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.continueButton.click();
  }

  async clickGoogle() {
    await this.googleButton.click();
  }
}
