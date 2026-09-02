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
import { AlertDialog } from "../../components";
import { AdminRoleForm } from "./AdminRoleForm";
import { ADMIN_ROLE_PAGE_TITLES } from "../constants";
import { ADMIN_ACTIONS } from "../../constants";

export const AdminRoleCreatePage: React.FC = () => {
  useDocumentTitle(ADMIN_ROLE_PAGE_TITLES.CREATE);

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      const result = await RoleController.getPermissions();
      setLoading(false);
      if (result.success) {
        setPermissions(result.permissions);
      } else {
        setAlertMessage(result.error || "Failed to load permissions");
      }
    };

    void loadPermissions();
  }, [setLoading]);

  const handleSubmit = async (values: IAdminRoleFormValues) => {
    setLoading(true, { overlay: false });

    const result = await RoleController.createRole(values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success("Role created");
      navigate(AppRoutes.client.protected.admin.ROLES);
    } else {
      setAlertMessage(result.error || "Failed to create role");
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {(
        <AdminRoleForm
            mode={ADMIN_ACTIONS.CREATE}
            permissions={permissions}
            onSubmit={handleSubmit}
            onCancel={() => navigate(AppRoutes.client.protected.admin.ROLES)}
          />
      )}
    </>
  );
};
