import React from "react";
import { AdminAction, AdminResource } from "../../../models";
import { Button, ButtonProps } from "../button/Button";

interface AdminActionButtonProps extends ButtonProps {
  action: AdminAction;
  resource: AdminResource;
  can: (action: AdminAction, resource: AdminResource) => boolean;
}

export const AdminActionButton: React.FC<AdminActionButtonProps> = ({
  action,
  resource,
  can,
  children,
  ...props
}) => {
  if (!can(action, resource)) return null;

  return <Button {...props}>{children}</Button>;
};
