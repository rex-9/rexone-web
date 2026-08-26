import AppRoutes from "../../../AppRoutes";
import { ADMIN_RESOURCES, IAdminPageMeta } from "../constants";

export const ADMIN_PRODUCT_PAGE_TITLES = {
  CREATE: "Create Product",
  EDIT: "Edit Product",
  LIST: "Products",
  RECYCLE_BIN: "Product Recycle Bin",
} as const;

export const ADMIN_PRODUCT_TABLE_HEADERS = {
  CYCLE: "Cycle",
  DISCARDED: "Discarded",
  PRICE: "Price",
  PRODUCT: "Product",
} as const;

export const ADMIN_PRODUCT_TABLE_KEYS = {
  ACTIONS: "actions",
  CYCLE: "cycle",
  LIFECYCLE_DATE: "lifecycle_date",
  PRICE: "price",
  PRODUCT: "product",
  STATUS: "active",
} as const;

export const ADMIN_PRODUCT_LABELS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export const ADMIN_PRODUCT_PAGE_META: Record<string, IAdminPageMeta> = {
  [AppRoutes.client.protected.admin.PRODUCTS]: {
    title: ADMIN_PRODUCT_PAGE_TITLES.LIST,
    actionLabel: "Create product",
    actionTo: AppRoutes.client.protected.admin.PRODUCT_CREATE,
    actionResource: ADMIN_RESOURCES.PRODUCTS,
  },
  [AppRoutes.client.protected.admin.PRODUCTS_RECYCLE_BIN]: {
    title: ADMIN_PRODUCT_PAGE_TITLES.RECYCLE_BIN,
    description: "Restore discarded products to make them active in Stripe again.",
  },
  [AppRoutes.client.protected.admin.PRODUCT_CREATE]: {
    title: ADMIN_PRODUCT_PAGE_TITLES.CREATE,
  },
  [AppRoutes.client.protected.admin.PRODUCT_EDIT]: {
    title: ADMIN_PRODUCT_PAGE_TITLES.EDIT,
  },
};

export const PRODUCT_TYPE = {
  FREE: "free",
  PREMIUM: "premium",
} as const;

export const PRODUCT_CYCLE = {
  ONE_TIME: "",
  MONTH: "month",
  YEAR: "year",
} as const;

export const PRODUCT_CURRENCY = {
  USD: "usd",
} as const;
