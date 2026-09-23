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

  it("bridges small gaps (<= 800ms) between consecutive cues", () => {
    const srt = [
      "1",
      "00:00:01,000 --> 00:00:04,000",
      "Hello",
      "",
      "2",
      "00:00:04,400 --> 00:00:07,000",
      "World",
    ].join("\n");
    const converted = srtToVtt(srt);
    expect(converted).toBe(
      "WEBVTT\n\n1\n00:00:01.000 --> 00:00:04.400\nHello\n\n2\n00:00:04.400 --> 00:00:07.000\nWorld",
    );
  });

  it("adds a 300ms tail cushion for gaps larger than maxGapMs", () => {
    const srt = [
      "1",
      "00:00:01,000 --> 00:00:04,000",
      "First",
      "",
      "2",
      "00:00:06,000 --> 00:00:09,000",
      "Second",
    ].join("\n");
    const converted = srtToVtt(srt);
    expect(converted).toBe(
      "WEBVTT\n\n1\n00:00:01.000 --> 00:00:04.300\nFirst\n\n2\n00:00:06.000 --> 00:00:09.000\nSecond",
    );
  });

  it("preserves exact end time for the final cue", () => {
    const srt = [
      "1",
      "00:00:01,000 --> 00:00:03,000",
      "First",
      "",
      "2",
      "00:00:03,200 --> 00:00:06,500",
      "Final",
    ].join("\n");
    const converted = srtToVtt(srt);
    expect(converted).toContain("2\n00:00:03.200 --> 00:00:06.500\nFinal");
  });

  it("supports custom maxGapMs threshold", () => {
    const srt = [
      "1",
      "00:00:01,000 --> 00:00:04,000",
      "First",
      "",
      "2",
      "00:00:05,000 --> 00:00:08,000",
      "Second",
    ].join("\n");
    expect(srtToVtt(srt)).toContain("00:00:01.000 --> 00:00:04.300");
    expect(srtToVtt(srt, 1200)).toContain("00:00:01.000 --> 00:00:05.000");
  });

  it("bridges gaps for WebVTT formatted input with multiple cues", () => {
    const vtt = [
      "WEBVTT",
      "",
      "1",
      "00:00:01.000 --> 00:00:04.000",
      "First",
      "",
      "2",
      "00:00:04.500 --> 00:00:08.000",
      "Second",
    ].join("\n");
    const converted = srtToVtt(vtt);
    expect(converted).toBe(
      "WEBVTT\n\n1\n00:00:01.000 --> 00:00:04.500\nFirst\n\n2\n00:00:04.500 --> 00:00:08.000\nSecond",
    );
  });
});
