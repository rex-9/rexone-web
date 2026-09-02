// src/modules/admin/products/pages/AdminProductsPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import {
  useDocumentTitle,
  usePermissions,
  useSort,
  SORT_ORDERS,
} from "../../../../hooks";
import type { IApiPagination } from "../../../../models";
import { iconsLib } from "../../../../assets";
import { Button, StatusBadge } from "../../../../design";
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
  ADMIN_PRODUCT_PAGE_TITLES,
  ADMIN_PRODUCT_SORT_KEYS,
  ADMIN_PRODUCT_TABLE_HEADERS,
  ADMIN_PRODUCT_TABLE_KEYS,
} from "../constants";

const formatPrice = (amount: number, currency: string): string => {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

import { formatAdminDate } from "../../../../helpers";

type ProductLifecycleAction =
  | typeof ADMIN_ACTIONS.DISCARD
  | typeof ADMIN_ACTIONS.UNDISCARD;

interface IAdminProductsPageProps {
  view?: TAdminViewMode;
}

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

  const { sortBy, sortOrder, handleSort } = useSort({
    defaultSortBy:
      view === ADMIN_VIEW_MODES.ACTIVE
        ? ADMIN_PRODUCT_SORT_KEYS.CREATED_AT
        : ADMIN_PRODUCT_SORT_KEYS.DISCARDED_AT,
    defaultSortOrder: SORT_ORDERS.DESC,
  });

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

    const result =
      view === ADMIN_VIEW_MODES.ACTIVE
        ? await ProductController.getProducts({
            page,
            limit: ADMIN_PAGE_SIZE,
            sort_by: sortBy,
            sort_order: sortOrder,
          })
        : await ProductController.getDiscardedProducts({
            page,
            limit: ADMIN_PAGE_SIZE,
            sort_by: sortBy,
            sort_order: sortOrder,
          });

    if (result.success) {
      setProducts(result.products);
      setPagination(result.pagination);
    } else {
      setError(result.error || "Failed to load products");
    }
    setLoading(false);
  }, [can, page, setLoading, sortBy, sortOrder, view]);

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
        sortKey: ADMIN_PRODUCT_SORT_KEYS.NAME,
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
        sortKey: ADMIN_PRODUCT_SORT_KEYS.PRICE_UNIT_AMOUNT,
        render: (product) => (
          <div className="font-medium text-base-content">
            {formatPrice(product.price_unit_amount, product.currency)}
          </div>
        ),
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.CYCLE,
        header: ADMIN_PRODUCT_TABLE_HEADERS.CYCLE,
        sortKey: ADMIN_PRODUCT_SORT_KEYS.CYCLE,
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
          <StatusBadge status={product.active ? "active" : "inactive"} />
        ),
      },
      {
        key: ADMIN_PRODUCT_TABLE_KEYS.LIFECYCLE_DATE,
        header:
          view === ADMIN_VIEW_MODES.ACTIVE
            ? ADMIN_TABLE_HEADERS.CREATED
            : "Discarded",
        sortKey:
          view === ADMIN_VIEW_MODES.ACTIVE
            ? ADMIN_PRODUCT_SORT_KEYS.CREATED_AT
            : ADMIN_PRODUCT_SORT_KEYS.DISCARDED_AT,
        render: (product) =>
          formatAdminDate(
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

    const result =
      lifecycleTarget.action === ADMIN_ACTIONS.DISCARD
        ? await ProductController.discardProduct(lifecycleTarget.product.id)
        : await ProductController.undiscardProduct(lifecycleTarget.product.id);

    setLoading(false);

    if (result.success) {
      toast.success(result.message || "Operation successful");
      setLifecycleTarget(null);
      void loadProducts();
    } else {
      toast.error(result.error || "Operation failed");
    }
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
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
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
