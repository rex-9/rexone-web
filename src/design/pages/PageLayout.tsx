import React from "react";
import { HeadNavbar } from "../components";
import { cn } from "../utils";

export interface IPageLayoutProps {
  children: React.ReactNode;
  className?: string;
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
  headerActions,
  headerLeading,
  headNavbar,
  isAdmin = false,
  showHeadNavbar = true,
  centered,
}) => {
  const shouldCenter = centered ?? !isAdmin;

  return (
    <div
      className={cn(
        "min-h-screen w-full",
        shouldCenter && "flex flex-col items-center justify-between",
        showHeadNavbar && "pt-[72px]",
        className,
      )}
    >
      {showHeadNavbar
        ? headNavbar ?? (
            <HeadNavbar
              actions={headerActions}
              className={isAdmin ? "left-[72px] lg:left-[280px]" : undefined}
              isAdmin={isAdmin}
              leading={headerLeading}
            />
          )
        : null}
      {children}
      {shouldCenter ? <div /> : null}
    </div>
  );
};
