export const formatAdminDate = (value: Date): string => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString();
};

export const truncateAdminText = (value: string | null | undefined): string => {
  if (!value) return "Not available";
  return value.length > 90 ? `${value.slice(0, 90)}...` : value;
};
