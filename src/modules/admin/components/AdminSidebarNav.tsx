import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { useAuth } from "../../../contexts";
import { usePermissions } from "../../../hooks";
import { ADMIN_ROLE_NAMES, hasAdminRole } from "../roles";
import type { AdminResource } from "../roles";
import {
  ADMIN_ACTIONS,
  ADMIN_NAV_LABELS,
  ADMIN_NAV_SECTION_LABEL,
  ADMIN_RESOURCES,
} from "../constants";
import { cn } from "../../../design/utils";
import { iconsLib } from "../../../assets";

interface IAdminNavItem {
  label: string;
  to: string;
  resource: AdminResource;
  action?: typeof ADMIN_ACTIONS.READ | typeof ADMIN_ACTIONS.CREATE;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  superAdminOnly?: boolean;
}

interface IAdminSidebarNavProps {
  onNavigate: () => void;
}

const navItems: IAdminNavItem[] = [
  {
    label: ADMIN_NAV_LABELS.USERS,
    to: AppRoutes.client.protected.admin.USERS,
    resource: ADMIN_RESOURCES.USERS,
    icon: iconsLib.userGroup,
    superAdminOnly: true,
  },
  {
    label: ADMIN_NAV_LABELS.ROLES,
    to: AppRoutes.client.protected.admin.ROLES,
    resource: ADMIN_RESOURCES.ROLES,
    icon: iconsLib.key,
    superAdminOnly: true,
  },
  {
    label: ADMIN_NAV_LABELS.NOTIFICATIONS,
    to: AppRoutes.client.protected.admin.NOTIFICATIONS,
    resource: ADMIN_RESOURCES.NOTIFICATIONS,
    icon: iconsLib.bellAlert,
  },
  {
    label: ADMIN_NAV_LABELS.PRODUCTS,
    to: AppRoutes.client.protected.admin.PRODUCTS,
    resource: ADMIN_RESOURCES.PRODUCTS,
    icon: iconsLib.cube,
  },
  {
    label: ADMIN_NAV_LABELS.CHAT_ROOMS,
    to: AppRoutes.client.protected.admin.CHAT_ROOMS,
    resource: ADMIN_RESOURCES.ROOMS,
    icon: iconsLib.chatBubbleLeftRight,
  },
  {
    label: ADMIN_NAV_LABELS.CHAT_MESSAGES,
    to: AppRoutes.client.protected.admin.CHAT_MESSAGES,
    resource: ADMIN_RESOURCES.MESSAGES,
    icon: iconsLib.inboxStack,
  },
];

export const AdminSidebarNav: React.FC<IAdminSidebarNavProps> = ({
  onNavigate,
}) => {
  const { currentUser } = useAuth();
  const { can, isLoading } = usePermissions();
  const hasAdminAccess = hasAdminRole(currentUser?.role_names);
  const isSuperAdmin =
    currentUser?.role_names?.includes(ADMIN_ROLE_NAMES.SUPER_ADMIN) ?? false;

  const enabledItems = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        isEnabled: !hasAdminAccess
          ? false
          : item.superAdminOnly
          ? isSuperAdmin
          : isLoading ||
            can(item.action ?? ADMIN_ACTIONS.READ, item.resource),
      })),
    [can, hasAdminAccess, isLoading, isSuperAdmin],
  );

  return (
    <nav className="flex-1 overflow-y-auto px-16 py-20">
      <div className="mb-[10px] px-8 text-caption font-semibold uppercase text-base-content opacity-50">
        {ADMIN_NAV_SECTION_LABEL}
      </div>
      <div className="space-y-[6px]">
        {enabledItems.map((item) => {
          const Icon = item.icon;
          return item.isEnabled ? (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex h-[44px] items-center gap-12 rounded-md px-12 text-body-m font-medium transition-colors",
                  isActive
                    ? "bg-primary text-navy-900 shadow-sm"
                    : "text-base-content opacity-70 hover:bg-base-200 hover:opacity-100",
                )
              }
            >
              <Icon className="h-[20px] w-[20px]" />
              <span>{item.label}</span>
            </NavLink>
          ) : null;
        })}
      </div>
    </nav>
  );
};
