// e2e/data/users.ts
//
// Centralized test data — like spec/factories/users.rb
// Uses seeded test users for confirmed sign-in/reset and dynamic users for registration.
//

export interface ITestUser {
  email: string;
  name: string;
  username: string;
  password: string; // 6-digit passcode
}

export type TestUser = ITestUser;

let userCounter = 0;

export function generateTestUser(prefix = "user"): TestUser {
  userCounter++;
  const uniqueId = `${Date.now()}_${userCounter}`;
  return {
    email: `e2e-${prefix}-${uniqueId}@rexone.test`,
    name: `E2E ${prefix} ${userCounter}`,
    username: `e2e_${prefix}_${uniqueId}`.substring(0, 25),
    password: "123456",
  };
}

export const users = {
  /**
   * Pre-existing confirmed user in the database (from seeds).
   */
  existing: {
    email: "just@admin.com",
    name: "Just Admin User",
    username: "justadmin",
    password: "123456",
  } satisfies TestUser,

  /**
   * Pre-existing confirmed super admin user (from seeds).
   * Used for isolated tests so cooldown on `existing` doesn't interfere.
   */
  superAdmin: {
    email: "super@admin.com",
    name: "Super Admin User",
    username: "superadmin",
    password: "111111",
  } satisfies TestUser,

  /**
   * Fresh signup user.
   */
  signup: {
    email: "e2e-signup@rexone.test",
    name: "E2E Signup",
    username: "e2e_signup",
    password: "654321",
  } satisfies TestUser,

  /**
   * User for password reset flow.
   */
  resetUser: {
    email: "just@admin.com",
    name: "Just Admin User",
    username: "justadmin",
    password: "123456",
  } satisfies TestUser,
};
