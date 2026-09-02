// src/modules/admin/components/AdminLayout.tsx

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppRoutes from "../../../AppRoutes";
import { iconsLib } from "../../../assets";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../../../design/components/button";
import { ButtonTypes, ButtonVariants } from "../../../design/constants";
import { HeadNavbar } from "../../../design/components/common";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { cn } from "../../../design/helpers";

interface IAdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<IAdminLayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const displayName = useMemo(
    () =>
      currentUser?.name ||
      currentUser?.username ||
      currentUser?.email ||
      "Admin User",
    [currentUser],
  );

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  const sidebar = (
    <aside
      className={cn(
        "fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r border-base-300 bg-base-100 transition-[width] duration-200 lg:w-72",
        isSidebarOpen ? "w-72" : "w-16",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-base-300",
          isSidebarOpen
            ? "px-6 justify-between"
            : "px-3 justify-center lg:px-6 lg:justify-between",
        )}
      >
        <HeadNavbar
          isAdmin
          className={cn(
            "min-w-0 flex-1",
            isSidebarOpen ? "flex" : "hidden lg:flex",
          )}
        />
        <Button
          type={ButtonTypes.BUTTON}
          variant={ButtonVariants.TERTIARY}
          className="h-10 w-10 shrink-0 p-0 lg:hidden"
          onClick={toggleSidebar}
          aria-label={
            isSidebarOpen ? "Close admin navigation" : "Open admin navigation"
          }
        >
          <iconsLib.menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <AdminSidebarNav
          onNavigate={closeSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        <div
          className={cn(
            "border-t border-base-300",
            isSidebarOpen ? "p-4" : "p-2 lg:p-4",
          )}
        >
          <div
            className={cn(
              "rounded-md bg-base-200 p-3",
              isSidebarOpen ? "block" : "hidden lg:block",
            )}
          >
            <div className="text-body-s font-medium text-base-content">
              Signed in as
            </div>
            <div className="mt-1 truncate text-body-s text-base-content opacity-70">
              {displayName}
            </div>
          </div>
          <Button
            type={ButtonTypes.BUTTON}
            variant={ButtonVariants.SECONDARY}
            className={cn(
              "mt-3 h-10 w-full justify-start gap-2 px-3 text-base-content bg-base",
              isSidebarOpen ? "flex" : "hidden lg:flex",
            )}
            onClick={() => navigate(AppRoutes.client.protected.SIGN_OUT)}
          >
            <iconsLib.logout className="h-5 w-5" />
            <span>Log out</span>
          </Button>
          <Button
            type={ButtonTypes.BUTTON}
            variant={ButtonVariants.SECONDARY}
            className={cn(
              "h-10 w-10 p-0 mx-auto items-center justify-center text-base-content bg-base",
              isSidebarOpen ? "hidden" : "flex lg:hidden",
            )}
            title="Log out"
            aria-label="Log out"
            onClick={() => navigate(AppRoutes.client.protected.SIGN_OUT)}
          >
            <iconsLib.logout className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {sidebar}

      {isSidebarOpen && (
        <Button
          type={ButtonTypes.BUTTON}
          className="fixed bottom-0 left-72 right-0 top-0 z-30 bg-navy-900/40 lg:hidden"
          aria-label="Close admin navigation"
          onClick={closeSidebar}
        />
      )}

      <div className="min-h-screen min-w-0 pl-16 pt-16 lg:pl-72">
        <main className="min-w-0 px-4 pb-10 pt-6 md:px-6">
          <section className="mx-auto w-full max-w-7xl">{children}</section>
        </main>
      </div>
    </>
  );
};
