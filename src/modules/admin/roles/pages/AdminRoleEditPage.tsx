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
import {
  AdminFormAlert,
  AdminLoadingState,
  AdminState,
} from "../../components";
import { AdminRoleForm } from "./AdminRoleForm";

export const AdminRoleEditPage: React.FC = () => {
  useDocumentTitle("Edit Role");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading, setLoading } = useLoading();
  const [role, setRole] = useState<IAdminRole | null>(null);
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

    setIsSubmitting(true);
    setError("");

    await RoleController.updateRole(
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
    <>
      {!id ? (
        <AdminState title="Unable to load role" message="Missing role id." />
      ) : isLoading ? (
        <AdminLoadingState />
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
    </>
  );
};
