import React from "react";
import { HeadNavbar } from "../components";
import { cn } from "../utils";
import { useAxiosInterceptor } from "../../services";
import { useSocket } from "../../hooks/useSocket";

export interface IPageLayoutProps {
  children: React.ReactNode;
  className?: string;
  enableAppServices?: boolean;
  headerActions?: React.ReactNode;
  headerLeading?: React.ReactNode;
  headNavbar?: React.ReactNode;
  isAdmin?: boolean;
  showHeadNavbar?: boolean;
  centered?: boolean;
}

export const PageLayout: React.FC<IPageLayoutProps> = ({
  children,
  className,
  enableAppServices = false,
  headerActions,
  headerLeading,
  headNavbar,
  isAdmin = false,
  showHeadNavbar = true,
  centered,
}) => {
  const shouldCenter = centered ?? !isAdmin;

  return (
    <div className={cn("min-h-screen w-full flex flex-col", className)}>
      {enableAppServices ? <PageLayoutServices /> : null}
      {showHeadNavbar
        ? headNavbar ?? (
            <HeadNavbar
              actions={headerActions}
              className={isAdmin ? "left-16 lg:left-72" : undefined}
              isAdmin={isAdmin}
              leading={headerLeading}
            />
          )
        : null}
      {isAdmin ? (
        children
      ) : (
        <main
          className={cn(
            "flex-1 w-full",
            showHeadNavbar && "pt-16",
            shouldCenter && "flex flex-col items-center justify-center px-4 py-8",
          )}
        >
          {children}
        </main>
      )}
    </div>
  );
};

const PageLayoutServices: React.FC = () => {
  useAxiosInterceptor();
  useSocket();

  return null;
};
