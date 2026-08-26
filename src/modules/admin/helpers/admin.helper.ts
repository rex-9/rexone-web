import { IAdminPageMeta } from "../constants";
import { ADMIN_CHAT_PAGE_META } from "../chat/constants";
import { ADMIN_NOTIFICATION_PAGE_META } from "../notifications/constants";
import { ADMIN_PRODUCT_PAGE_META } from "../products/constants";
import { ADMIN_ROLE_PAGE_META } from "../roles/constants";
import { ADMIN_USER_PAGE_META } from "../users/constants";

const adminPageMeta: Record<string, IAdminPageMeta> = {
  ...ADMIN_USER_PAGE_META,
  ...ADMIN_ROLE_PAGE_META,
  ...ADMIN_NOTIFICATION_PAGE_META,
  ...ADMIN_PRODUCT_PAGE_META,
  ...ADMIN_CHAT_PAGE_META,
};

export const formatAdminDate = (value: Date): string => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString();
};

export const truncateAdminText = (value: string | null | undefined): string => {
  if (!value) return "Not available";
  return value.length > 90 ? `${value.slice(0, 90)}...` : value;
};

export const getAdminPageMeta = (pathname: string): IAdminPageMeta | null => {
  const match = Object.keys(adminPageMeta).find((path) => {
    if (path === pathname) return true;

    const pattern = new RegExp(`^${path.replace(/:[^/]+/g, "[^/]+")}$`);
    return pattern.test(pathname);
  });

  return match ? adminPageMeta[match] : null;
};
