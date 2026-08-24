import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import RoleController from "../role.controller";
import {
  IAdminPermission,
  IAdminRole,
  IAdminRoleFormValues,
} from "../types";
import { AlertDialog, AdminLoadingState, AdminState } from "../../components";
import { AdminRoleForm } from "./AdminRoleForm";
import { ADMIN_PAGE_TITLES } from "../../constants";

export const AdminRoleEditPage: React.FC = () => {
  useDocumentTitle(ADMIN_PAGE_TITLES.ROLE_EDIT);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOverlayLoading, setLoading } = useLoading();
  const [role, setRole] = useState<IAdminRole | null>(null);
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      void Promise.all([
        RoleController.getRole(
          id,
          (nextRole) => setRole(nextRole),
          (message) => setError(message),
        ),
        RoleController.getPermissions(
          (nextPermissions) => setPermissions(nextPermissions),
          (message) => setError(message),
        ),
      ]).finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id, setLoading]);

  const handleSubmit = async (values: IAdminRoleFormValues) => {
    if (!id) return;

    setLoading(true, { overlay: false });

    await RoleController.updateRole(
      id,
      values,
      () => {
        setLoading(false, { overlay: false });
        toast.success("Role updated");
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
      {!id ? (
        <AdminState title="Unable to load role" message="Missing role id." />
      ) : isOverlayLoading ? (
        <AdminLoadingState />
      ) : error && !role ? (
        <AdminState title="Unable to load role" message={error} />
      ) : !role ? (
        <AdminState title="Unable to load role" message="Role was not found." />
      ) : (
        <AdminRoleForm
            mode="edit"
            role={role}
            permissions={permissions}
            onSubmit={handleSubmit}
            onCancel={() => navigate(AppRoutes.client.protected.ADMIN_ROLES)}
          />
      )}
    </>
  );
};
