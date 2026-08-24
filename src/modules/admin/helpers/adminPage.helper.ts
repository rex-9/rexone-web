import { ADMIN_PAGE_META, IAdminPageMeta } from "../constants";

export const formatAdminDate = (value: Date): string => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString();
};

export const truncateAdminText = (value: string | null | undefined): string => {
  if (!value) return "Not available";
  return value.length > 90 ? `${value.slice(0, 90)}...` : value;
};

export const getAdminPageMeta = (pathname: string): IAdminPageMeta | null => {
  const match = Object.keys(ADMIN_PAGE_META).find((path) => {
    if (path === pathname) return true;

    const pattern = new RegExp(`^${path.replace(/:[^/]+/g, "[^/]+")}$`);
    return pattern.test(pathname);
  });

  return match ? ADMIN_PAGE_META[match] : null;
};
