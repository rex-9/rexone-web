import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  DetailField,
  DetailGrid,
  DetailHeader,
  DetailSection,
  StatusBadge,
} from "../../../../design";
import { AppLocales, useTranslate } from "../../../../locales";
import {
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import type { IAdminVersion } from "../types";
import VersionController from "../version.controller";
import { AdminUserVersionsPage } from "./AdminUserVersionsPage";

const loadVersion = async (id: string) => {
  const result = await VersionController.getVersion(id);
  return { ...result, record: result.version };
};

export const AdminVersionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();
  const { record: version, error } = useAdminDetail<IAdminVersion>(
    id,
    loadVersion,
  );
  const listPath = AppRoutes.client.protected.admin.VERSIONS;

  return (
    <div className="space-y-6">
      <DetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Versions.Title), to: listPath },
          {
            label:
              version?.number || t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={version?.number ? `v${version.number}` : t(AppLocales.Admin.Versions.Detail.Title)}
        description={version?.title || t(AppLocales.Admin.Versions.Detail.Description)}
        backTo={listPath}
        icon={iconsLib.tag}
        statusBadge={version ? <StatusBadge status={version.status} /> : undefined}
        entityId={version?.id}
        timestamps={
          version
            ? {
                createdAt: version.created_at,
                updatedAt: version.updated_at,
              }
            : undefined
        }
      />

      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Versions.Errors.LoadOne)}
          message={error}
        />
      ) : version ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <DetailSection
              title={t(AppLocales.Admin.Versions.Detail.Release)}
              icon={iconsLib.tag}
            >
              <DetailGrid className="xl:grid-cols-2">
                <DetailField
                  label={t(AppLocales.Admin.Versions.Detail.VersionNumber)}
                  value={version.number}
                />
                <DetailField
                  label={t(AppLocales.Admin.Common.Detail.Status)}
                  value={<StatusBadge status={version.status} />}
                />
                <DetailField
                  label={t(AppLocales.Admin.Versions.Table.Title)}
                  value={version.title}
                />
                <DetailField
                  label={t(AppLocales.Admin.Versions.Detail.ForceUpdate)}
                  value={
                    <StatusBadge
                      status={version.is_force_update ? "enabled" : "disabled"}
                    />
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Common.Detail.Description)}
                  value={version.description}
                  className="sm:col-span-2"
                />
              </DetailGrid>
            </DetailSection>

            <DetailSection
              title={t(AppLocales.Admin.Versions.Detail.Builds)}
              icon={iconsLib.devicePhoneMobile}
            >
              <DetailGrid className="xl:grid-cols-2">
                <DetailField
                  label={t(AppLocales.Admin.Versions.Detail.IosBuild)}
                  value={version.ios_build_number}
                />
                <DetailField
                  label={t(AppLocales.Admin.Versions.Detail.AndroidBuild)}
                  value={version.android_build_number}
                />
                <DetailField
                  label={t(AppLocales.Admin.Versions.Detail.Released)}
                  value={
                    <DateTime
                      value={version.released_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Common.Detail.Created)}
                  value={
                    <DateTime
                      value={version.created_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Common.Detail.Updated)}
                  value={
                    <DateTime
                      value={version.updated_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Versions.Table.Installs)}
                  value={version.install_count ?? 0}
                />
              </DetailGrid>
            </DetailSection>
          </div>

          <DetailSection
            title={t(AppLocales.Admin.Versions.Detail.Installs)}
            icon={iconsLib.user}
            contentClassName="space-y-6"
          >
            <AdminUserVersionsPage embedded />
          </DetailSection>

          {version.metadata && Object.keys(version.metadata).length > 0 && (
            <DetailSection
              title={t(AppLocales.Admin.Common.Detail.Metadata)}
              icon={iconsLib.cube}
            >
              <pre className="overflow-x-auto rounded-lg bg-surface-raised p-4 font-mono text-xs text-text-primary">
                {JSON.stringify(version.metadata, null, 2)}
              </pre>
            </DetailSection>
          )}
        </>
      ) : null}
    </div>
  );
};
