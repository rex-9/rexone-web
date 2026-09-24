import { describe, expect, it } from "vitest";
import {
  DateTimePicker,
  toBrowserInputValue,
  toUtcOutputValue,
} from "./DateTimePicker";
import {
  localDateTimeInputToUtcIso,
  utcToLocalDateTimeInput,
} from "../../../helpers/date.helper";

describe("DateTimePicker", () => {
  it("is defined as a functional React component", () => {
    expect(DateTimePicker).toBeDefined();
    expect(typeof DateTimePicker).toBe("function");
  });

  describe("toBrowserInputValue (Server UTC -> Client Local)", () => {
    it("converts server UTC ISO timestamps to browser-local datetime-local format", () => {
      const utcTimestamp = "2026-09-24T12:30:00.000Z";
      const expectedLocal = utcToLocalDateTimeInput(utcTimestamp);

      expect(toBrowserInputValue(utcTimestamp, "datetime-local")).toBe(
        expectedLocal,
      );
    });

    it("preserves already normalized local datetime strings without double-shifting", () => {
      const localString = "2026-09-24T19:30";
      expect(toBrowserInputValue(localString, "datetime-local")).toBe(
        localString,
      );
    });

    it("converts server UTC ISO timestamps to browser-local date format (YYYY-MM-DD)", () => {
      const utcTimestamp = "2026-09-24T12:30:00.000Z";
      const result = toBrowserInputValue(utcTimestamp, "date");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("preserves already normalized local date strings", () => {
      const localDate = "2026-09-24";
      expect(toBrowserInputValue(localDate, "date")).toBe(localDate);
    });

    it("handles time values directly", () => {
      expect(toBrowserInputValue("08:30", "time")).toBe("08:30");
      expect(toBrowserInputValue("23:59", "time")).toBe("23:59");
    });

    it("returns empty string for null, undefined, or empty values", () => {
      expect(toBrowserInputValue("", "datetime-local")).toBe("");
      expect(toBrowserInputValue(null, "datetime-local")).toBe("");
      expect(toBrowserInputValue(undefined, "datetime-local")).toBe("");
      expect(toBrowserInputValue("", "date")).toBe("");
      expect(toBrowserInputValue("", "time")).toBe("");
    });
  });

  describe("toUtcOutputValue (Client Local -> Server UTC)", () => {
    it("converts browser-local datetime-local strings to UTC ISO format for Core", () => {
      const localInput = "2026-09-24T19:30";
      const expectedUtc = localDateTimeInputToUtcIso(localInput);

      expect(toUtcOutputValue(localInput, "datetime-local")).toBe(expectedUtc);
      expect(expectedUtc).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it("converts browser-local date strings to UTC ISO format for Core", () => {
      const localDate = "2026-09-24";
      const utcOutput = toUtcOutputValue(localDate, "date");

      expect(utcOutput).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it("preserves time strings for time mode", () => {
      expect(toUtcOutputValue("14:45", "time")).toBe("14:45");
    });

    it("returns empty string for empty inputs", () => {
      expect(toUtcOutputValue("", "datetime-local")).toBe("");
      expect(toUtcOutputValue("", "date")).toBe("");
      expect(toUtcOutputValue("", "time")).toBe("");
    });
  });

  describe("Round-trip UTC <-> Local Conversion Invariant", () => {
    it("guarantees client as local and server as UTC round-trip without drift", () => {
      const initialLocal = "2026-10-15T10:15";

      // 1. User picks in client -> emitted to server
      const serverUtc = toUtcOutputValue(initialLocal, "datetime-local");
      expect(serverUtc).toBeTruthy();

      // 2. Server sends UTC back -> loaded in client
      const clientLocal = toBrowserInputValue(serverUtc, "datetime-local");
      expect(clientLocal).toBe(initialLocal);

      // 3. Re-serialized to server -> identical UTC timestamp
      const roundTripUtc = toUtcOutputValue(clientLocal, "datetime-local");
      expect(roundTripUtc).toBe(serverUtc);
    });
  });
});
