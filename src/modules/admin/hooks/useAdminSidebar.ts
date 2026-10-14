// src/modules/admin/hooks/useAdminSidebar.ts
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const adminSidebarCollapsedAtom = atomWithStorage<boolean>(
  "admin_sidebar_collapsed",
  false,
);

const adminSidebarMobileOpenAtom = atom<boolean>(false);

export const useAdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useAtom(adminSidebarCollapsedAtom);
  const [isMobileOpen, setIsMobileOpen] = useAtom(adminSidebarMobileOpenAtom);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);
  const openMobile = () => setIsMobileOpen(true);

  return {
    isCollapsed,
    isMobileOpen,
    setIsCollapsed,
    toggleCollapse,
    toggleMobile,
    closeMobile,
    openMobile,
  };
};

export default useAdminSidebar;
