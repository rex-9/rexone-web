// src/modules/admin/products/pages/AdminProductsPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle, usePermissions } from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import { Button, Badge } from "../../../../design";
import type { IAdminProduct } from "../types";
import ProductController from "../product.controller";
import {
  AdminPagination,
  AdminState,
  AdminTableActions,
  AdminTable,
  ConfirmDialog,
  PageHeader,
  Tabs,
  type IAdminTableColumn,
} from "../../components";
import {
  ADMIN_ACTIONS,
  ADMIN_COMMON_LABELS,
  ADMIN_PAGE_SIZE,
  ADMIN_RESOURCES,
  ADMIN_TABLE_HEADERS,
  ADMIN_VIEW_MODES,
  type TAdminViewMode,
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

const formatPrice = (amount: number, currency: string): string => {
  const formatted = (amount / 100).toFixed(2);
  return `$${formatted} ${currency.toUpperCase()}`;
};

interface IAdminProductsPageProps {
  view?: TAdminViewMode;
}

type ProductLifecycleAction =
  | typeof ADMIN_ACTIONS.DISCARD
  | typeof ADMIN_ACTIONS.UNDISCARD;

export const AdminProductsPage: React.FC<IAdminProductsPageProps> = ({
  view = ADMIN_VIEW_MODES.ACTIVE,
}) => {
  useDocumentTitle(
    view === ADMIN_VIEW_MODES.ACTIVE
      ? ADMIN_PRODUCT_PAGE_TITLES.LIST
      : ADMIN_PRODUCT_PAGE_TITLES.RECYCLE_BIN,
  );

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { isLoading, setLoading } = useLoading();
  const toast = useToast();
  const { can, isLoading: permissionsLoading } = usePermissions();

  const [products, setProducts] = useState<IAdminProduct[]>([]);
  const [pagination, setPagination] = useState<IApiPagination | null>(null);
  const [error, setError] = useState("");
  const [lifecycleTarget, setLifecycleTarget] = useState<{
    product: IAdminProduct;
    action: ProductLifecycleAction;
  } | null>(null);

  const updateFilters = useCallback(
    (updates: { page?: number }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.page !== undefined) {
            if (updates.page > 1) next.set("page", updates.page.toString());
            else next.delete("page");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const loadProducts = useCallback(async () => {
    if (!can(ADMIN_ACTIONS.READ, ADMIN_RESOURCES.PRODUCTS)) return;

    setLoading(true);
    setError("");

    const load =
      view === "active"
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
        key: ADMIN_PRODUCT_TABLE_KEYS.IDENTITY,
        header: ADMIN_PRODUCT_TABLE_HEADERS.NAME,
        render: (product) => (
          <div>
            <div className="font-semibold text-base-content">
              {product.name}
            </div>
            <div className="text-caption font-mono text-base-content opacity-60">
              {product.code}
            </div>
          </div>
        ),
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.PRICE,
        header: ADMIN_PRODUCT_TABLE_HEADERS.PRICE,
        render: (product) => (
          <div className="font-medium text-base-content">
            {formatPrice(product.price_unit_amount, product.currency)}
          </div>
        ),
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.CYCLE,
        header: ADMIN_PRODUCT_TABLE_HEADERS.CYCLE,
        render: (product) => (
          <span className="text-body-m capitalize text-base-content">
            {product.cycle || "One-time"}
          </span>
        ),
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.STATUS,
        header: ADMIN_PRODUCT_TABLE_HEADERS.STATUS,
        render: (product) => (
          <Badge
            size="xs"
            variant={product.active ? "success" : "secondary"}
          >
            {product.active
              ? ADMIN_PRODUCT_LABELS.ACTIVE
              : ADMIN_PRODUCT_LABELS.INACTIVE}
          </Badge>
        ),
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.LIFECYCLE_DATE,
        header:
          view === ADMIN_VIEW_MODES.ACTIVE
            ? ADMIN_TABLE_HEADERS.CREATED
            : "Discarded",
        render: (product) =>
          formatDate(
            view === ADMIN_VIEW_MODES.ACTIVE
              ? product.created_at
              : product.discarded_at,
          ),
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.ACTIONS,
        header: ADMIN_TABLE_HEADERS.ACTIONS,
        className: "text-right",
        render: (product) => (
          <AdminTableActions
            resource={ADMIN_RESOURCES.PRODUCTS}
            actions={
              view === ADMIN_VIEW_MODES.ACTIVE
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
                      onClick: () =>
                        setLifecycleTarget({
                          product,
                          action: ADMIN_ACTIONS.DISCARD,
                        }),
                    },
                  ]
                : [
                    {
                      type: ADMIN_ACTIONS.UNDISCARD,
                      onClick: () =>
                        setLifecycleTarget({
                          product,
                          action: ADMIN_ACTIONS.UNDISCARD,
                        }),
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
    if (
      !lifecycleTarget ||
      !can(ADMIN_ACTIONS.DELETE, ADMIN_RESOURCES.PRODUCTS)
    )
      return;

    setLoading(true);

    const onSuccess = (message: string) => {
      toast.success(message);
      setLifecycleTarget(null);
      setLoading(false);
      void loadProducts();
    };
    const onError = (message: string) => {
      toast.error(message);
      setLoading(false);
    };

    const action =
      lifecycleTarget.action === ADMIN_ACTIONS.DISCARD
        ? ProductController.discardProduct.bind(ProductController)
        : ProductController.undiscardProduct.bind(ProductController);

    await action(lifecycleTarget.product.id, onSuccess, onError);
  };

  const canCreate = can(ADMIN_ACTIONS.CREATE, ADMIN_RESOURCES.PRODUCTS);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? "Products & Pricing"
            : "Product Recycle Bin"
        }
        description={
          view === ADMIN_VIEW_MODES.ACTIVE
            ? "Configure catalog products, subscription plans, pricing tiers, and sync with payment providers."
            : "Review and restore discarded catalog products."
        }
        action={
          view === ADMIN_VIEW_MODES.ACTIVE && canCreate ? (
            <Button
              onClick={() =>
                navigate(AppRoutes.client.protected.admin.PRODUCT_CREATE)
              }
            >
              <iconsLib.plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          ) : null
        }
      >
        <Tabs
          value={view}
          onChange={(tab) => {
            navigate(
              tab === ADMIN_VIEW_MODES.ACTIVE
                ? AppRoutes.client.protected.admin.PRODUCTS
                : AppRoutes.client.protected.admin.PRODUCTS_RECYCLE_BIN,
            );
            updateFilters({ page: 1 });
          }}
          items={[
            {
              value: ADMIN_VIEW_MODES.ACTIVE,
              label: "Active Products",
              icon: iconsLib.sparkles,
              count:
                view === ADMIN_VIEW_MODES.ACTIVE
                  ? pagination?.total_count
                  : undefined,
            },
            {
              value: ADMIN_VIEW_MODES.DISCARDED,
              label: "Recycle Bin",
              icon: iconsLib.trash,
              count:
                view === ADMIN_VIEW_MODES.DISCARDED
                  ? pagination?.total_count
                  : undefined,
            },
          ]}
        />
      </PageHeader>

      {/* Table & States */}
      {error ? (
        <AdminState
          icon={iconsLib.warning}
          title="Unable to load products"
          message={error}
        />
      ) : !isLoading && products.length === 0 ? (
        <AdminState
          icon={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? iconsLib.cube
              : iconsLib.inboxStack
          }
          title={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "No products found"
              : "Recycle bin is empty"
          }
          message={
            view === ADMIN_VIEW_MODES.ACTIVE
              ? "No products are configured in the catalog yet."
              : "Discarded catalog products will appear here."
          }
        />
      ) : (
        <>
          <AdminTable<IAdminProduct>
            records={products}
            columns={columns}
            getRowKey={(record) => record.id}
          />
          <AdminPagination
            pagination={pagination}
            onPageChange={(nextPage) => updateFilters({ page: nextPage })}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={Boolean(lifecycleTarget)}
        title={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD
            ? "Discard Product"
            : "Restore Product"
        }
        message={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD
            ? `Move ${lifecycleTarget?.product?.name || "this product"} to the recycle bin? It will be archived in Stripe.`
            : `Restore ${lifecycleTarget?.product?.name || "this product"}? It will become active in Stripe and return to the products list.`
        }
        confirmLabel={
          lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD
            ? ADMIN_COMMON_LABELS.DISCARD
            : ADMIN_COMMON_LABELS.UNDISCARD
        }
        isDestructive={lifecycleTarget?.action === ADMIN_ACTIONS.DISCARD}
        isLoading={isLoading}
        onClose={() => !isLoading && setLifecycleTarget(null)}
        onConfirm={handleLifecycleAction}
      />
    </div>
  );
};

export const AdminDiscardedProductsPage: React.FC = () => (
  <AdminProductsPage view={ADMIN_VIEW_MODES.DISCARDED} />
);
