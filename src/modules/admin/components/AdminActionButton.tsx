import React from "react";
import type { AdminAction, AdminResource } from "../role";
import { usePermissions } from "../../../hooks";
import { Button } from "../../../design/components/button";
import type { IButtonProps } from "../../../design/components/button";
import { ButtonTypes, ButtonVariants, ComponentSizes } from "../../../design/constants";

interface IAdminActionButtonProps extends IButtonProps {
  action: AdminAction;
  resource: AdminResource;
}

export const AdminActionButton: React.FC<IAdminActionButtonProps> = ({
  action,
  resource,
  children,
  type = ButtonTypes.BUTTON,
  variant = ButtonVariants.GLASS,
  size = ComponentSizes.SM,
  ...props
}) => {
  const { can } = usePermissions();

  if (!can(action, resource)) return null;

  return (
    <Button type={type} variant={variant} size={size} {...props}>
      {children}
    </Button>
  );
};
