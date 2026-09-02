import React from "react";
import type { AdminAction, AdminResource } from "../role";
import { cn } from "../../../design/helpers";
import { ButtonSizes, ButtonVariants } from "../../../design/constants";
import {
  ADMIN_ACTION_CATEGORIES,
  ADMIN_ACTIONS,
  type TAdminActionCategory,
  type TAdminActionsType,
} from "../constants";
import { AdminActionButton } from "./AdminActionButton";
import { useTranslate, AppLocales } from "../../../locales";

export interface IAdminTableAction {
  disabled?: boolean;
  type: TAdminActionsType;
  onClick: () => void;
}

export interface IAdminTableActionConfig {
  action: AdminAction;
  labelKey: string;
  category: TAdminActionCategory;
}

const ADMIN_TABLE_ACTION_CONFIG: Record<string, IAdminTableActionConfig> = {
  [ADMIN_ACTIONS.EDIT]: {
    action: ADMIN_ACTIONS.UPDATE,
    labelKey: AppLocales.Admin.Common.Actions.Edit,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
  },
  [ADMIN_ACTIONS.REVIEW]: {
    action: ADMIN_ACTIONS.UPDATE,
    labelKey: AppLocales.Admin.Common.Actions.Review,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
  },
  [ADMIN_ACTIONS.INSPECT]: {
    action: ADMIN_ACTIONS.READ,
    labelKey: AppLocales.Admin.Common.Actions.Inspect,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
  },
  [ADMIN_ACTIONS.EXTEND]: {
    action: ADMIN_ACTIONS.UPDATE,
    labelKey: AppLocales.Admin.Common.Actions.Extend,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
  },
  [ADMIN_ACTIONS.DELETE]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Discard,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
  },
  [ADMIN_ACTIONS.DESTROY]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Destroy,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
  },
  [ADMIN_ACTIONS.DISCARD]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Discard,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
  },
  [ADMIN_ACTIONS.REVOKE]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Revoke,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
  },
  [ADMIN_ACTIONS.UNDISCARD]: {
    action: ADMIN_ACTIONS.DELETE,
    labelKey: AppLocales.Admin.Common.Actions.Restore,
    category: ADMIN_ACTION_CATEGORIES.SUCCESS,
  },
};

interface IAdminTableActionsProps {
  actions: IAdminTableAction[];
  resource: AdminResource;
}

export const AdminTableActions: React.FC<IAdminTableActionsProps> = ({
  actions,
  resource,
}) => {
  const t = useTranslate();

  return (
    <div className="flex items-center justify-end gap-1.5">
      {actions.map(({ disabled, type, onClick }) => {
        const config = ADMIN_TABLE_ACTION_CONFIG[type] ?? {
          action: ADMIN_ACTIONS.UPDATE,
          labelKey: String(type),
          category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
        };

        const label = config.labelKey.includes(".")
          ? t(config.labelKey)
          : config.labelKey;

        const categoryStyles: Record<TAdminActionCategory, string> = {
          [ADMIN_ACTION_CATEGORIES.NEUTRAL]:
            "border border-base-300 bg-base-100 text-base-content hover:bg-base-200 hover:border-base-400 active:bg-base-300",
          [ADMIN_ACTION_CATEGORIES.DANGER]:
            "border border-error/50 bg-error/5 text-error hover:bg-error/15 hover:border-error active:bg-error/25",
          [ADMIN_ACTION_CATEGORIES.SUCCESS]:
            "border border-success/50 bg-success/5 text-success hover:bg-success/15 hover:border-success active:bg-success/25",
        };

        return (
          <AdminActionButton
            key={type}
            action={config.action}
            resource={resource}
            size={ButtonSizes.SM}
            variant={ButtonVariants.TERTIARY}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150 shadow-none border",
              categoryStyles[config.category],
            )}
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={onClick}
          >
            {label}
          </AdminActionButton>
        );
      })}
    </div>
  );
};

