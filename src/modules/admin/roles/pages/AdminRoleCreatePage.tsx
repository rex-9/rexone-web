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
import { AdminFormAlert, AdminLoadingState } from "../../components";
import { AdminRoleForm } from "./AdminRoleForm";

export const AdminRoleCreatePage: React.FC = () => {
  useDocumentTitle("Create Role");

  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading, setLoading } = useLoading();
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      void RoleController.getPermissions(
        (nextPermissions) => setPermissions(nextPermissions),
        (message) => setError(message),
      ).finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [setLoading]);

  const handleSubmit = async (values: IAdminRoleFormValues) => {
    setError("");
    setIsSubmitting(true);

    await RoleController.createRole(
      values,
      () => {
        toast.success("Role created");
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
      {isLoading ? (
        <AdminLoadingState />
      ) : (
        <>
          {error && (
            <div className="mb-16">
              <AdminFormAlert message={error} />
            </div>
          )}

          <AdminRoleForm
            mode="create"
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
