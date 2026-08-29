import { type Locator, type Page } from "@playwright/test";

export class SignUpInfoPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly usernameInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /^Complete Profile$/i });
    this.nameInput = page.getByPlaceholder("John Doe");
    this.usernameInput = page.getByPlaceholder("john_doe");
    this.submitButton = page.locator('[role="dialog"] button[type="submit"]');
  }

  async waitForVisible() {
    await this.nameInput.waitFor({ state: "visible" });
  }

  async enterInfo(name: string, username: string) {
    await this.nameInput.waitFor({ state: "visible" });
    await this.nameInput.fill(name);
    await this.usernameInput.fill(username);
  }

  async submit() {
    await this.submitButton.click();
  }
}
