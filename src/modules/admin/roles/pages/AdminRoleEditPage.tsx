import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import RoleController from "../role.controller";
import { IAdminPermission, IAdminRole, IAdminRoleFormValues } from "../types";
import { AlertDialog, AdminState } from "../../components";
import { AdminRoleForm } from "./AdminRoleForm";
import { ADMIN_ROLE_PAGE_TITLES } from "../constants";
import { ADMIN_ACTIONS } from "../../constants";

export const AdminRoleEditPage: React.FC = () => {
  useDocumentTitle(ADMIN_ROLE_PAGE_TITLES.EDIT);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [role, setRole] = useState<IAdminRole | null>(null);
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      const [roleResult, permResult] = await Promise.all([
        RoleController.getRole(id),
        RoleController.getPermissions(),
      ]);
      setLoading(false);

      if (roleResult.success && roleResult.role) {
        setRole(roleResult.role);
      } else {
        setError(roleResult.error || "Role was not found.");
      }

      if (permResult.success) {
        setPermissions(permResult.permissions);
      }
    };

    void loadData();
  }, [id, setLoading]);

  const handleSubmit = async (values: IAdminRoleFormValues) => {
    if (!id) return;

    setLoading(true, { overlay: false });

    const result = await RoleController.updateRole(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success("Role updated");
      navigate(AppRoutes.client.protected.admin.ROLES);
    } else {
      setAlertMessage(result.error || "Failed to update role");
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {error && !role ? (
        <AdminState title="Unable to load role" message={error} />
      ) : !role ? (
        <AdminState title="Unable to load role" message="Role was not found." />
      ) : (
        <AdminRoleForm
          mode={ADMIN_ACTIONS.EDIT}
          role={role}
          permissions={permissions}
          onSubmit={handleSubmit}
          onCancel={() => navigate(AppRoutes.client.protected.admin.ROLES)}
        />
      )}
    </>
  );
};
