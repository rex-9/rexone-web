// src/services/api.service.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { StorageKeys } from "../constants";
import {
  getStoredToken,
  getApiError,
  parseRecord,
  parsePagyList,
} from "./api.service";
import { IApiResponse, IApiEnvelope, IJsonApiResource } from "../models";

describe("api.service pure functions", () => {
  describe("getStoredToken", () => {
    let mockStorage: Record<string, string> = {};

    beforeEach(() => {
      mockStorage = {};
      const fakeLocalStorage = {
        getItem: (key: string) => mockStorage[key] ?? null,
        setItem: (key: string, value: string) => {
          mockStorage[key] = value;
        },
        removeItem: (key: string) => {
          delete mockStorage[key];
        },
        clear: () => {
          mockStorage = {};
        },
      };

      vi.stubGlobal("window", { localStorage: fakeLocalStorage });
      vi.stubGlobal("localStorage", fakeLocalStorage);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("returns null when no token is present in localStorage", () => {
      expect(getStoredToken()).toBeNull();
    });

    it("parses and returns a JSON-serialized string token", () => {
      mockStorage[StorageKeys.TOKEN] = JSON.stringify("jwt_token_123");
      expect(getStoredToken()).toBe("jwt_token_123");
    });

    it("returns a raw plain string token when not serialized as JSON", () => {
      mockStorage[StorageKeys.TOKEN] = "plain_token_xyz";
      expect(getStoredToken()).toBe("plain_token_xyz");
    });

    it("returns null when window or localStorage is undefined", () => {
      vi.unstubAllGlobals();
      expect(getStoredToken()).toBeNull();
    });
  });

  describe("getApiError", () => {
    it("returns status.error when present in envelope", () => {
      const response: IApiResponse<IApiEnvelope<null>> = {
        data: {
          status: { code: 422, success: false, message: "Unprocessable entity", error: "Validation failed" },
          data: null,
        },
      };
      expect(getApiError(response, "Fallback")).toBe("Validation failed");
    });

    it("returns status.message when status.error is not present", () => {
      const response: IApiResponse<IApiEnvelope<null>> = {
        data: {
          status: { code: 400, success: false, message: "Bad request payload" },
          data: null,
        },
      };
      expect(getApiError(response, "Fallback")).toBe("Bad request payload");
    });

    it("returns top-level error when status is absent", () => {
      const response: IApiResponse<IApiEnvelope<null>> = {
        data: null,
        error: "Network connection lost",
      };
      expect(getApiError(response, "Fallback")).toBe("Network connection lost");
    });

    it("returns fallback message when no error strings are present", () => {
      const response: IApiResponse<IApiEnvelope<null>> = {
        data: null,
      };
      expect(getApiError(response, "Default error")).toBe("Default error");
    });
  });

  describe("parseRecord", () => {
    interface ITestItem {
      id: string;
      name: string;
      role: string;
    }

    it("unwraps JSON:API record with attributes and preserves top-level id", () => {
      const resource: IJsonApiResource<Omit<ITestItem, "id">> = {
        id: "usr_100",
        type: "user",
        attributes: {
          name: "Alice",
          role: "admin",
        },
      };

      const result = parseRecord<Omit<ITestItem, "id">>(resource);
      expect(result).toEqual({
        id: "usr_100",
        name: "Alice",
        role: "admin",
      });
    });

    it("returns the record as-is if already flat", () => {
      const flat = {
        id: "item_200",
        name: "Bob",
        role: "member",
      };

      const result = parseRecord<ITestItem>(flat);
      expect(result).toEqual(flat);
    });

    it("preserves attributes if attributes contain extra fields and sets id", () => {
      const resource = {
        id: "res_300",
        type: "product",
        attributes: {
          code: "PROD100",
          price: 5000,
        },
      };

      const result = parseRecord(resource);
      expect(result).toEqual({
        id: "res_300",
        code: "PROD100",
        price: 5000,
      });
    });
  });

  describe("parsePagyList", () => {
    interface IProductItem {
      id: string;
      code: string;
      price: number;
    }

    it("unwraps a collection of JSON:API resources and extracts pagination", () => {
      const apiResponse: IApiResponse<IApiEnvelope<IJsonApiResource<Omit<IProductItem, "id">>[]>> = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [
            {
              id: "prod_1",
              type: "product",
              attributes: { code: "CODE_A", price: 100 },
            },
            {
              id: "prod_2",
              type: "product",
              attributes: { code: "CODE_B", price: 200 },
            },
          ],
          meta: {
            pagination: {
              current_page: 1,
              total_pages: 5,
              total_count: 50,
              limit: 10,
              next_page: 2,
              prev_page: null,
            },
          },
        },
      };

      const { records, pagination } = parsePagyList<Omit<IProductItem, "id">>(apiResponse);

      expect(records).toHaveLength(2);
      expect(records[0]).toEqual({
        id: "prod_1",
        code: "CODE_A",
        price: 100,
      });
      expect(records[1]).toEqual({
        id: "prod_2",
        code: "CODE_B",
        price: 200,
      });
      expect(pagination).toEqual({
        current_page: 1,
        total_pages: 5,
        total_count: 50,
        limit: 10,
        next_page: 2,
        prev_page: null,
      });
    });

    it("handles null or non-array data gracefully", () => {
      const emptyResponse: IApiResponse<IApiEnvelope<IJsonApiResource<Omit<IProductItem, "id">>[]>> = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: null as unknown as IJsonApiResource<Omit<IProductItem, "id">>[],
        },
      };

      const { records, pagination } = parsePagyList<Omit<IProductItem, "id">>(emptyResponse);

      expect(records).toEqual([]);
      expect(pagination).toBeNull();
    });

    it("handles empty data array and missing pagination meta", () => {
      const response: IApiResponse<IApiEnvelope<IJsonApiResource<Omit<IProductItem, "id">>[]>> = {
        data: {
          status: { code: 200, success: true, message: "OK" },
          data: [],
        },
      };

      const { records, pagination } = parsePagyList<Omit<IProductItem, "id">>(response);

      expect(records).toEqual([]);
      expect(pagination).toBeNull();
    });
  });
});
