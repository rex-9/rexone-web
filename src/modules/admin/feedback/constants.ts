import AppRoutes from "../../../AppRoutes";
import {
  BadgeCategories,
  BadgePriorities,
  BadgeStatuses,
} from "../../../design/constants";
import { ADMIN_RESOURCES, IAdminPageMeta } from "../constants";

export const ADMIN_FEEDBACK_STATUS = {
  NEW: BadgeStatuses.NEW,
  IN_PROGRESS: BadgeStatuses.IN_PROGRESS,
  RESOLVED: BadgeStatuses.RESOLVED,
  CLOSED: BadgeStatuses.CLOSED,
} as const;

export const ADMIN_FEEDBACK_CATEGORY = {
  BUG: BadgeCategories.BUG,
  FEATURE_REQUEST: BadgeCategories.FEATURE_REQUEST,
  IMPROVEMENT: BadgeCategories.IMPROVEMENT,
  GENERAL: BadgeCategories.GENERAL,
} as const;

export const ADMIN_FEEDBACK_PRIORITY = {
  LOW: BadgePriorities.LOW,
  MEDIUM: BadgePriorities.MEDIUM,
  HIGH: BadgePriorities.HIGH,
  URGENT: BadgePriorities.URGENT,
  CRITICAL: BadgePriorities.CRITICAL,
} as const;

export const ADMIN_FEEDBACK_PAGE_TITLES = {
  INBOX: "Feedback Inbox",
} as const;

export const ADMIN_FEEDBACK_TABLE_HEADERS = {
  CATEGORY: "Category",
  CONTENT: "Feedback Content",
  USER: "User",
  STATUS: "Status",
  PRIORITY: "Priority",
  CREATED_AT: "Received",
} as const;

export const ADMIN_FEEDBACK_TABLE_KEYS = {
  CATEGORY: "category",
  CONTENT: "content",
  USER: "user",
  STATUS: "status",
  PRIORITY: "priority",
  CREATED_AT: "created_at",
  ACTIONS: "actions",
} as const;

export const ADMIN_FEEDBACK_SORT_KEYS = {
  USER_NAME: "user_name",
  RATING: "rating",
  CREATED_AT: "created_at",
} as const;

export const ADMIN_FEEDBACK_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.FEEDBACK]: {
    title: ADMIN_FEEDBACK_PAGE_TITLES.INBOX,
    description:
      "Triage customer feedback, review bug reports, and prioritize feature requests.",
    actionResource: ADMIN_RESOURCES.FEEDBACKS,
  },
};
