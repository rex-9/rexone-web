import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { Image, StatusBadge } from "../../../../design";
import { DateTime, DateTimeFormats } from "../../../../design";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import UserController from "../user.controller";
import type { IAdminUser } from "../types";

const loadUser = async (id: string) => {
  const result = await UserController.getUser(id);
  return { ...result, record: result.user };
};

export const AdminUserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: user, error } = useAdminDetail<IAdminUser>(id, loadUser);
  const listPath = AppRoutes.client.protected.admin.USERS;
  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Users.Title), to: listPath },
          { label: user?.name || t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={user?.name || t(AppLocales.Admin.Users.Detail.Title)}
        description={user?.username ? `@${user.username}` : t(AppLocales.Admin.Users.Detail.Description)}
        backTo={listPath}
        icon={iconsLib.user}
        statusBadge={
          user ? (
            <StatusBadge status={user.locked ? "locked" : user.confirmed ? "confirmed" : "unconfirmed"} />
          ) : undefined
        }
        entityId={user?.id}
        timestamps={
          user
            ? {
                createdAt: user.created_at,
                updatedAt: user.updated_at,
              }
            : undefined
        }
      />
      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Users.Errors.LoadOneFailed)}
          message={error}
        />
      ) : user ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <AdminDetailSection
            title={t(AppLocales.Admin.Users.Detail.Identity)}
            icon={iconsLib.user}
            accent
          >
            <div className="flex flex-col items-center gap-4 text-center py-2">
              <div className="h-28 w-28 overflow-hidden rounded-2xl border-2 border-primary/30 bg-base-200 shadow-md p-1">
                <Image
                  src={user.avatar_url || ""}
                  alt={user.name}
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-base-content">{user.name}</h2>
                <p className="text-xs font-mono font-medium text-primary mt-0.5">@{user.username}</p>
              </div>
            </div>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Users.Detail.Account)}
            icon={iconsLib.document}
            className="lg:col-span-2"
          >
            <AdminDetailGrid>
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Email)}
                value={user.email}
                copyable
                mono
                className="sm:col-span-2"
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Users.Detail.Provider)}
                value={user.provider}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Users.Detail.Confirmed)}
                value={
                  <StatusBadge
                    status={user.confirmed ? "confirmed" : "unconfirmed"}
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Users.Detail.Locked)}
                value={
                  <StatusBadge status={user.locked ? "locked" : "active"} />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={
                  <DateTime
                    value={user.created_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Updated)}
                value={
                  <DateTime
                    value={user.updated_at}
                    format={DateTimeFormats.ADMIN}
                  />
                }
              />
            </AdminDetailGrid>
          </AdminDetailSection>
          <AdminDetailSection
            title={t(AppLocales.Admin.Users.Detail.Roles)}
            icon={iconsLib.key}
            className="lg:col-span-3"
          >
            <div className="flex flex-wrap gap-2">
              {user.iam?.roles.length ? (
                user.iam.roles.map((role) => (
                  <span
                    key={role.id}
                    className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 font-medium text-primary"
                  >
                    {role.attributes.name}
                  </span>
                ))
              ) : (
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Users.Detail.NoRoles)}
                </span>
              )}
            </div>
          </AdminDetailSection>
        </div>
      ) : null}
    </div>
  );
};
