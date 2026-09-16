// e2e/helpers/global-teardown.ts
//
// Automatically invoked by Playwright at the end of test runs to ensure
// no ephemeral E2E test users pollute the development or test databases.

import { execSync } from "node:child_process";

export default async function globalTeardown() {
  try {
    execSync(
      'docker exec dev-rexone-core-api bin/rails runner "User.where(\'email LIKE ? OR email LIKE ?\', \'e2e-%\', \'%@rexone.test\').destroy_all"',
      { stdio: "ignore" }
    );
  } catch {
    // Best effort cleanup across environments
  }
}
