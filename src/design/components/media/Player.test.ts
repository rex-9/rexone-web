import { describe, it, expect } from "vitest";
import { srtToVtt } from "./Player";

describe("srtToVtt", () => {
  it("returns empty string when input is empty or null", () => {
    expect(srtToVtt("")).toBe("");
    expect(srtToVtt(null as unknown as string)).toBe("");
  });

  it("preserves content that is already WebVTT format", () => {
    const vtt = "WEBVTT\n\n1\n00:00:01.000 --> 00:00:04.000\nHello";
    expect(srtToVtt(vtt)).toBe(vtt);
  });

  it("converts standard SRT timestamps and adds WEBVTT header", () => {
    const srt = "1\n00:00:01,000 --> 00:00:04,000\nHello, world!";
    const converted = srtToVtt(srt);
    expect(converted).toBe("WEBVTT\n\n1\n00:00:01.000 --> 00:00:04.000\nHello, world!");
  });

  it("strips UTF-8 BOM if present", () => {
    const srt = "\uFEFF1\n00:00:01,000 --> 00:00:04,000\nHello with BOM";
    const converted = srtToVtt(srt);
    expect(converted).toBe("WEBVTT\n\n1\n00:00:01.000 --> 00:00:04.000\nHello with BOM");
  });

  it("pads single-digit hours to valid WebVTT two-digit hours", () => {
    const srt = "1\n1:00:01,500 --> 1:00:04,500\nSingle digit hour";
    const converted = srtToVtt(srt);
    expect(converted).toBe("WEBVTT\n\n1\n01:00:01.500 --> 01:00:04.500\nSingle digit hour");
  });

  it("handles CRLF line endings", () => {
    const srt = "1\r\n00:00:01,000 --> 00:00:04,000\r\nCRLF test";
    const converted = srtToVtt(srt);
    expect(converted).toBe("WEBVTT\n\n1\n00:00:01.000 --> 00:00:04.000\nCRLF test");
  });
});
