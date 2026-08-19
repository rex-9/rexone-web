import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { IApiPagination } from "../../../../models";
import { IAdminProduct } from "../types";
import ProductController from "../product.controller";
import {
  AdminActionButton,
  AdminLayout,
  AdminLoadingState,
  AdminPagination,
  AdminState,
  AdminTable,
  ConfirmationDialog,
  IAdminTableColumn,
} from "../../../../design/components";

const PAGE_SIZE = 10;

const formatDate = (value?: Date): string => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString();
};

export const AdminProductsPage: React.FC = () => {
  useDocumentTitle("Products");

  const navigate = useNavigate();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const [products, setProducts] = useState<IAdminProduct[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IAdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    if (!can("read", "products")) return;

    setIsLoading(true);
    setError("");

    await ProductController.getProducts(
      { page, limit: PAGE_SIZE },
      (nextProducts, nextPagination) => {
        setProducts(nextProducts);
        setPagination(nextPagination ?? null);
        setIsLoading(false);
      },
      (message) => {
        setError(message);
        setIsLoading(false);
      },
    );
  }, [can, page]);

  useEffect(() => {
    if (permissionsLoading) return;

    const timeoutId = window.setTimeout(() => {
      void loadProducts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProducts, permissionsLoading]);

  const columns = useMemo<IAdminTableColumn<IAdminProduct>[]>(
    () => [
      {
        key: "product",
        header: "Product",
        render: (product) => (
          <div>
            <div className="font-medium text-base-content">{product.name}</div>
            <div className="max-w-[320px] truncate text-body-s text-base-content opacity-60">
              {product.description || product.stripe_product_id}
            </div>
          </div>
        ),
      },
      {
        key: "price",
        header: "Price",
        render: (product) => product.price,
      },
      {
        key: "cycle",
        header: "Cycle",
        render: (product) => product.period_label,
      },
      {
        key: "active",
        header: "Status",
        render: (product) => (
          <div>
            <div className={product.active ? "text-success" : "text-base-content opacity-60"}>
              {product.active ? "Active" : "Inactive"}
            </div>
            {product.free && (
              <div className="text-caption text-base-content opacity-50">
                Local
              </div>
            )}
          </div>
        ),
      },
      {
        key: "created",
        header: "Created",
        render: (product) => formatDate(product.created_at),
      },
      {
        key: "actions",
        header: "",
        className: "text-right",
        render: (product) => (
          <div className="flex justify-end gap-8">
            <AdminActionButton
              action="update"
              resource="products"
              can={can}
              size="sm"
              variant="secondary"
              className="h-[32px] w-[32px] p-0"
              aria-label="Edit product"
              title="Edit"
              onClick={() =>
                navigate(
                  AppRoutes.client.protected.ADMIN_PRODUCT_EDIT.replace(
                    ":id",
                    product.id,
                  ),
                )
              }
            >
              <PencilSquareIcon className="h-[18px] w-[18px]" />
            </AdminActionButton>
            <AdminActionButton
              action="delete"
              resource="products"
              can={can}
              size="sm"
              variant="tertiary"
              className="h-[32px] w-[32px] p-0"
              aria-label="Delete product"
              title="Delete"
              onClick={() => setDeleteTarget(product)}
            >
              <TrashIcon className="h-[18px] w-[18px]" />
            </AdminActionButton>
          </div>
        ),
      },
    ],
    [can, navigate],
  );

  const handleDelete = async () => {
    if (!deleteTarget || !can("delete", "products")) return;

    setIsDeleting(true);

    await ProductController.deleteProduct(
      deleteTarget.id,
      (message) => {
        toast.success(message);
        setDeleteTarget(null);
        setIsDeleting(false);
        void loadProducts();
      },
      (message) => {
        toast.error(message);
        setIsDeleting(false);
      },
    );
  };

  return (
    <AdminLayout
      title="Products"
      actionLabel={can("create", "products") ? "Create product" : undefined}
      onAction={() => navigate(AppRoutes.client.protected.ADMIN_PRODUCT_CREATE)}
    >
      {isLoading || permissionsLoading ? (
        <AdminLoadingState />
      ) : error ? (
        <AdminState title="Unable to load products" message={error} />
      ) : products.length === 0 ? (
        <AdminState
          title="No products yet"
          message="Products will appear here after they are created."
        />
      ) : (
        <>
          <AdminTable
            columns={columns}
            records={products}
            getRowKey={(product) => product.id}
          />
          <AdminPagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete product"
        message={`Archive ${deleteTarget?.name || "this product"}?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
};
