import React from "react";
import {
  ArrowPathIcon,
  MinusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AdminAction, AdminResource } from "../../../models";
import { ButtonProps } from "../../../design/components/button/Button";
import {
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_TABLE_ACTION_TYPES,
  TAdminTableActionType,
} from "../constants";
import { AdminActionButton } from "./AdminActionButton";

export interface IAdminTableAction {
  disabled?: boolean;
  type: TAdminTableActionType;
  onClick: () => void;
}

interface IAdminTableActionConfig {
  action: AdminAction;
  icon: React.ElementType<{ className?: string }>;
  label: string;
  variant: ButtonProps["variant"];
}

const ADMIN_TABLE_ACTION_CONFIG: Record<
  TAdminTableActionType,
  IAdminTableActionConfig
> = {
  [ADMIN_TABLE_ACTION_TYPES.EDIT]: {
    action: ADMIN_ACTIONS.UPDATE,
    icon: PencilSquareIcon,
    label: ADMIN_COMMON_LABELS.EDIT,
    variant: "secondary",
  },
  [ADMIN_TABLE_ACTION_TYPES.DELETE]: {
    action: ADMIN_ACTIONS.DELETE,
    icon: TrashIcon,
    label: ADMIN_COMMON_LABELS.DELETE,
    variant: "tertiary",
  },
  [ADMIN_TABLE_ACTION_TYPES.DISCARD]: {
    action: ADMIN_ACTIONS.DELETE,
    icon: MinusCircleIcon,
    label: ADMIN_COMMON_LABELS.DISCARD,
    variant: "tertiary",
  },
  [ADMIN_TABLE_ACTION_TYPES.RESTORE]: {
    action: ADMIN_ACTIONS.DELETE,
    icon: ArrowPathIcon,
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
