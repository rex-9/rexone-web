import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import { IApiPagination } from "../../../../models";
import { IAdminProduct } from "../types";
import ProductController from "../product.controller";
import {
  AdminLoadingState,
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_PAGE_TITLES,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_TABLE_ACTION_TYPES,
  ADMIN_TABLE_HEADERS,
} from "../../constants";

const formatDate = (value?: Date): string => {
  if (!value) return ADMIN_COMMON_LABELS.NOT_AVAILABLE;
  return new Date(value).toLocaleDateString();
};

export const AdminProductsPage: React.FC = () => {
  useDocumentTitle(ADMIN_PAGE_TITLES.PRODUCTS);

  const navigate = useNavigate();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { isLoading, setLoading } = useLoading();
  const [products, setProducts] = useState<IAdminProduct[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IAdminProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.PRODUCTS)) return;

    setLoading(true);
    setError("");

    await ProductController.getProducts(
      { page, limit: ADMIN_PAGE_SIZE },
      (nextProducts, nextPagination) => {
        setProducts(nextProducts);
        setPagination(nextPagination ?? null);
        setLoading(false);
      },
      (message) => {
        setError(message);
        setLoading(false);
      },
    );
  }, [can, page, setLoading]);

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
        header: ADMIN_TABLE_HEADERS.PRODUCT,
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
        header: ADMIN_TABLE_HEADERS.PRICE,
        render: (product) => product.price,
      },
      {
        key: "cycle",
        header: ADMIN_TABLE_HEADERS.CYCLE,
        render: (product) => product.period_label,
      },
      {
        key: "active",
        header: ADMIN_TABLE_HEADERS.STATUS,
        render: (product) => (
          <div>
            <div className={product.active ? "text-success" : "text-base-content opacity-60"}>
              {product.active
                ? ADMIN_COMMON_LABELS.ACTIVE
                : ADMIN_COMMON_LABELS.INACTIVE}
            </div>
            {product.free && (
              <div className="text-caption text-base-content opacity-50">
                Free
              </div>
            )}
          </div>
        ),
      },
      {
        key: "created",
        header: ADMIN_TABLE_HEADERS.CREATED,
        render: (product) => formatDate(product.created_at),
      },
      {
        key: "actions",
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (product) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.PRODUCTS}
            actions={[
              {
                type: ADMIN_TABLE_ACTION_TYPES.EDIT,
                onClick: () =>
                  navigate(
                    AppRoutes.client.protected.ADMIN_PRODUCT_EDIT.replace(
                      ":id",
                      product.id,
                    ),
                  ),
              },
              {
                type: ADMIN_TABLE_ACTION_TYPES.DELETE,
                disabled: !product.active,
                onClick: () => setDeleteTarget(product),
              },
            ]}
          />
        ),
      },
    ],
    [navigate],
  );

  const handleDelete = async () => {
    if (!deleteTarget || !can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.PRODUCTS))
      return;

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
    <>
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete product"
        message={`Archive ${deleteTarget?.name || "this product"}?`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};
