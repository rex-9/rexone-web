// src/modules/admin/notification/helpers/notificationTemplate.helper.ts

import type { IAdminNotificationTemplate } from "../types";
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_FIELDS,
} from "../constants";

export const TRANSACTIONAL_EVENTS = [
  "payment_success",
  "payment_failed",
  "subscription_created",
  "subscription_canceled",
  "subscription_resumed",
  "sign_in_alert",
] as const;

export interface ITemplateConfiguredChannels {
  [NOTIFICATION_FIELDS.SEND_SOCKET]: boolean;
  [NOTIFICATION_FIELDS.SEND_PUSH]: boolean;
  [NOTIFICATION_FIELDS.SEND_EMAIL]: boolean;
}

export const getTemplateConfiguredChannels = (
  template?: IAdminNotificationTemplate | null,
): ITemplateConfiguredChannels => {
  if (!template) {
    return {
      [NOTIFICATION_FIELDS.SEND_SOCKET]: false,
      [NOTIFICATION_FIELDS.SEND_PUSH]: false,
      [NOTIFICATION_FIELDS.SEND_EMAIL]: false,
    };
  }

  return {
    [NOTIFICATION_FIELDS.SEND_SOCKET]: Boolean(
      template.in_app_title || template.in_app_body,
    ),
    [NOTIFICATION_FIELDS.SEND_PUSH]: Boolean(
      template.push_title ||
        template.push_body ||
        template.push_template_id,
    ),
    [NOTIFICATION_FIELDS.SEND_EMAIL]: Boolean(
      template.email_subject ||
        template.email_body ||
        template.email_template_id,
    ),
  };
};

export const isTransactionalTemplate = (
  template: Pick<IAdminNotificationTemplate, "event" | "category">,
): boolean => {
  const event = (template.event || "").toLowerCase();
  const category = (template.category || "").toLowerCase();

  // Welcome is an onboarding event, not a payment/account transactional event
  if (event === "welcome") {
    return false;
  }

  if (
    TRANSACTIONAL_EVENTS.includes(
      event as (typeof TRANSACTIONAL_EVENTS)[number],
    )
  ) {
    return true;
  }

  if (category === NOTIFICATION_CATEGORIES.SYSTEM) {
    return true;
  }

  return false;
};

export const getTemplatePriorityTier = (
  template: IAdminNotificationTemplate,
): number => {
  // Tier 3 (Lowest priority): Transactional / System webhook-dependent templates
  if (isTransactionalTemplate(template)) {
    return 3;
  }

  const category = (template.category || "").toLowerCase();

  // Tier 0 (Highest priority): Marketing campaigns & promotional announcements
  if (category === NOTIFICATION_CATEGORIES.MARKETING) {
    return 0;
  }

  // Tier 1: General broadcast announcements
  if (category === NOTIFICATION_CATEGORIES.BROADCAST) {
    return 1;
  }

  // Tier 2: General non-transactional system (e.g. welcome)
  return 2;
};

export const getTemplateDropdownGroup = (
  template: IAdminNotificationTemplate,
): string => {
  if (isTransactionalTemplate(template)) {
    return "TRANSACTIONAL";
  }

  const category = (template.category || "").toLowerCase();
  if (category === NOTIFICATION_CATEGORIES.MARKETING) {
    return "MARKETING";
  }
  if (category === NOTIFICATION_CATEGORIES.BROADCAST) {
    return "BROADCAST";
  }

  return "SYSTEM";
};

export interface IFilterTemplatesOptions {
  includeTransactional?: boolean;
}

export const filterAndSortBroadcastTemplates = (
  templates: IAdminNotificationTemplate[],
  options: IFilterTemplatesOptions = {},
): IAdminNotificationTemplate[] => {
  const { includeTransactional = false } = options;

  const filtered = templates.filter((template) => {
    if (!includeTransactional && isTransactionalTemplate(template)) {
      return false;
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    const tierA = getTemplatePriorityTier(a);
    const tierB = getTemplatePriorityTier(b);

    if (tierA !== tierB) {
      return tierA - tierB;
    }

    return (a.name || a.event).localeCompare(b.name || b.event);
  });
};
