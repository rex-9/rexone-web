import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { IAdminRole } from "../../roles/types";
import UserController from "../user.controller";
import {
  IAdminUser,
  IAdminUserFormValues,
} from "../types";
import {
  AdminFormAlert,
  AdminLayout,
  AdminLoadingState,
  AdminState,
} from "../../../../design/components";
import { AdminUserForm } from "./AdminUserForm";

export const AdminUserEditPage: React.FC = () => {
  useDocumentTitle("Edit User");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState<IAdminUser | null>(null);
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const timeoutId = window.setTimeout(() => {
      void Promise.all([
        UserController.getUser(
          id,
          (nextUser) => setUser(nextUser),
          (message) => setError(message),
        ),
        UserController.getRoles(
          (nextRoles) => setRoles(nextRoles),
          (message) => setError(message),
        ),
      ]).finally(() => setIsLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id]);

  const handleSubmit = async (values: IAdminUserFormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    setError("");

    await UserController.updateUser(
      id,
      values,
      (_user, message) => {
        toast.success(message);
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
      title="Edit User"
      description="Update account details and admin-assigned fields."
    >
      {isLoading ? (
        <AdminLoadingState />
      ) : !id ? (
        <AdminState title="Unable to load user" message="Missing user id." />
      ) : error && !user ? (
        <AdminState title="Unable to load user" message={error} />
      ) : (
        <>
          {error && (
            <div className="mb-16">
              <AdminFormAlert message={error} />
            </div>
          )}
          <AdminUserForm
            mode="edit"
            user={user}
            roles={roles}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => navigate(AppRoutes.client.protected.ADMIN_USERS)}
          />
        </>
      )}
    </AdminLayout>
  );
};
