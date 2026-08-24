import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import UserController from "../user.controller";
import { IAdminUserFormValues } from "../types";
import { IAdminRole } from "../../roles/types";
import { AdminFormAlert, AdminLoadingState } from "../../components";
import { AdminUserForm } from "./AdminUserForm";

export const AdminUserCreatePage: React.FC = () => {
  useDocumentTitle("Create User");

  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading: isLoadingRoles, setLoading } = useLoading();
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoading(true);

      void UserController.getRoles(
        (nextRoles) => setRoles(nextRoles),
        (message) => setError(message),
      ).finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [setLoading]);

  const handleSubmit = async (values: IAdminUserFormValues) => {
    setError("");
    setIsSubmitting(true);

    await UserController.createUser(
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
    <>
      {error && (
        <div className="mb-16">
          <AdminFormAlert message={error} />
        </div>
      )}
      {isLoadingRoles ? (
        <AdminLoadingState />
      ) : (
        <AdminUserForm
          mode="create"
          roles={roles}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate(AppRoutes.client.protected.ADMIN_USERS)}
        />
      )}
    </>
  );
};
