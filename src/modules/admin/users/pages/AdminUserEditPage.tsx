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
import { AlertDialog,  AdminState } from "../../components";
import { AdminUserForm } from "./AdminUserForm";
import { ADMIN_USER_PAGE_TITLES } from "../constants";
import { ADMIN_ACTIONS } from "../../constants";

export const AdminUserEditPage: React.FC = () => {
  useDocumentTitle(ADMIN_USER_PAGE_TITLES.EDIT);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [user, setUser] = useState<IAdminUser | null>(null);
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

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

    setLoading(true, { overlay: false });

    await UserController.updateUser(
      id,
      values,
      (_user, message) => {
        setLoading(false, { overlay: false });
        toast.success(message);
        navigate(AppRoutes.client.protected.admin.USERS);
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
      {error && (!user || !id) ? (
        <AdminState title="Unable to load user" message={error} />
      ) : user ? (
        <AdminUserForm
          mode={ADMIN_ACTIONS.EDIT}
          user={user}
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={() => navigate(AppRoutes.client.protected.admin.USERS)}
        />
      ) : null}
    </>
  );
};
