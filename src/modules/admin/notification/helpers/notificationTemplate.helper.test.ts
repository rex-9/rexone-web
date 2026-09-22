// src/modules/admin/notification/helpers/notificationTemplate.helper.test.ts

import { describe, expect, it } from "vitest";
import {
  filterAndSortBroadcastTemplates,
  getTemplateConfiguredChannels,
  getTemplateDropdownGroup,
  getTemplatePriorityTier,
  isTransactionalTemplate,
  TRANSACTIONAL_EVENTS,
} from "./notificationTemplate.helper";
import type { IAdminNotificationTemplate } from "../types";
import { NOTIFICATION_CATEGORIES } from "../constants";

describe("notificationTemplate.helper", () => {
  describe("getTemplateConfiguredChannels", () => {
    it("returns all false when template is null or undefined", () => {
      expect(getTemplateConfiguredChannels(null)).toEqual({
        send_socket: false,
        send_push: false,
        send_email: false,
      });
      expect(getTemplateConfiguredChannels(undefined)).toEqual({
        send_socket: false,
        send_push: false,
        send_email: false,
      });
    });

    it("detects configured channels correctly", () => {
      const templateOnlyInApp: IAdminNotificationTemplate = {
        event: "test_event",
        name: "Test InApp Only",
        category: "broadcast",
        clients: ["web"],
        in_app_title: "Title",
        in_app_body: "Body",
      };

      expect(getTemplateConfiguredChannels(templateOnlyInApp)).toEqual({
        send_socket: true,
        send_push: false,
        send_email: false,
      });

      const templatePushAndEmail: IAdminNotificationTemplate = {
        event: "test_push_email",
        name: "Push & Email",
        category: "marketing",
        clients: ["mobile", "web"],
        push_title: "Push title",
        email_subject: "Email subject",
      };

      expect(getTemplateConfiguredChannels(templatePushAndEmail)).toEqual({
        send_socket: false,
        send_push: true,
        send_email: true,
      });

      const templateAllChannels: IAdminNotificationTemplate = {
        event: "all_channels",
        name: "All Channels",
        category: "broadcast",
        clients: ["web", "mobile"],
        in_app_body: "Body",
        push_template_id: "push_tpl_1",
        email_template_id: "email_tpl_1",
      };

      expect(getTemplateConfiguredChannels(templateAllChannels)).toEqual({
        send_socket: true,
        send_push: true,
        send_email: true,
      });
    });
  });

  describe("isTransactionalTemplate", () => {
    it("identifies known transactional events", () => {
      TRANSACTIONAL_EVENTS.forEach((event) => {
        expect(
          isTransactionalTemplate({
            event,
            category: "system",
          }),
        ).toBe(true);
      });
    });

    it("identifies generic system category templates as transactional", () => {
      expect(
        isTransactionalTemplate({
          event: "invoice_overdue",
          category: NOTIFICATION_CATEGORIES.SYSTEM,
        }),
      ).toBe(true);
    });

    it("treats 'welcome' as non-transactional onboarding exception", () => {
      expect(
        isTransactionalTemplate({
          event: "welcome",
          category: NOTIFICATION_CATEGORIES.SYSTEM,
        }),
      ).toBe(false);
    });

    it("treats marketing and broadcast templates as non-transactional", () => {
      expect(
        isTransactionalTemplate({
          event: "summer_sale",
          category: NOTIFICATION_CATEGORIES.MARKETING,
        }),
      ).toBe(false);

      expect(
        isTransactionalTemplate({
          event: "maintenance_notice",
          category: NOTIFICATION_CATEGORIES.BROADCAST,
        }),
      ).toBe(false);
    });
  });

  describe("getTemplatePriorityTier and getTemplateDropdownGroup", () => {
    it("assigns proper priority tiers and groups", () => {
      const marketing: IAdminNotificationTemplate = {
        event: "promo",
        name: "Promo",
        category: "marketing",
        clients: ["web"],
      };
      expect(getTemplatePriorityTier(marketing)).toBe(0);
      expect(getTemplateDropdownGroup(marketing)).toBe("MARKETING");

      const broadcast: IAdminNotificationTemplate = {
        event: "notice",
        name: "Notice",
        category: "broadcast",
        clients: ["web"],
      };
      expect(getTemplatePriorityTier(broadcast)).toBe(1);
      expect(getTemplateDropdownGroup(broadcast)).toBe("BROADCAST");

      const welcome: IAdminNotificationTemplate = {
        event: "welcome",
        name: "Welcome",
        category: "system",
        clients: ["web"],
      };
      expect(getTemplatePriorityTier(welcome)).toBe(2);
      expect(getTemplateDropdownGroup(welcome)).toBe("SYSTEM");

      const paymentSuccess: IAdminNotificationTemplate = {
        event: "payment_success",
        name: "Payment Success",
        category: "system",
        clients: ["web"],
      };
      expect(getTemplatePriorityTier(paymentSuccess)).toBe(3);
      expect(getTemplateDropdownGroup(paymentSuccess)).toBe("TRANSACTIONAL");
    });
  });

  describe("filterAndSortBroadcastTemplates", () => {
    const templates: IAdminNotificationTemplate[] = [
      {
        event: "payment_success",
        name: "Payment Success",
        category: "system",
        clients: ["web"],
      },
      {
        event: "welcome",
        name: "Welcome Onboarding",
        category: "system",
        clients: ["web"],
      },
      {
        event: "holiday_sale",
        name: "Holiday Sale",
        category: "marketing",
        clients: ["web"],
      },
      {
        event: "platform_downtime",
        name: "Platform Downtime",
        category: "broadcast",
        clients: ["web"],
      },
      {
        event: "black_friday",
        name: "Black Friday Sale",
        category: "marketing",
        clients: ["web"],
      },
    ];

    it("excludes transactional templates by default", () => {
      const result = filterAndSortBroadcastTemplates(templates);

      expect(result.map((t) => t.event)).not.toContain("payment_success");
      expect(result.map((t) => t.event)).toEqual([
        "black_friday", // Marketing A-Z
        "holiday_sale", // Marketing A-Z
        "platform_downtime", // Broadcast
        "welcome", // General System
      ]);
    });

    it("includes transactional templates at lowest order when includeTransactional is true", () => {
      const result = filterAndSortBroadcastTemplates(templates, {
        includeTransactional: true,
      });

      expect(result.map((t) => t.event)).toEqual([
        "black_friday", // Tier 0
        "holiday_sale", // Tier 0
        "platform_downtime", // Tier 1
        "welcome", // Tier 2
        "payment_success", // Tier 3 (Lowest order)
      ]);
    });
  });
});
