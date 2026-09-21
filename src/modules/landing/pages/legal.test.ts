// src/modules/landing/pages/legal.test.ts

import { describe, it, expect } from "vitest";
import AppRoutes from "../../../AppRoutes";

describe("Legal Routes & Constants", () => {
  it("defines public routes for privacy policy and terms and conditions", () => {
    expect(AppRoutes.client.public.PRIVACY_POLICY).toBe("/privacy");
    expect(AppRoutes.client.public.TERMS_AND_CONDITIONS).toBe("/terms");
  });

  it("ensures public legal routes are distinct from each other and root", () => {
    expect(AppRoutes.client.public.PRIVACY_POLICY).not.toBe(
      AppRoutes.client.public.TERMS_AND_CONDITIONS,
    );
    expect(AppRoutes.client.public.PRIVACY_POLICY).not.toBe(
      AppRoutes.client.public.ROOT,
    );
    expect(AppRoutes.client.public.TERMS_AND_CONDITIONS).not.toBe(
      AppRoutes.client.public.ROOT,
    );
  });
});
