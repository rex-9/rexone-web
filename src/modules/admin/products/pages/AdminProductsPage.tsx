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
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_TABLE_HEADERS,
} from "../../constants";
import {
  ADMIN_PRODUCT_LABELS,
  ADMIN_PRODUCT_PAGE_TITLES,
  ADMIN_PRODUCT_TABLE_HEADERS,
  ADMIN_PRODUCT_TABLE_KEYS,
} from "../constants";

const formatDate = (value?: Date | null): string => {
  if (!value) return ADMIN_COMMON_LABELS.NOT_AVAILABLE;
  return new Date(value).toLocaleDateString();
};

type ProductListView = "active" | "discarded";

interface IAdminProductsPageProps {
  view?: ProductListView;
}

export const AdminProductsPage: React.FC<IAdminProductsPageProps> = ({
  view = "active",
}) => {
  useDocumentTitle(
    view === "active"
      ? ADMIN_PRODUCT_PAGE_TITLES.LIST
      : ADMIN_PRODUCT_PAGE_TITLES.RECYCLE_BIN,
  );

  const navigate = useNavigate();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();
  const { setLoading } = useLoading();
  const [products, setProducts] = useState<IAdminProduct[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [lifecycleTarget, setLifecycleTarget] = useState<IAdminProduct | null>(null);
  const [isLifecycleLoading, setIsLifecycleLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.PRODUCTS)) return;

    setLoading(true);
    setError("");

    const load = view === "active"
      ? ProductController.getProducts.bind(ProductController)
      : ProductController.getDiscardedProducts.bind(ProductController);

    await load(
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
  }, [can, page, setLoading, view]);

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
        key: ADMIN_PRODUCT_TABLE_KEYS.PRODUCT,
        header: ADMIN_PRODUCT_TABLE_HEADERS.PRODUCT,
        render: (product) => (
          <div>
            <div className="font-medium text-base-content">{product.name}</div>
            <div className="max-w-xs truncate text-body-s text-base-content opacity-60">
              {product.description || product.stripe_product_id}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.PRICE,
        header: ADMIN_PRODUCT_TABLE_HEADERS.PRICE,
        render: (product) => product.price,
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.CYCLE,
        header: ADMIN_PRODUCT_TABLE_HEADERS.CYCLE,
        render: (product) => product.period_label,
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.STATUS,
        header: ADMIN_TABLE_HEADERS.STATUS,
        render: (product) => (
          <div>
            <div className={product.active ? "text-success" : "text-base-content opacity-60"}>
              {product.active
                ? ADMIN_PRODUCT_LABELS.ACTIVE
                : ADMIN_PRODUCT_LABELS.INACTIVE}
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
        key: ADMIN_PRODUCT_TABLE_KEYS.LIFECYCLE_DATE,
        header:
          view === "active"
            ? ADMIN_TABLE_HEADERS.CREATED
            : ADMIN_PRODUCT_TABLE_HEADERS.DISCARDED,
        render: (product) =>
          formatDate(view === "active" ? product.created_at : product.discarded_at),
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.ACTIONS,
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (product) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.PRODUCTS}
            actions={
              view === "active"
                ? [
                    {
                      type: ADMIN_ACTIONS.EDIT,
                      onClick: () =>
                        navigate(
                          AppRoutes.withId(
                            AppRoutes.client.protected.admin.PRODUCT_EDIT,
                            product.id,
                          ),
                        ),
                    },
                    {
                      type: ADMIN_ACTIONS.DISCARD,
                      disabled: !product.active,
                      onClick: () => setLifecycleTarget(product),
                    },
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.RESTORE,
                      onClick: () => setLifecycleTarget(product),
                    },
                  ]
            }
          />
        ),
      },
    ],
    [navigate, view],
  );

  const handleLifecycleAction = async () => {
    if (!lifecycleTarget || !can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.PRODUCTS))
      return;

    setIsLifecycleLoading(true);

    const onSuccess = (message: string) => {
      toast.success(message);
      setLifecycleTarget(null);
      setIsLifecycleLoading(false);
      void loadProducts();
    };
    const onError = (message: string) => {
      toast.error(message);
      setIsLifecycleLoading(false);
    };

    const action = view === "active"
      ? ProductController.discardProduct.bind(ProductController)
      : ProductController.restoreProduct.bind(ProductController);

    await action(
      lifecycleTarget.id,
      onSuccess,
      onError,
    );
  };

  return (
    <>
      { error ? (
        <AdminState title="Unable to load products" message={error} />
      ) : (
        <>
          {products.length === 0 ? (
            <AdminState
              title={view === "active" ? "No products yet" : "Recycle bin is empty"}
              message={
                view === "active"
                  ? "Products will appear here after they are created."
                  : "Discarded products can be restored here."
              }
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
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(lifecycleTarget)}
        title={view === "active" ? "Discard product" : "Restore product"}
        message={
          view === "active"
            ? `Move ${lifecycleTarget?.name || "this product"} to the recycle bin? It will be archived in Stripe.`
            : `Restore ${lifecycleTarget?.name || "this product"}? It will become active in Stripe and return to the products list.`
        }
        confirmLabel={view === "active" ? ADMIN_COMMON_LABELS.DISCARD : ADMIN_COMMON_LABELS.RESTORE}
        isDestructive={view === "active"}
        isLoading={isLifecycleLoading}
        onClose={() => !isLifecycleLoading && setLifecycleTarget(null)}
        onConfirm={handleLifecycleAction}
      />
    </>
  );
};

export const AdminDiscardedProductsPage: React.FC = () => (
  <AdminProductsPage view="discarded" />
);
