import React from "react";
import { AdminAction, AdminResource } from "../../../models";
import { Button, ButtonProps } from "../../../design/components/button/Button";
import { usePermissions } from "../../../hooks";

interface IAdminActionButtonProps extends ButtonProps {
  action: AdminAction;
  resource: AdminResource;
}

export const AdminActionButton: React.FC<IAdminActionButtonProps> = ({
  action,
  resource,
  children,
  ...props
}) => {
  const { can } = usePermissions();

  if (!can(action, resource)) return null;

  return <Button {...props}>{children}</Button>;
};
