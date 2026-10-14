// src/modules/admin/components/AdminLayout.tsx

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import AppRoutes from "../../../AppRoutes";
import { iconsLib } from "../../../assets";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../../../design/components/button";
import { ButtonTypes, ButtonVariants, ComponentSizes } from "../../../design/constants";
import { HeadNavbarBrand } from "../../../design/components/common";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { cn } from "../../../design/helpers";
import { useTranslate, AppLocales } from "../../../locales";
import { useAdminSidebar } from "../hooks";

interface IAdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<IAdminLayoutProps> = ({ children }) => {
  const t = useTranslate();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } =
    useAdminSidebar();

  const displayName = useMemo(
    () =>
      currentUser?.name ||
      currentUser?.username ||
      currentUser?.email ||
      t(AppLocales.Admin.Layout.DefaultAdminUser),
    [currentUser, t],
  );

  const sidebar = (
    <aside
      className={cn(
        "fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r border-glass-border/50 bg-base-100/95 backdrop-blur-xl transition-all duration-300 shadow-[0_14px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.55)]",
        isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full",
        "lg:translate-x-0",
        isCollapsed ? "lg:w-16" : "lg:w-72",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-glass-border/50 transition-all duration-300",
          isCollapsed ? "px-3 justify-center" : "px-4 justify-between",
        )}
      >
        {!isCollapsed && (
          <HeadNavbarBrand
            isAdmin
            className="min-w-0 flex-1 truncate"
          />
        )}

        {/* Desktop fold / unfold toggle button */}
        <Button
          type={ButtonTypes.BUTTON}
          variant={ButtonVariants.GLASS}
          size={ComponentSizes.SM}
          onClick={toggleCollapse}
          className={cn(
            "!h-9 !w-9 !p-0 !min-h-0 text-base-content opacity-70 hover:opacity-100 hover:bg-glass-card/60 rounded-lg transition-colors hidden lg:inline-flex items-center justify-center shrink-0 shadow-none border-0",
          )}
          title={
            isCollapsed
              ? t(AppLocales.Admin.Layout.OpenNav)
              : t(AppLocales.Admin.Layout.CloseNav)
          }
          aria-label={
            isCollapsed
              ? t(AppLocales.Admin.Layout.OpenNav)
              : t(AppLocales.Admin.Layout.CloseNav)
          }
        >
          <iconsLib.menu className="h-5 w-5" />
        </Button>

        {/* Mobile close drawer button */}
        <Button
          type={ButtonTypes.BUTTON}
          variant={ButtonVariants.GLASS}
          size={ComponentSizes.SM}
          onClick={closeMobile}
          className="!h-9 !w-9 !p-0 !min-h-0 text-base-content opacity-70 hover:opacity-100 hover:bg-glass-card/60 rounded-lg transition-colors lg:hidden flex items-center justify-center shrink-0 shadow-none border-0"
          aria-label={t(AppLocales.Admin.Layout.CloseNav)}
        >
          <iconsLib.close className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <AdminSidebarNav
          onNavigate={closeMobile}
          isCollapsed={isCollapsed}
        />

        <div
          className={cn(
            "border-t border-glass-border transition-all duration-300",
            isCollapsed ? "p-2" : "p-4",
          )}
        >
          {!isCollapsed && (
            <div className="rounded-xl border border-glass-border bg-glass-card p-3 shadow-glass-card backdrop-blur-md">
              <div className="text-body-s font-semibold text-base-content">
                {t(AppLocales.Admin.Layout.SignedInAs)}
              </div>
              <div className="mt-1 truncate text-body-s text-base-content/70">
                {displayName}
              </div>
            </div>
          )}
          <Button
            type={ButtonTypes.BUTTON}
            variant={ButtonVariants.GLASS}
            className={cn(
              "mt-2 h-10 w-full transition-all font-semibold rounded-xl border border-glass-border bg-glass-card text-base-content hover:bg-error/15 hover:text-error hover:border-error/40 shadow-glass-card backdrop-blur-md",
              isCollapsed
                ? "h-10 w-10 mx-auto justify-center p-0 tooltip tooltip-right"
                : "gap-2 justify-start px-3",
            )}
            title={t(AppLocales.Auth.SignOut)}
            aria-label={t(AppLocales.Auth.SignOut)}
            data-tip={isCollapsed ? t(AppLocales.Auth.SignOut) : undefined}
            onClick={() => navigate(AppRoutes.client.protected.SIGN_OUT)}
          >
            <iconsLib.logout className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <span>{t(AppLocales.Auth.SignOut)}</span>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {sidebar}

      {/* Semantic mobile drawer backdrop */}
      {isMobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label={t(AppLocales.Admin.Layout.CloseNav)}
          onClick={closeMobile}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") closeMobile();
          }}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
        />
      )}

      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-col pt-16 transition-all duration-300",
          "pl-0",
          isCollapsed ? "lg:pl-16" : "lg:pl-72",
        )}
      >
        <main className="min-w-0 flex-1 px-4 pb-10 pt-6 md:px-6">
          <section className="mx-auto w-full max-w-7xl">{children}</section>
        </main>
      </div>
    </>
  );
};
