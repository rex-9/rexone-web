import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AppRoutes from "../../../AppRoutes";
import { useAuth } from "../../../contexts";
import { usePermissions } from "../../../hooks";
import { Button } from "../../../design/components/button";
import { PageLayout } from "../../../design/pages";
import { ProfileAvatar } from "../../../design/components/common/ProfileAvatar";
import { LanguageDropdown } from "../../../design/components/settings/LanguageDropdown";
import { ThemeToggle } from "../../../design/components/settings/ThemeToggle";
import { ADMIN_ACTIONS } from "../constants";
import { getAdminPageMeta } from "../helpers/admin.helper";
import { AdminHeaderActionButton } from "./AdminHeaderActionButton";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { iconsLib } from '../../../assets';

interface IAdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<IAdminLayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const { can } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageMeta = getAdminPageMeta(location.pathname);
  const canPerformPageAction =
    pageMeta?.actionLabel &&
    pageMeta.actionTo &&
    (!pageMeta.actionResource ||
      can(ADMIN_ACTIONS.CREATE, pageMeta.actionResource));

  const displayName =
    currentUser?.name || currentUser?.username || currentUser?.email || "Admin";

  const closeSidebar = () => setIsSidebarOpen(false);

  const sidebar = (
    <aside className="flex h-full w-[280px] flex-col border-r border-base-300 bg-base-100">
      <div className="flex h-[72px] items-center gap-12 border-b border-base-300 px-24">
        <Button
          type="button"
          variant="tertiary"
          className="flex h-[40px] w-[40px] items-center justify-center rounded-md bg-primary text-body-l font-semibold text-navy-900"
          onClick={() => navigate(AppRoutes.client.protected.admin.USERS)}
        >
          R
        </Button>
        <div>
          <div className="text-body-m font-semibold text-base-content">
            Rexone
          </div>
          <div className="text-body-s text-base-content opacity-60">
            Control Center
          </div>
        </div>
      </div>

      <AdminSidebarNav onNavigate={closeSidebar} />

      <div className="border-t border-base-300 p-16">
        <div className="rounded-md bg-base-200 p-12">
          <div className="text-body-s font-medium text-base-content">
            Signed in as
          </div>
          <div className="mt-4 truncate text-body-s text-base-content opacity-70">
            {displayName}
          </div>
        </div>
        <Button
          type="button"
          variant="tertiary"
          className="mt-10 h-[40px] w-full justify-start gap-10 px-12 text-base-content"
          onClick={() => navigate(AppRoutes.client.protected.SIGN_OUT)}
        >
          <iconsLib.logout className="h-[18px] w-[18px]" />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  );

  return (
    <PageLayout className="overflow-x-hidden bg-base-200 text-base-content">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">
        {sidebar}
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy-900/40"
            aria-label="Close admin navigation"
            onClick={closeSidebar}
          />
          <div className="absolute inset-y-0 left-0">{sidebar}</div>
        </div>
      )}

      <div className="min-h-screen min-w-0 lg:pl-[280px]">
        <header className="fixed left-0 right-0 top-0 z-30 flex h-[72px] items-center justify-between border-b border-base-300 bg-base-100 px-16 md:px-24 lg:left-[280px]">
          <div className="flex min-w-0 items-center gap-12">
            <Button
              type="button"
              variant="tertiary"
              className="h-[40px] w-[40px] p-0 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open admin navigation"
            >
              <iconsLib.bar3 className="h-[20px] w-[20px]" />
            </Button>
            <div className="min-w-0">
              <div className="text-body-s font-medium uppercase text-secondary">
                Admin
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <Button
              type="button"
              variant="tertiary"
              className="hidden h-[40px] w-[40px] p-0 md:inline-flex"
              aria-label="Notifications"
            >
              <iconsLib.bell className="h-[20px] w-[20px]" />
            </Button>
            <ThemeToggle />
            <div className="hidden sm:block">
              <LanguageDropdown />
            </div>
            <ProfileAvatar />
          </div>
        </header>

        <main className="min-w-0 px-16 pb-20 pt-[92px] md:px-24 lg:px-32">
          <section className="mx-auto w-full max-w-7xl">
            <div className="mb-20 flex flex-col gap-14 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-body-s font-semibold uppercase text-secondary">
                  Admin
                </div>
                <h1 className="mt-4 text-h2 font-display font-semibold text-base-content">
                  {pageMeta?.title ?? ""}
                </h1>
                {pageMeta?.description && (
                  <p className="mt-6 max-w-2xl text-body-m text-base-content opacity-70">
                    {pageMeta.description}
                  </p>
                )}
              </div>
              {canPerformPageAction && (
                <AdminHeaderActionButton
                  label={pageMeta.actionLabel ?? ""}
                  onClick={() =>
                    navigate(pageMeta.actionTo ?? AppRoutes.client.protected.admin.USERS)
                  }
                />
              )}
            </div>

            <div className="rounded-md border border-base-300 bg-base-100 p-12 shadow-sm md:p-16">
              {children}
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  );
};
