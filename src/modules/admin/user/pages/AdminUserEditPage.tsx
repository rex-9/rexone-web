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
import { IAdminRole } from "../../role/types";
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

    const loadData = async () => {
      setLoading(true);
      const [userResult, rolesResult] = await Promise.all([
        UserController.getUser(id),
        UserController.getRoles(),
      ]);
      setLoading(false);

      if (userResult.success && userResult.user) {
        setUser(userResult.user);
      } else {
        setError(userResult.error || "Unable to load user");
      }

      if (rolesResult.success) {
        setRoles(rolesResult.roles);
      }
    };

    void loadData();
  }, [id, setLoading]);

  const handleSubmit = async (values: IAdminUserFormValues) => {
    if (!id) return;

    setLoading(true, { overlay: false });

    const result = await UserController.updateUser(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(result.message || "User updated");
      navigate(AppRoutes.client.protected.admin.USERS);
    } else {
      setAlertMessage(result.error || "Failed to update user");
    }
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
