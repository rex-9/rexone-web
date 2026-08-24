import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import RoleController from "../role.controller";
import {
  IAdminPermission,
  IAdminRoleFormValues,
} from "../types";
import { AlertDialog, AdminLoadingState } from "../../components";
import { AdminRoleForm } from "./AdminRoleForm";
import { ADMIN_PAGE_TITLES } from "../../constants";

export const AdminRoleCreatePage: React.FC = () => {
  useDocumentTitle(ADMIN_PAGE_TITLES.ROLE_CREATE);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOverlayLoading, setLoading } = useLoading();
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      void RoleController.getPermissions(
        (nextPermissions) => setPermissions(nextPermissions),
        (message) => setAlertMessage(message),
      ).finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [setLoading]);

  const handleSubmit = async (values: IAdminRoleFormValues) => {
    setLoading(true, { overlay: false });

    await RoleController.createRole(
      values,
      () => {
        setLoading(false, { overlay: false });
        toast.success("Role created");
        navigate(AppRoutes.client.protected.ADMIN_ROLES);
      },
      (message) => {
        setAlertMessage(message);
        setLoading(false, { overlay: false });
      },
    );
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {isOverlayLoading ? (
        <AdminLoadingState />
      ) : (
        <AdminRoleForm
            mode="create"
            permissions={permissions}
            onSubmit={handleSubmit}
            onCancel={() => navigate(AppRoutes.client.protected.ADMIN_ROLES)}
          />
      )}
    </>
  );
};
