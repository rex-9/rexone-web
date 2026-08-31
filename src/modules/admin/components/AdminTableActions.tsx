import React from "react";

import type { AdminAction, AdminResource } from "../roles";
import { iconsLib } from "../../../assets";
import { IButtonProps } from "../../../design/components/button/Button";
import {
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  TAdminActionsType,
} from "../constants";
import { AdminActionButton } from "./AdminActionButton";

export interface IAdminTableAction {
  disabled?: boolean;
  type: TAdminActionsType;
  onClick: () => void;
}

interface IAdminTableActionConfig {
  action: AdminAction;
  icon: React.ElementType<{ className?: string }>;
  label: string;
  variant: IButtonProps["variant"];
}

const ADMIN_TABLE_ACTION_CONFIG: Record<
 AdminAction,
  IAdminTableActionConfig
> = {
  [ADMIN_ACTIONS.EDIT]: {
    action: ADMIN_ACTIONS.UPDATE,
    icon: iconsLib.pencilSquare,
    label: ADMIN_COMMON_LABELS.EDIT,
    variant: "secondary",
  },
  [ADMIN_ACTIONS.DELETE]: {
    action: ADMIN_ACTIONS.DELETE,
    icon: iconsLib.trash,
    label: ADMIN_COMMON_LABELS.DELETE,
    variant: "tertiary",
  },
  [ADMIN_ACTIONS.DISCARD]: {
    action: ADMIN_ACTIONS.DELETE,
    icon: iconsLib.minusCircle,
    label: ADMIN_COMMON_LABELS.DISCARD,
    variant: "tertiary",
  },
  [ADMIN_ACTIONS.RESTORE]: {
    action: ADMIN_ACTIONS.DELETE,
    icon: iconsLib.arrowPath,
    label: ADMIN_COMMON_LABELS.RESTORE,
    variant: "secondary",
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
  <div className="flex justify-end gap-8">
    {actions.map(({ disabled, type, onClick }) => {
      const { action, icon: Icon, label, variant } =
        ADMIN_TABLE_ACTION_CONFIG[type];

      return (
        <AdminActionButton
          key={type}
          action={action}
          resource={resource}
          size="sm"
          variant={variant}
          className="h-[32px] w-[32px] p-0"
          aria-label={label}
          title={label}
          disabled={disabled}
          onClick={onClick}
        >
          <Icon className="h-[18px] w-[18px]" />
        </AdminActionButton>
      );
    })}
  </div>
);
