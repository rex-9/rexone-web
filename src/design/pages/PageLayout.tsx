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
    <div
      className={cn(
        "min-h-screen w-full",
        shouldCenter && "flex flex-col items-center justify-between",
        showHeadNavbar && "pt-[72px]",
        className,
      )}
    >
      {enableAppServices ? <PageLayoutServices /> : null}
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

const PageLayoutServices: React.FC = () => {
  useAxiosInterceptor();
  useSocket();

  return null;
};
