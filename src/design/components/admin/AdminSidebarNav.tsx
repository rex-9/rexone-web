import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  InboxStackIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import AppRoutes from "../../../AppRoutes";
import { usePermissions } from "../../../hooks";
import { AdminResource } from "../../../models";
import { cn } from "../../utils";

interface IAdminNavItem {
  label: string;
  to: string;
  resource: AdminResource;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface AdminSidebarNavProps {
  onNavigate: () => void;
}

const navItems: IAdminNavItem[] = [
  {
    label: "Users",
    to: AppRoutes.client.protected.ADMIN_USERS,
    resource: "users",
    icon: UserGroupIcon,
  },
  {
    label: "Chat Rooms",
    to: AppRoutes.client.protected.ADMIN_CHAT_ROOMS,
    resource: "chat_rooms",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    label: "Chat Messages",
    to: AppRoutes.client.protected.ADMIN_CHAT_MESSAGES,
    resource: "chat_messages",
    icon: InboxStackIcon,
  },
];

export const AdminSidebarNav: React.FC<AdminSidebarNavProps> = ({
  onNavigate,
}) => {
  const { can, isLoading } = usePermissions();

  const enabledItems = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        isEnabled: isLoading || can("read", item.resource),
      })),
    [can, isLoading],
  );

  return (
    <nav className="flex-1 overflow-y-auto px-16 py-20">
      <div className="mb-[10px] px-8 text-caption font-semibold uppercase text-base-content opacity-50">
        Manage
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
                    ? "bg-gold-500 text-navy-900 shadow-sm"
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
