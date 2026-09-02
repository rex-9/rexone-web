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
  
  AdminState,
} from "../../components";
import ProductController from "../product.controller";
import { AdminProductForm } from "./AdminProductForm";
import { ADMIN_PRODUCT_PAGE_TITLES } from "../constants";
import { ADMIN_ACTIONS } from "../../constants";

export const AdminProductEditPage: React.FC = () => {
  useDocumentTitle(ADMIN_PRODUCT_PAGE_TITLES.EDIT);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const {setLoading } = useLoading();
  const [product, setProduct] = useState<IAdminProduct | null>(null);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      const result = await ProductController.getProduct(id);
      setLoading(false);

      if (result.success && result.product) {
        setProduct(result.product);
      } else {
        setError(result.error || "Product not found");
      }
    };

    void loadProduct();
  }, [id, setLoading]);

  const handleSubmit = async (values: IAdminProductFormValues) => {
    if (!id) return;

    setLoading(true, { overlay: false });

    const result = await ProductController.updateProduct(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(result.message || "Product updated");
      navigate(AppRoutes.client.protected.admin.PRODUCTS);
    } else {
      setAlertMessage(result.error || "Failed to update product");
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {error && !product ? (
        <AdminState title="Unable to load product" message={error} />
      ) : product? (
        <AdminProductForm
            mode={ADMIN_ACTIONS.EDIT}
            product={product}
            onSubmit={handleSubmit}
            onCancel={() => navigate(AppRoutes.client.protected.admin.PRODUCTS)}
          />
      ):null}
    </>
  );
};
