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
  AlertDialog,
  AdminLoadingState,
  AdminState,
} from "../../components";
import ProductController from "../product.controller";
import { AdminProductForm } from "./AdminProductForm";
import { ADMIN_PAGE_TITLES } from "../../constants";

export const AdminProductEditPage: React.FC = () => {
  useDocumentTitle(ADMIN_PAGE_TITLES.PRODUCT_EDIT);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOverlayLoading, setLoading } = useLoading();
  const [product, setProduct] = useState<IAdminProduct | null>(null);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

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

    setLoading(true, { overlay: false });

    await ProductController.updateProduct(
      id,
      values,
      (_product, message) => {
        toast.success(message);
        navigate(AppRoutes.client.protected.ADMIN_PRODUCTS);
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
      {!id ? (
        <AdminState title="Unable to load product" message="Missing product id." />
      ) : isOverlayLoading ? (
        <AdminLoadingState />
      ) : error && !product ? (
        <AdminState title="Unable to load product" message={error} />
      ) : (
        <AdminProductForm
            mode="edit"
            product={product}
            onSubmit={handleSubmit}
            onCancel={() => navigate(AppRoutes.client.protected.ADMIN_PRODUCTS)}
          />
      )}
    </>
  );
};
