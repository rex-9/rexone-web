import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { IAdminProductFormValues } from "../types";
import { AdminFormAlert, AdminLayout } from "../../../../design/components";
import ProductController from "../product.controller";
import { AdminProductForm } from "./AdminProductForm";

export const AdminProductCreatePage: React.FC = () => {
  useDocumentTitle("Create Product");

  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values: IAdminProductFormValues) => {
    setIsSubmitting(true);
    setError("");

    await ProductController.createProduct(
      values,
      (_product, message) => {
        toast.success(message);
        navigate(AppRoutes.client.protected.ADMIN_PRODUCTS);
      },
      (message) => {
        setError(message);
        setIsSubmitting(false);
      },
    );
  };

  return (
    <AdminLayout title="Create Product">
      {error && (
        <div className="mb-16">
          <AdminFormAlert message={error} />
        </div>
      )}
      <AdminProductForm
        mode="create"
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate(AppRoutes.client.protected.ADMIN_PRODUCTS)}
      />
    </AdminLayout>
  );
};
