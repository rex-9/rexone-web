import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AppRoutes from "../../../AppRoutes";
import { iconsLib } from "../../../assets";
import { useAuth } from "../../../contexts";
import { usePermissions } from "../../../hooks";
import { Button } from "../../../design/components/button";
import { HeadNavbarBrand } from "../../../design/components/common";
import { PageLayout } from "../../../design/pages";
import { ADMIN_ACTIONS, ADMIN_COMMON_LABELS } from "../constants";
import { getAdminPageMeta } from "../helpers/admin.helper";
import { AdminHeaderActionButton } from "./AdminHeaderActionButton";
import { AdminSidebarNav } from "./AdminSidebarNav";

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
  const recycleAction =
    pageMeta?.hasRecycleBin && pageMeta.actionResource
      ? {
          label: ADMIN_COMMON_LABELS.OPENRECYCLEBIN,
          onClick: () => navigate(`${location.pathname}/recycle-bin`),
          resource: pageMeta.actionResource,
        }
      : undefined;
  const canPerformPageAction =
    pageMeta?.actionLabel &&
    pageMeta.actionTo &&
    (!pageMeta.actionResource ||
      can(ADMIN_ACTIONS.CREATE, pageMeta.actionResource));

  const displayName =
    currentUser?.name || currentUser?.username || currentUser?.email || "Admin";

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((current) => !current);

  const sidebar = (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r border-base-300 bg-base-100 transition-[width] duration-200 ${
        isSidebarOpen ? "w-[280px]" : "w-[72px]"
      } lg:w-[280px]`}
    >
      <div className="flex h-[72px] items-center gap-12 border-b border-base-300 px-16">
        <HeadNavbarBrand
          className={`min-w-0 flex-1 ${isSidebarOpen ? "flex" : "hidden"} lg:flex`}
        />
        <Button
          type="button"
          variant="tertiary"
          className="h-[40px] w-[40px] shrink-0 p-0 lg:hidden"
          onClick={toggleSidebar}
          aria-label={
            isSidebarOpen ? "Close admin navigation" : "Open admin navigation"
          }
        >
          <iconsLib.bar3 className="h-[20px] w-[20px]" />
        </Button>
      </div>

      <div className={`${isSidebarOpen ? "flex" : "hidden"} min-h-0 flex-1 flex-col lg:flex`}>
        <AdminSidebarNav onNavigate={closeSidebar} />

        <div className="border-t border-base-300 p-16">
          <div className="rounded-md bg-base-200 p-12 py-4">
            <div className="text-body-s font-medium text-base-content">
              Signed in as
            </div>
            <div className="mt-4 truncate text-body-s text-base-content opacity-70">
              {displayName}
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 h-[40px] w-full justify-start gap-10 px-12 text-base-content bg-base"
            onClick={() => navigate(AppRoutes.client.protected.SIGN_OUT)}
          >
            <iconsLib.logout className="h-[18px] w-[18px]" />
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <PageLayout
      className="overflow-x-hidden bg-base-200 text-base-content"
      isAdmin
    >
      {sidebar}

      {isSidebarOpen && (
        <Button
          type="button"
          className="fixed bottom-0 left-[280px] right-0 top-0 z-30 bg-navy-900/40 lg:hidden"
          aria-label="Close admin navigation"
          onClick={closeSidebar}
        />
      )}

      <div className="min-h-screen min-w-0 pl-[72px] lg:pl-[280px]">
        <main className="min-w-0 px-16 pb-20 pt-20 md:px-24 lg:px-32">
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
                    navigate(
                      pageMeta.actionTo ?? AppRoutes.client.protected.admin.USERS,
                    )
                  }
                  recycle={recycleAction}
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
