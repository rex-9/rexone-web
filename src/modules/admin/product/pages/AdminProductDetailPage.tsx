import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  DetailField,
  DetailGrid,
  DetailHeader,
  DetailSection,
  Image,
  StatusBadge,
} from "../../../../design";
import {
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import ProductController from "../product.controller";
import AccessController from "../../access/access.controller";
import type { IAdminAccess } from "../../access/types";
import type { IAdminProduct } from "../types";

const loadProduct = async (id: string) => {
  const result = await ProductController.getProduct(id);
  return { ...result, record: result.product };
};
export const AdminProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useTranslate();
  const { record: product, error } = useAdminDetail<IAdminProduct>(
    id,
    loadProduct,
  );
  const [accesses, setAccesses] = useState<IAdminAccess[]>([]);
  const [loadingAccesses, setLoadingAccesses] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    const fetchAccesses = async () => {
      setLoadingAccesses(true);
      const res = await AccessController.getAccesses({ product_id: id, limit: 50 });
      if (active && res.success) {
        setAccesses(res.accesses);
      }
      if (active) setLoadingAccesses(false);
    };
    void fetchAccesses();
    return () => {
      active = false;
    };
  }, [id]);

  const listPath = AppRoutes.client.protected.admin.PRODUCTS;
  return (
    <div className="space-y-6">
      <DetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Products.Title), to: listPath },
          { label: product?.name || t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={product?.name || t(AppLocales.Admin.Products.Detail.Title)}
        description={product?.description || t(AppLocales.Admin.Products.Detail.Description)}
        backTo={listPath}
        icon={iconsLib.cube}
        statusBadge={
          product ? (
            <StatusBadge status={product.active ? "active" : "inactive"} />
          ) : undefined
        }
        entityId={product?.id}
      />
      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Products.Errors.LoadOne)}
          message={error}
        />
      ) : product ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <DetailSection
            title={t(AppLocales.Admin.Products.Detail.Product)}
            icon={iconsLib.photo}
            accent
          >
            {product.thumbnail_url && (
              <div className="overflow-hidden rounded-xl border border-base-200 bg-base-200/50 p-2 shadow-inner mb-4">
                <Image
                  src={product.thumbnail_url}
                  alt={product.name}
                  className="aspect-video w-full rounded-lg object-cover"
                />
              </div>
            )}
            <h2 className="text-xl font-bold tracking-tight text-base-content">{product.name}</h2>
            <p className="mt-1.5 text-xs text-base-content/70">{product.description}</p>
          </DetailSection>
          <DetailSection
            title={t(AppLocales.Admin.Products.Detail.Pricing)}
            icon={iconsLib.cube}
            className="lg:col-span-2"
          >
            <DetailGrid>
              <DetailField
                label={t(AppLocales.Admin.Products.Table.Code)}
                value={product.code}
                copyable
                mono
              />
              <DetailField
                label={t(AppLocales.Admin.Products.Table.Price)}
                value={product.price}
              />
              <DetailField
                label={t(AppLocales.Admin.Products.Detail.BillingInterval)}
                value={product.period_label || product.interval}
              />
              <DetailField
                label={t(AppLocales.Admin.Products.Detail.Recurring)}
                value={
                  <StatusBadge
                    status={product.recurring ? "recurring" : "one-time"}
                  />
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Products.Detail.Availability)}
                value={
                  <StatusBadge
                    status={product.active ? "active" : "inactive"}
                  />
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={
                  <DateTime
                    value={product.created_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
            </DetailGrid>
          </DetailSection>

          {/* Users with Access */}
          <DetailSection
            title="Users with Access"
            icon={iconsLib.userGroup}
            className="lg:col-span-3"
          >
            {loadingAccesses ? (
              <div className="py-6 text-center text-sm text-base-content/60">
                Loading access entitlements...
              </div>
            ) : accesses.length === 0 ? (
              <div className="py-6 text-center text-sm text-base-content/60">
                No users hold access to this product yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra table-sm w-full">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Granted</th>
                      <th className="text-center">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accesses.map((access) => (
                      <tr
                        key={access.id}
                        className="hover cursor-pointer"
                        onClick={() =>
                          access.user_id &&
                          navigate(
                            AppRoutes.withId(
                              AppRoutes.client.protected.admin.USER_DETAIL,
                              access.user_id,
                            ),
                          )
                        }
                      >
                        <td>
                          <div className="font-semibold text-base-content">
                            {access.user_name || access.username || "—"}
                          </div>
                          {access.username && (
                            <div className="text-xs text-base-content/50">
                              @{access.username}
                            </div>
                          )}
                        </td>
                        <td className="text-xs font-mono">{access.user_email || "—"}</td>
                        <td className="text-center">
                          <StatusBadge status={access.status} />
                        </td>
                        <td className="text-center text-xs">
                          {access.granted_at ? (
                            <DateTime
                              value={access.granted_at}
                              format={DateTimeFormats.ADMIN}
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="text-center text-xs">
                          {access.expires_at ? (
                            <DateTime
                              value={access.expires_at}
                              format={DateTimeFormats.ADMIN}
                            />
                          ) : (
                            <span className="badge badge-ghost badge-sm font-semibold">
                              Lifetime
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DetailSection>
        </div>
      ) : null}
    </div>
  );
};
