import React from "react";
import type { AdminAction, AdminResource } from "../role";
import { cn } from "../../../design/helpers";
import { ButtonSizes, ButtonVariants } from "../../../design/constants";
import {
  ADMIN_ACTION_CATEGORIES,
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  type TAdminActionCategory,
  type TAdminActionsType,
} from "../constants";
import { AdminActionButton } from "./AdminActionButton";

export interface IAdminTableAction {
  disabled?: boolean;
  type: TAdminActionsType;
  onClick: () => void;
}

export interface IAdminTableActionConfig {
  action: AdminAction;
  label: string;
  category: TAdminActionCategory;
}

const ADMIN_TABLE_ACTION_CONFIG: Record<string, IAdminTableActionConfig> = {
  [ADMIN_ACTIONS.EDIT]: {
    action: ADMIN_ACTIONS.UPDATE,
    label: ADMIN_COMMON_LABELS.EDIT,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
  },
  [ADMIN_ACTIONS.REVIEW]: {
    action: ADMIN_ACTIONS.UPDATE,
    label: ADMIN_COMMON_LABELS.REVIEW,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
  },
  [ADMIN_ACTIONS.INSPECT]: {
    action: ADMIN_ACTIONS.READ,
    label: ADMIN_COMMON_LABELS.INSPECT,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
  },
  [ADMIN_ACTIONS.EXTEND]: {
    action: ADMIN_ACTIONS.UPDATE,
    label: ADMIN_COMMON_LABELS.EXTEND,
    category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
  },
  [ADMIN_ACTIONS.DELETE]: {
    action: ADMIN_ACTIONS.DELETE,
    label: ADMIN_COMMON_LABELS.DELETE,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
  },
  [ADMIN_ACTIONS.DESTROY]: {
    action: ADMIN_ACTIONS.DELETE,
    label: ADMIN_COMMON_LABELS.DESTROY,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
  },
  [ADMIN_ACTIONS.DISCARD]: {
    action: ADMIN_ACTIONS.DELETE,
    label: ADMIN_COMMON_LABELS.DISCARD,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
  },
  [ADMIN_ACTIONS.REVOKE]: {
    action: ADMIN_ACTIONS.DELETE,
    label: ADMIN_COMMON_LABELS.REVOKE,
    category: ADMIN_ACTION_CATEGORIES.DANGER,
  },
  [ADMIN_ACTIONS.UNDISCARD]: {
    action: ADMIN_ACTIONS.UPDATE,
    label: ADMIN_COMMON_LABELS.UNDISCARD,
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
}) => (
  <div className="flex items-center justify-end gap-1.5">
    {actions.map(({ disabled, type, onClick }) => {
      const config = ADMIN_TABLE_ACTION_CONFIG[type] ?? {
        action: ADMIN_ACTIONS.UPDATE,
        label: String(type),
        category: ADMIN_ACTION_CATEGORIES.NEUTRAL,
      };

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
          aria-label={config.label}
          title={config.label}
          disabled={disabled}
          onClick={onClick}
        >
          {config.label}
        </AdminActionButton>
      );
    })}
  </div>
);
