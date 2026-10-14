import React from "react";
import { HeadNavbar, HeadNavbarBrand } from "../components";
import { Button } from "../components/button";
import { ButtonTypes, ButtonVariants, ComponentSizes } from "../constants";
import { cn } from "../helpers";
import { iconsLib } from "../../assets";
import { useSocket } from "../../hooks/useSocket";
import { useTranslate, AppLocales } from "../../locales";
import { useAdminSidebar } from "../../modules/admin/hooks/useAdminSidebar";

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
  const t = useTranslate();
  useSocket();
  const { isCollapsed, toggleMobile } = useAdminSidebar();

  const adminMobileLeading = (
    <div className="flex items-center gap-2 lg:hidden">
      <Button
        type={ButtonTypes.BUTTON}
        variant={ButtonVariants.FLAT}
        size={ComponentSizes.SM}
        className="h-10 w-10 p-0 inline-flex items-center justify-center text-base-content"
        onClick={toggleMobile}
        title={t(AppLocales.Admin.Layout.OpenNav)}
        aria-label={t(AppLocales.Admin.Layout.OpenNav)}
      >
        <iconsLib.menu className="h-5 w-5" />
      </Button>
      <HeadNavbarBrand isAdmin />
    </div>
  );

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
              className={
                isAdmin
                  ? cn(
                      "transition-all duration-300 left-0",
                      isCollapsed ? "lg:left-16" : "lg:left-72",
                    )
                  : undefined
              }
              isAdmin={isAdmin}
              leading={
                headerLeading !== undefined
                  ? headerLeading
                  : isAdmin
                    ? adminMobileLeading
                    : <HeadNavbarBrand />
              }
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
