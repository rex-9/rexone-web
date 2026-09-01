import React from "react";
import { Link } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { icons, iconsLib } from "../../../assets";
import { Button } from "../button";
import { Asset } from "../media";
import { LanguageDropdown } from "../settings/LanguageDropdown";
import { ThemeToggle } from "../settings/ThemeToggle";
import { cn } from "../../helpers";
import ProfileAvatar from "./ProfileAvatar";

export interface HeadNavbarProps {
  children?: React.ReactNode;
  className?: string;
  isAdmin?: boolean;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  showNotifications?: boolean;
}

export interface IHeadNavbarBrandProps {
  className?: string;
  isAdmin?: boolean;
  to?: string;
  showText?: boolean;
}

export const HeadNavbarBrand: React.FC<IHeadNavbarBrandProps> = ({
  className,
  isAdmin = false,
  to,
  showText = true,
}) => {
  const targetTo =
    to ??
    (isAdmin
      ? AppRoutes.client.protected.admin.HOME
      : AppRoutes.client.protected.HOME);

  return (
    <Link
      to={targetTo}
      className={cn(
        "flex min-w-0 items-center gap-3 select-none no-underline transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="Rexone Home"
    >
      <Asset
        asset={icons.logo}
        className={cn(
          "h-9 w-9 shrink-0 select-none transition-transform duration-300 hover:scale-105",
          isAdmin && "drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]",
        )}
      />
      {showText && (
        <div className="min-w-0">
          <div className="truncate text-body-m font-bold tracking-wide text-base-content font-display">
            Rexone
          </div>
          {isAdmin && (
            <div className="truncate text-caption font-medium uppercase tracking-wider text-base-content/60">
              Control Center
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

export const HeadNavbar: React.FC<HeadNavbarProps> = ({
  actions,
  children,
  className,
  leading,
  showNotifications = true,
}) => (
  <header
    className={cn(
      "fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-base-300 bg-base-100 px-4 md:px-6",
      className,
    )}
  >
    {children ?? (
      <>
        <div className="flex min-w-0 items-center gap-3">
          {leading ?? <HeadNavbarBrand />}
        </div>
        <div className="flex items-center gap-2">
          {showNotifications && (
            <Button
              type="button"
              variant="tertiary"
              className="hidden h-10 w-10 p-0 md:inline-flex"
              aria-label="Notifications"
            >
              <iconsLib.bell className="h-5 w-5" />
            </Button>
          )}
          <ThemeToggle />
          <div className="hidden sm:block">
            <LanguageDropdown />
          </div>
          {actions}
          <ProfileAvatar />
        </div>
      </>
    )}
  </header>
);

export default HeadNavbar;
