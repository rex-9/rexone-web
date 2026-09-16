import { describe, it, expect, afterEach } from "vitest";
import { isRex9LandingDomain } from "./landingDomain.helper";

describe("landingDomain.helper", () => {
  afterEach(() => {
    delete (globalThis as unknown as { window?: unknown }).window;
  });

  const mockWindowHostname = (hostname: string) => {
    (globalThis as unknown as { window: { location: { hostname: string } } }).window = {
      location: { hostname },
    };
  };

  it("identifies rexone.rex9.me as the Rex9 landing domain", () => {
    expect(isRex9LandingDomain("rexone.rex9.me")).toBe(true);
  });

  it("handles case-insensitive and whitespace-padded hostnames", () => {
    expect(isRex9LandingDomain("  REXONE.REX9.ME  ")).toBe(true);
    expect(isRex9LandingDomain("RexOne.Rex9.Me")).toBe(true);
  });

  it("identifies www.rexone.rex9.me as the Rex9 landing domain", () => {
    expect(isRex9LandingDomain("www.rexone.rex9.me")).toBe(true);
    expect(isRex9LandingDomain("WWW.REXONE.REX9.ME")).toBe(true);
  });

  it("returns false for different hostnames and subdomains", () => {
    expect(isRex9LandingDomain("localhost")).toBe(false);
    expect(isRex9LandingDomain("127.0.0.1")).toBe(false);
    expect(isRex9LandingDomain("rexone.me")).toBe(false);
    expect(isRex9LandingDomain("www.rexone.me")).toBe(false);
    expect(isRex9LandingDomain("rex9.me")).toBe(false);
    expect(isRex9LandingDomain("api.rexone.me")).toBe(false);
    expect(isRex9LandingDomain("core.rex9.me")).toBe(false);
    expect(isRex9LandingDomain("anapana.rex9.me")).toBe(false);
    expect(isRex9LandingDomain("")).toBe(false);
    expect(isRex9LandingDomain(undefined)).toBe(false);
  });

  it("reads from window.location.hostname by default when window is defined", () => {
    mockWindowHostname("rexone.rex9.me");
    expect(isRex9LandingDomain()).toBe(true);

    mockWindowHostname("localhost");
    expect(isRex9LandingDomain()).toBe(false);

    mockWindowHostname("rexone.me");
    expect(isRex9LandingDomain()).toBe(false);
  });
});
