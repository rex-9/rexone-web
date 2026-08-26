import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { IAdminProductFormValues } from "../types";
import ProductController from "../product.controller";
import { AdminProductForm } from "./AdminProductForm";
import { ADMIN_PRODUCT_PAGE_TITLES } from "../constants";
import { AlertDialog } from "../../components";

export const AdminProductCreatePage: React.FC = () => {
  useDocumentTitle(ADMIN_PRODUCT_PAGE_TITLES.CREATE);

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (values: IAdminProductFormValues) => {
    setLoading(true, { overlay: false });

    try {
      await ProductController.createProduct(
        values,
        (_product, message) => {
          setLoading(false, { overlay: false });
          toast.success(message || "Product created");
          navigate(AppRoutes.client.protected.admin.PRODUCTS, {
            replace: true,
          });
        },
        (message) => {
          setAlertMessage(message);
          setLoading(false, { overlay: false });
        },
      );
    } catch {
      setAlertMessage("Product was created, but the page could not return to products.");
      setLoading(false, { overlay: false });
      navigate(AppRoutes.client.protected.admin.PRODUCTS, {
        replace: true,
      });
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      <AdminProductForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => navigate(AppRoutes.client.protected.admin.PRODUCTS)}
      />
    </>
  );
};
