import { describe, expect, it } from "vitest";
import AppRoutes from "../AppRoutes";
import { getSafePostAuthRoute } from "./authRedirect.util";

describe("getSafePostAuthRoute", () => {
  it("never redirects a newly signed-in user to sign out", () => {
    expect(getSafePostAuthRoute("/signout")).toBe(
      AppRoutes.client.protected.HOME,
    );
    expect(getSafePostAuthRoute("/signout?from=menu")).toBe(
      AppRoutes.client.protected.HOME,
    );
  });

  it("does not return authenticated users to public authentication routes", () => {
    expect(getSafePostAuthRoute("/")).toBe(AppRoutes.client.protected.HOME);
    expect(getSafePostAuthRoute("/signin")).toBe(
      AppRoutes.client.protected.HOME,
    );
  });

  it("preserves a valid protected destination", () => {
    expect(getSafePostAuthRoute("/payment?plan=yearly")).toBe(
      "/payment?plan=yearly",
    );
  });
});
