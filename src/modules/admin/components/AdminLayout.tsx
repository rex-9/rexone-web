import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AppRoutes from "../../../AppRoutes";
import { iconsLib } from "../../../assets";
import { useAuth } from "../../../contexts";
import { usePermissions } from "../../../hooks";
import { Button } from "../../../design/components/button";
import { HeadNavbarBrand } from "../../../design/components/common";
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
          onClick: () => navigate(`${location.pathname}/bin`),
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
        isSidebarOpen ? "w-72" : "w-16"
      } lg:w-72`}
    >
      <div className="flex h-16 items-center border-b border-base-300 px-6">
        <HeadNavbarBrand
          isAdmin
          className={`min-w-0 flex-1 ${isSidebarOpen ? "flex" : "hidden"} lg:flex`}
        />
        <Button
          type="button"
          variant="tertiary"
          className="h-10 w-10 shrink-0 p-0 lg:hidden"
          onClick={toggleSidebar}
          aria-label={
            isSidebarOpen ? "Close admin navigation" : "Open admin navigation"
          }
        >
          <iconsLib.menu className="h-5 w-5" />
        </Button>
      </div>

      <div
        className={`${isSidebarOpen ? "flex" : "hidden"} min-h-0 flex-1 flex-col lg:flex`}
      >
        <AdminSidebarNav onNavigate={closeSidebar} />

        <div className="border-t border-base-300 p-4">
          <div className="rounded-md bg-base-200 p-3">
            <div className="text-body-s font-medium text-base-content">
              Signed in as
            </div>
            <div className="mt-1 truncate text-body-s text-base-content opacity-70">
              {displayName}
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-3 h-10 w-full justify-start gap-2 px-3 text-base-content bg-base"
            onClick={() => navigate(AppRoutes.client.protected.SIGN_OUT)}
          >
            <iconsLib.logout className="h-5 w-5" />
            <span>Log out</span>
          </Button>
        </div>
      </div>
    </aside>
  );

  const hasHeaderActions = Boolean(canPerformPageAction || recycleAction);

  return (
    <>
      {sidebar}

      {isSidebarOpen && (
        <Button
          type="button"
          className="fixed bottom-0 left-72 right-0 top-0 z-30 bg-navy-900/40 lg:hidden"
          aria-label="Close admin navigation"
          onClick={closeSidebar}
        />
      )}

      <div className="min-h-screen min-w-0 pl-16 pt-16 lg:pl-72">
        <main className="min-w-0 px-4 pb-10 pt-6 md:px-6">
          <section className="mx-auto w-full max-w-7xl">
            {hasHeaderActions && (
              <div className="mb-6 flex min-h-10 flex-col justify-center gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-body-s font-semibold uppercase text-secondary">
                    Admin {"-"}{" "}
                    <span className="mt-1 font-display font-semibold text-base-content">
                      {pageMeta?.title ?? ""}
                    </span>
                  </div>

                  {pageMeta?.description && (
                    <span className="mt-1 max-w-2xl text-body-m text-base-content opacity-70">
                      {pageMeta.description}
                    </span>
                  )}
                </div>
                {canPerformPageAction && (
                  <AdminHeaderActionButton
                    label={pageMeta.actionLabel ?? ""}
                    onClick={() =>
                      navigate(
                        pageMeta.actionTo ??
                          AppRoutes.client.protected.admin.USERS,
                      )
                    }
                    recycle={recycleAction}
                  />
                )}
              </div>
            )}

            {hasHeaderActions ? (
              <div className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm md:p-6">
                {children}
              </div>
            ) : (
              children
            )}
          </section>
        </main>
      </div>
    </>
  );
};
