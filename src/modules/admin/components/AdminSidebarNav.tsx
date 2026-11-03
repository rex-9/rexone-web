import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { usePermissions } from "../../../hooks";
import { ADMIN_ACTIONS, ADMIN_NAV_SECTIONS } from "../constants";
import { cn } from "../../../design/helpers";
import { Button, ButtonVariants, ComponentSizes } from "../../../design";
import { iconsLib } from "../../../assets";
import { useTranslate } from "../../../locales";

interface IAdminSidebarNavProps {
  onNavigate: () => void;
  isCollapsed?: boolean;
}

export const AdminSidebarNav: React.FC<IAdminSidebarNavProps> = ({
  onNavigate,
  isCollapsed = false,
}) => {
  const t = useTranslate();
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const { can, isAdmin, isLoading, isSuperAdmin } = usePermissions();

  const enabledItems = useMemo(
    () =>
      ADMIN_NAV_SECTIONS
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            !isAdmin
              ? false
              : item.superAdminOnly
                ? isSuperAdmin
                : isLoading ||
                  can(item.action ?? ADMIN_ACTIONS.READ, item.resource),
          ),
        }))
        .filter((section) => section.items.length > 0),
    [can, isAdmin, isLoading, isSuperAdmin],
  );

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }));
  };

  return (
    <nav
      className={cn(
        "flex-1 overflow-y-auto py-3",
        isCollapsed ? "px-2" : "px-4",
      )}
    >
      <div className={cn("space-y-4", isCollapsed && "space-y-2")}>
        {enabledItems.map((section, idx) => {
          const isSectionCollapsed = collapsedSections[section.id] ?? false;

          return (
            <div key={section.id}>
              {isCollapsed ? (
                idx > 0 && (
                  <div
                    className="my-2 border-t border-base-300/40 mx-2"
                    title={t(section.labelKey)}
                  />
                )
              ) : (
                <Button
                  type="button"
                  variant={ButtonVariants.GLASS}
                  size={ComponentSizes.SM}
                  aria-expanded={!isSectionCollapsed}
                  aria-controls={`admin-nav-section-${section.id}`}
                  onClick={() => toggleSection(section.id)}
                  className="mb-2 flex h-7 w-full items-center justify-between rounded-lg px-2 text-caption font-semibold text-base-content/60 transition-colors hover:text-base-content bg-transparent hover:bg-transparent"
                >
                  <span>{t(section.labelKey)}</span>
                  <iconsLib.chevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isSectionCollapsed ? "-rotate-90" : "rotate-0",
                    )}
                  />
                </Button>
              )}
              <div
                id={`admin-nav-section-${section.id}`}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                  !isCollapsed && isSectionCollapsed
                    ? "grid-rows-[0fr] opacity-0"
                    : "grid-rows-[1fr] opacity-100",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const label = t(item.labelKey);
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={onNavigate}
                          title={label}
                          aria-label={label}
                          data-tip={isCollapsed ? label : undefined}
                          className={({ isActive }) =>
                            cn(
                              "group flex items-center rounded-xl font-medium transition-all duration-200",
                              isCollapsed
                                ? "h-10 w-10 mx-auto justify-center p-0 tooltip tooltip-right"
                                : "h-11 w-full gap-3 px-3 text-body-m justify-start",
                              isActive
                                ? "border border-primary/50 bg-glass-card-hover text-primary font-bold shadow-glass-card backdrop-blur-md ring-1 ring-primary/20"
                                : "border border-glass-border/50 bg-glass-card text-base-content/80 shadow-xs backdrop-blur-md hover:border-glass-border-hover hover:bg-glass-card-hover hover:text-base-content hover:shadow-glass-card",
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon
                                className={cn(
                                  "h-5 w-5 shrink-0 transition-colors",
                                  isActive
                                    ? "text-primary"
                                    : "text-base-content/70 group-hover:text-primary",
                                )}
                              />
                              {!isCollapsed && (
                                <span className="truncate">{label}</span>
                              )}
                            </>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
