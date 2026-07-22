import { describe, expect, it } from "vitest";
import { isExpiredSessionError } from "./api.service";

describe("session error detection", () => {
  it("recognizes backend session-expiration errors with punctuation", () => {
    expect(isExpiredSessionError("Active session not found.")).toBe(true);
    expect(isExpiredSessionError("Signature has expired")).toBe(true);
    expect(isExpiredSessionError("No verification key available.")).toBe(true);
  });

  it("does not treat ordinary authorization failures as replaced sessions", () => {
    expect(isExpiredSessionError("Invalid passcode")).toBe(false);
  });
});
