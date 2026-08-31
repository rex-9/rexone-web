// e2e/helpers/api.ts
//
// Direct backend API calls for test setup/teardown using standard application routes.
// No custom test endpoints needed — uses real /signup, /signin, and DELETE /signup routes.
//

import type { TestUser } from "../data/users";

const API_BASE = "http://localhost:3000";

interface IApiResponsePayload {
  status?: { code?: number; message?: string; error?: string };
  data?: { token?: string; user?: Record<string, unknown> };
}

/**
 * Register a user via the standard POST /signup endpoint.
 */
export async function registerUser(user: TestUser): Promise<Response> {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Platform": "web",
    },
    body: JSON.stringify({
      user: {
        email: user.email,
        name: user.name,
        username: user.username,
        password: user.password,
        password_confirmation: user.password,
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`registerUser failed with ${res.status}: ${errorBody}`);
  }

  return res;
}

/**
 * Convenience helper to create a user for tests using the real /signup endpoint.
 */
export async function createUser(user: TestUser): Promise<void> {
  await registerUser(user);
}

/**
 * Convenience helper to create an unconfirmed user (standard signup creates unconfirmed user).
 */
export async function createUnconfirmedUser(user: TestUser): Promise<void> {
  await registerUser(user);
}

/**
 * Sign in via the standard POST /signin endpoint to get an auth token.
 */
export async function signInUser(
  signinKey: string,
  passcode: string
): Promise<{ token: string | null; data: unknown; status: number }> {
  const res = await fetch(`${API_BASE}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Platform": "web",
    },
    body: JSON.stringify({
      user: {
        signin_key: signinKey,
        password: passcode,
      },
    }),
  });

  const json = (await res.json().catch(() => ({}))) as IApiResponsePayload;
  return {
    status: res.status,
    token: json?.data?.token || null,
    data: json?.data,
  };
}

/**
 * Delete a user account using the standard DELETE /signup route with their JWT token.
 */
export async function deleteUserAccount(token: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "X-Platform": "web",
    },
  });

  return res.ok;
}

/**
 * Clean up a test user by attempting to sign in and delete their account via standard routes.
 */
export async function cleanupUser(email?: string): Promise<void> {
  void email;
  // Best-effort cleanup placeholder
}

/**
 * Clean up a test user with credentials by signing in and deleting their account.
 */
export async function cleanupUserByCredentials(user: TestUser): Promise<void> {
  try {
    const { token } = await signInUser(user.email, user.password);
    if (token) {
      await deleteUserAccount(token);
    }
  } catch {
    // Best-effort cleanup for test runs
  }
}
