import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import UserController from "../user.controller";
import {
  IAdminUser,
  IAdminUserFormValues,
} from "../types";
import { IAdminRole } from "../../roles/types";
import {
  AdminFormAlert,
  AdminLoadingState,
  AdminState,
} from "../../components";
import { AdminUserForm } from "./AdminUserForm";

export const AdminUserEditPage: React.FC = () => {
  useDocumentTitle("Edit User");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading, setLoading } = useLoading();
  const [user, setUser] = useState<IAdminUser | null>(null);
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);

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
      ]).finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id, setLoading]);

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
    <>
      {!id ? (
        <AdminState title="Unable to load user" message="Missing user id." />
      ) : isLoading ? (
        <AdminLoadingState />
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
    </>
  );
};
