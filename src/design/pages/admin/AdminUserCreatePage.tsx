import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { UserController } from "../../../controllers";
import { useToast } from "../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../hooks";
import {
  IAdminPermission,
  IAdminRole,
  IAdminUserFormValues,
} from "../../../models";
import { AdminLayout, AdminLoadingState, AdminState } from "../../components";
import { AdminUserForm } from "./AdminUserForm";

export const AdminUserCreatePage: React.FC = () => {
  useDocumentTitle("Create User");

  const navigate = useNavigate();
  const toast = useToast();
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [permissions, setPermissions] = useState<IAdminPermission[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void Promise.all([
        UserController.getAdminRoles(
          (nextRoles) => setRoles(nextRoles),
          (message) => setError(message),
        ),
        UserController.getAdminPermissions(
          (nextPermissions) => setPermissions(nextPermissions),
          (message) => setError(message),
        ),
      ]).finally(() => setIsLoadingRoles(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (values: IAdminUserFormValues) => {
    setIsSubmitting(true);
    setError("");

    await UserController.createAdminUser(
      values,
      () => {
        toast.success("User created");
        navigate(AppRoutes.client.protected.ADMIN_USERS);
      },
      (message) => {
        setError(message);
        setIsSubmitting(false);
      },
    );
  };

  return (
    <AdminLayout
      title="Create User"
      description="Add a user account using the admin user endpoint."
    >
      {error && (
        <div className="mb-16">
          <AdminState title="Unable to create user" message={error} />
        </div>
      )}
      {isLoadingRoles ? (
        <AdminLoadingState />
      ) : (
        <AdminUserForm
          mode="create"
          roles={roles}
          permissions={permissions}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate(AppRoutes.client.protected.ADMIN_USERS)}
        />
      )}
    </AdminLayout>
  );
};
