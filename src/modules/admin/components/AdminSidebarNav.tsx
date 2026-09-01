import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { useAuth } from "../../../contexts";
import { usePermissions } from "../../../hooks";
import { ADMIN_ROLE_NAMES, hasAdminRole } from "../roles";
import type { AdminResource } from "../roles";
import {
  ADMIN_ACTIONS,
  ADMIN_NAV_LABELS,
  ADMIN_NAV_SECTION_LABELS,
  ADMIN_RESOURCES,
} from "../constants";
import { cn } from "../../../design/helpers";
import { iconsLib } from "../../../assets";

interface IAdminNavItem {
  label: string;
  to: string;
  resource: AdminResource;
  action?: typeof ADMIN_ACTIONS.READ | typeof ADMIN_ACTIONS.CREATE;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  superAdminOnly?: boolean;
}

interface IAdminNavSection {
  id: string;
  label: string;
  items: IAdminNavItem[];
}

interface IAdminSidebarNavProps {
  onNavigate: () => void;
}

const navSections: IAdminNavSection[] = [
  {
    id: "overview",
    label: ADMIN_NAV_SECTION_LABELS.OVERVIEW,
    items: [
      {
        label: ADMIN_NAV_LABELS.ANALYTICS,
        to: AppRoutes.client.protected.admin.ANALYTICS,
        resource: ADMIN_RESOURCES.ANALYTICS,
        icon: iconsLib.chartBar,
      },
    ],
  },
  {
    id: "commerce",
    label: ADMIN_NAV_SECTION_LABELS.COMMERCE,
    items: [
      {
        label: ADMIN_NAV_LABELS.PRODUCTS,
        to: AppRoutes.client.protected.admin.PRODUCTS,
        resource: ADMIN_RESOURCES.PRODUCTS,
        icon: iconsLib.cube,
      },
      {
        label: ADMIN_NAV_LABELS.ACCESSES,
        to: AppRoutes.client.protected.admin.ACCESSES,
        resource: ADMIN_RESOURCES.ACCESSES,
        icon: iconsLib.shieldCheck,
      },
    ],
  },
  {
    id: "communication",
    label: ADMIN_NAV_SECTION_LABELS.COMMUNICATION,
    items: [
      {
        label: ADMIN_NAV_LABELS.NOTIFICATIONS,
        to: AppRoutes.client.protected.admin.NOTIFICATIONS,
        resource: ADMIN_RESOURCES.NOTIFICATIONS,
        icon: iconsLib.bellAlert,
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
    ],
  },
  {
    id: "access",
    label: ADMIN_NAV_SECTION_LABELS.IAM,
    items: [
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
    ],
  },
  {
    id: "support",
    label: ADMIN_NAV_SECTION_LABELS.SUPPORT,
    items: [
      {
        label: ADMIN_NAV_LABELS.FEEDBACK,
        to: AppRoutes.client.protected.admin.FEEDBACK,
        resource: ADMIN_RESOURCES.FEEDBACKS,
        icon: iconsLib.mail,
      },
    ],
  },
  {
    id: "observability",
    label: ADMIN_NAV_SECTION_LABELS.OBSERVABILITY,
    items: [
      {
        label: ADMIN_NAV_LABELS.LOGS,
        to: AppRoutes.client.protected.admin.LOGS,
        resource: ADMIN_RESOURCES.CLIENTS,
        icon: iconsLib.document,
      },
    ],
  },
];

export const AdminSidebarNav: React.FC<IAdminSidebarNavProps> = ({
  onNavigate,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const { currentUser } = useAuth();
  const { can, isLoading } = usePermissions();
  const hasAdminAccess = hasAdminRole(currentUser?.role_names);
  const isSuperAdmin =
    currentUser?.role_names?.includes(ADMIN_ROLE_NAMES.SUPER_ADMIN) ?? false;

  const enabledItems = useMemo(
    () =>
      navSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            !hasAdminAccess
              ? false
              : item.superAdminOnly
                ? isSuperAdmin
                : isLoading ||
                  can(item.action ?? ADMIN_ACTIONS.READ, item.resource),
          ),
        }))
        .filter((section) => section.items.length > 0),
    [can, hasAdminAccess, isLoading, isSuperAdmin],
  );

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }));
  };

  return (
    <nav className="flex-1 overflow-y-auto px-4 py-3">
      <div className="space-y-4">
        {enabledItems.map((section) => {
          const isCollapsed = collapsedSections[section.id] ?? false;

          return (
            <div key={section.id}>
              <button
                type="button"
                aria-expanded={!isCollapsed}
                aria-controls={`admin-nav-section-${section.id}`}
                onClick={() => toggleSection(section.id)}
                className="mb-2 flex h-7 w-full items-center justify-between rounded-md px-2 text-caption font-semibold text-base-content opacity-60 transition-colors hover:bg-base-200 hover:opacity-100"
              >
                <span>{section.label}</span>
                <iconsLib.chevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isCollapsed ? "-rotate-90" : "rotate-0",
                  )}
                />
              </button>
              <div
                id={`admin-nav-section-${section.id}`}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                  isCollapsed
                    ? "grid-rows-[0fr] opacity-0"
                    : "grid-rows-[1fr] opacity-100",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            cn(
                              "flex h-11 items-center gap-3 rounded-md px-3 text-body-m font-medium transition-colors",
                              isActive
                                ? "bg-primary text-navy-900 shadow-sm"
                                : "text-base-content opacity-70 hover:bg-base-200 hover:opacity-100",
                            )
                          }
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
