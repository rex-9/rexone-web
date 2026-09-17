import { describe, expect, it } from "vitest";
import { getAssetTitle } from "./constants";

describe("getAssetTitle", () => {
  it("prefers a trimmed title over storage name", () => {
    expect(
      getAssetTitle({ title: "  My Video.mp4  ", name: "uuid-storage.mp4" }),
    ).toBe("My Video.mp4");
  });

  it("falls back to name when title is missing, blank, or null", () => {
    expect(getAssetTitle({ name: "avatar.png" })).toBe("avatar.png");
    expect(getAssetTitle({ title: "   ", name: "avatar.png" })).toBe(
      "avatar.png",
    );
    expect(getAssetTitle({ title: null, name: "avatar.png" })).toBe(
      "avatar.png",
    );
  });

  it("returns an empty string when no asset is provided", () => {
    expect(getAssetTitle()).toBe("");
    expect(getAssetTitle(null)).toBe("");
  });
});
