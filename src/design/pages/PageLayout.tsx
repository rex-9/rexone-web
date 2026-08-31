import React from "react";
import { HeadNavbar, HeadNavbarBrand } from "../components";
import { cn } from "../utils";
import { useAxiosInterceptor } from "../../services";
import { useSocket } from "../../hooks/useSocket";

export interface IPageLayoutProps {
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  headerLeading?: React.ReactNode;
  headNavbar?: React.ReactNode;
  isAdmin?: boolean;
  showHeadNavbar?: boolean;
}

export const PageLayout: React.FC<IPageLayoutProps> = ({
  children,
  className,
  headerActions,
  headerLeading,
  headNavbar,
  isAdmin = false,
  showHeadNavbar = true,
}) => {
  useAxiosInterceptor();
  useSocket();

  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col overflow-x-hidden bg-base-200 text-base-content",
        className,
      )}
    >
      {showHeadNavbar
        ? (headNavbar ?? (
            <HeadNavbar
              actions={headerActions}
              className={isAdmin ? "left-16 lg:left-72" : undefined}
              isAdmin={isAdmin}
              leading={headerLeading ?? (!isAdmin ? <HeadNavbarBrand /> : null)}
            />
          ))
        : null}
      {isAdmin ? (
        children
      ) : (
        <main
          className={cn(
            "flex-1 w-full",
            showHeadNavbar && "pt-16",
            "flex flex-col items-center justify-center px-4 py-8",
          )}
        >
          {children}
        </main>
      )}
    </div>
  );
};

export default PageLayout;
