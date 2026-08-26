import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import UserController from "../user.controller";
import { IAdminUserFormValues } from "../types";
import { IAdminRole } from "../../roles/types";
import { AlertDialog } from "../../components";
import { AdminUserForm } from "./AdminUserForm";
import { ADMIN_USER_PAGE_TITLES } from "../constants";

export const AdminUserCreatePage: React.FC = () => {
  useDocumentTitle(ADMIN_USER_PAGE_TITLES.CREATE);

  const navigate = useNavigate();
  const toast = useToast();
  const {setLoading } = useLoading();
  const [roles, setRoles] = useState<IAdminRole[]>([]);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoading(true);

      void UserController.getRoles(
        (nextRoles) => setRoles(nextRoles),
        (message) => setAlertMessage(message),
      ).finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [setLoading]);

  const handleSubmit = async (values: IAdminUserFormValues) => {
    setLoading(true, { overlay: false });

    await UserController.createUser(
      values,
      () => {
        setLoading(false, { overlay: false });
        toast.success("User created");
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
     
        <AdminUserForm
          mode="create"
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={() => navigate(AppRoutes.client.protected.admin.USERS)}
        />
      
    </>
  );
};
