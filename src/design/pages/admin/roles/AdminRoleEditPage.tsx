import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  Admin,
  IAdminPermission,
  IAdminRole,
  IAdminRoleFormValues,
} from "../../../../modules/admin";
import {
  AdminFormAlert,
  AdminLayout,
  AdminLoadingState,
  AdminState,
} from "../../../components";
import { AdminRoleForm } from "./AdminRoleForm";

export const AdminRoleEditPage: React.FC = () => {
  useDocumentTitle("Edit Role");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [role, setRole] = useState<IAdminRole | null>(null);
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const timeoutId = window.setTimeout(() => {
      void Promise.all([
        Admin.RoleController.getRole(
          id,
          (nextRole) => setRole(nextRole),
          (message) => setError(message),
        ),
        Admin.RoleController.getPermissions(
          (nextPermissions) => setPermissions(nextPermissions),
          (message) => setError(message),
        ),
      ]).finally(() => setIsLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id]);

  const handleSubmit = async (values: IAdminRoleFormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    setError("");

    await Admin.RoleController.updateRole(
      id,
      values,
      () => {
        toast.success("Role updated");
        navigate(AppRoutes.client.protected.ADMIN_ROLES);
      },
      (message) => {
        setError(message);
        setIsSubmitting(false);
      },
    );
  };

  return (
    <AdminLayout title="Edit Role">
      {isLoading ? (
        <AdminLoadingState />
      ) : !id ? (
        <AdminState title="Unable to load role" message="Missing role id." />
      ) : error && !role ? (
        <AdminState title="Unable to load role" message={error} />
      ) : !role ? (
        <AdminState title="Unable to load role" message="Role was not found." />
      ) : (
        <>
          {error && (
            <div className="mb-16">
              <AdminFormAlert message={error} />
            </div>
          )}
          <AdminRoleForm
            mode="edit"
            role={role}
            permissions={permissions}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => navigate(AppRoutes.client.protected.ADMIN_ROLES)}
          />
        </>
      )}
    </AdminLayout>
  );
};
