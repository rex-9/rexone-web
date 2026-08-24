import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  IAdminProduct,
  IAdminProductFormValues,
} from "../types";
import {
  AdminFormAlert,
  AdminLoadingState,
  AdminState,
} from "../../components";
import ProductController from "../product.controller";
import { AdminProductForm } from "./AdminProductForm";

export const AdminProductEditPage: React.FC = () => {
  useDocumentTitle("Edit Product");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading, setLoading } = useLoading();
  const [product, setProduct] = useState<IAdminProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      void ProductController.getProduct(
        id,
        (nextProduct) => setProduct(nextProduct),
        (message) => setError(message),
      ).finally(() => setLoading(false));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id, setLoading]);

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
    <>
      {!id ? (
        <AdminState title="Unable to load product" message="Missing product id." />
      ) : isLoading ? (
        <AdminLoadingState />
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
    </>
  );
};
