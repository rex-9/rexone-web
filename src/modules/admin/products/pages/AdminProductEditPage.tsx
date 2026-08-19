import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  IAdminProduct,
  IAdminProductFormValues,
} from "../types";
import {
  AdminFormAlert,
  AdminLayout,
  AdminLoadingState,
  AdminState,
} from "../../../../design/components";
import ProductController from "../product.controller";
import { AdminProductForm } from "./AdminProductForm";

export const AdminProductEditPage: React.FC = () => {
  useDocumentTitle("Edit Product");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState<IAdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const timeoutId = window.setTimeout(() => {
      void ProductController.getProduct(
        id,
        (nextProduct) => setProduct(nextProduct),
        (message) => setError(message),
      ).finally(() => setIsLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id]);

  const handleSubmit = async (values: IAdminProductFormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    setError("");

    await ProductController.updateProduct(
      id,
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
    <AdminLayout title="Edit Product">
      {isLoading ? (
        <AdminLoadingState />
      ) : !id ? (
        <AdminState title="Unable to load product" message="Missing product id." />
      ) : error && !product ? (
        <AdminState title="Unable to load product" message={error} />
      ) : (
        <>
          {error && (
            <div className="mb-16">
              <AdminFormAlert message={error} />
            </div>
          )}
          <AdminProductForm
            mode="edit"
            product={product}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => navigate(AppRoutes.client.protected.ADMIN_PRODUCTS)}
          />
        </>
      )}
    </AdminLayout>
  );
};
