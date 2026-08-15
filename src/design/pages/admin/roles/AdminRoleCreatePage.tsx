import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  Admin,
  IAdminPermission,
  IAdminRoleFormValues,
} from "../../../../modules/admin";
import {
  AdminFormAlert,
  AdminLayout,
  AdminLoadingState,
} from "../../../components";
import { AdminRoleForm } from "./AdminRoleForm";

export const AdminRoleCreatePage: React.FC = () => {
  useDocumentTitle("Create Role");

  const navigate = useNavigate();
  const toast = useToast();
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void Admin.RoleController.getPermissions(
        (nextPermissions) => setPermissions(nextPermissions),
        (message) => setError(message),
      ).finally(() => setIsLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (values: IAdminRoleFormValues) => {
    setError("");
    setIsSubmitting(true);

    await Admin.RoleController.createRole(
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
    <AdminLayout title="Create Role">
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
    </AdminLayout>
  );
};
