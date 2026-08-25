import { type Page } from "@playwright/test";
import AppRoutes from "../../src/AppRoutes";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(AppRoutes.client.protected.HOME);
  }

  async assertIsAuthenticated() {
    await this.page.waitForURL(`**${AppRoutes.client.protected.HOME}*`, { timeout: 10000 });
  }
}
