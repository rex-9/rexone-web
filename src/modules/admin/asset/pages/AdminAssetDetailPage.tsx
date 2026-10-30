import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  ConfirmDialog,
  DetailField,
  DetailGrid,
  DetailHeader,
  DetailSection,
  StatusBadge,
} from "../../../../design";
import { useToast } from "../../../../contexts/ToastContext";
import {
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import AssetController from "../asset.controller";
import { formatAssetFileSize, getAssetChildren } from "../constants";
import { AdminAssetChildrenTable, AdminAssetMediaViewer } from "../components";
import type { IAsset, IAssetChild } from "../../../../models";

const loadAsset = async (id: string) => {
  const result = await AssetController.getAsset(id);
  return { ...result, record: result.asset };
};
export const AdminAssetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const t = useTranslate();
  const { record: asset, error, reload } = useAdminDetail<IAsset>(id, loadAsset);
  const listPath = AppRoutes.client.protected.admin.ASSETS;

  const [childToDiscard, setChildToDiscard] = useState<IAssetChild | null>(null);
  const [childToUndiscard, setChildToUndiscard] = useState<IAssetChild | null>(null);
  const [childToDestroy, setChildToDestroy] = useState<IAssetChild | null>(null);

  const handleDownload = async (target: IAsset | IAssetChild) => {
    const result = await AssetController.getDownloadUrl(target.id);
    if (!result.success || !result.url) return;

    const link = document.createElement("a");
    link.href = result.url;
    link.rel = "noopener";
    link.click();
  };

  const handleDiscardChild = async () => {
    if (!childToDiscard) return;
    const result = await AssetController.discardAsset(childToDiscard.id);
    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Assets.Toasts.DiscardSuccess));
      setChildToDiscard(null);
      reload();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Assets.Errors.DiscardFailed));
    }
  };

  const handleUndiscardChild = async () => {
    if (!childToUndiscard) return;
    const result = await AssetController.undiscardAsset(childToUndiscard.id);
    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Assets.Toasts.RestoreSuccess));
      setChildToUndiscard(null);
      reload();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Assets.Errors.RestoreFailed));
    }
  };

  const handleDestroyChild = async () => {
    if (!childToDestroy) return;
    const result = await AssetController.destroyAsset(childToDestroy.id);
    if (result.success) {
      toast.success(result.message || t(AppLocales.Admin.Assets.Toasts.DestroySuccess));
      setChildToDestroy(null);
      reload();
    } else {
      toast.error(result.error || t(AppLocales.Admin.Assets.Errors.DestroyFailed));
    }
  };

  return (
    <div className="space-y-6">
      <DetailHeader
        breadcrumbs={[
          { label: t(AppLocales.Admin.Common.Detail.Admin), to: AppRoutes.client.protected.admin.HOME },
          { label: t(AppLocales.Admin.Assets.Title), to: listPath },
          { label: asset?.title || asset?.name || t(AppLocales.Admin.Common.Detail.Details) },
        ]}
        title={asset?.title || asset?.name || t(AppLocales.Admin.Assets.Detail.Title)}
        description={asset?.description || (asset?.title ? asset.name : undefined) || t(AppLocales.Admin.Assets.Detail.Description)}
        backTo={listPath}
        icon={iconsLib.photo}
        statusBadge={asset?.status ? <StatusBadge status={asset.status} /> : undefined}
        entityId={asset?.id}
        timestamps={
          asset
            ? {
                createdAt: asset.created_at,
                updatedAt: asset.updated_at,
              }
            : undefined
        }
      />
      {error ? (
        <AdminState title={t(AppLocales.Admin.Common.State.ErrorTitle)} message={error} />
      ) : asset ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <DetailSection
            title={t(AppLocales.Admin.Assets.Detail.Preview)}
            icon={iconsLib.photo}
            accent
          >
            <AdminAssetMediaViewer
              asset={asset}
              onDownload={() => void handleDownload(asset)}
            />
          </DetailSection>
          <DetailSection
            title={t(AppLocales.Admin.Assets.Detail.Metadata)}
            icon={iconsLib.document}
            className="lg:col-span-2"
          >
            <DetailGrid>
              {asset.title && (
                <DetailField
                  label={t(AppLocales.Admin.Assets.Table.Title)}
                  value={asset.title}
                  copyable
                  className="sm:col-span-2 xl:col-span-3"
                />
              )}
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Name)}
                value={asset.name}
                copyable
                mono
                className="sm:col-span-2 xl:col-span-3"
              />
              {asset.description && (
                <DetailField
                  label={t(AppLocales.Admin.Assets.Table.Description)}
                  value={asset.description}
                  className="sm:col-span-2 xl:col-span-3"
                />
              )}
              <DetailField label={t(AppLocales.Admin.Common.Detail.Type)} value={asset.type} />
              <DetailField label={t(AppLocales.Admin.Common.Detail.Format)} value={asset.format} />
              <DetailField
                label={t(AppLocales.Admin.Assets.Detail.Status)}
                value={<StatusBadge status={asset.status || "unknown"} />}
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Size)}
                value={formatAssetFileSize(asset.size_bytes)}
              />
              <DetailField label={t(AppLocales.Admin.Common.Detail.Source)} value={asset.source} />
              <DetailField
                label={t(AppLocales.Admin.Assets.Detail.Duration)}
                value={
                  asset.duration_secs ? `${asset.duration_secs}s` : undefined
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Assets.Detail.StorageKey)}
                value={asset.storage_key}
                copyable
                mono
                className="sm:col-span-2 xl:col-span-3"
              />
            </DetailGrid>
          </DetailSection>
          <DetailSection
            title={t(AppLocales.Admin.Assets.Detail.Children)}
            icon={iconsLib.document}
            className="lg:col-span-3"
          >
            <AdminAssetChildrenTable
              assets={getAssetChildren(asset)}
              onDownload={handleDownload}
              onRowClick={(child) =>
                navigate(
                  AppRoutes.client.protected.admin.ASSET_DETAIL.replace(
                    ":id",
                    child.id,
                  ),
                )
              }
              onEdit={(child) =>
                navigate(
                  AppRoutes.client.protected.admin.ASSET_EDIT.replace(
                    ":id",
                    child.id,
                  ),
                )
              }
              onDiscard={(child) => setChildToDiscard(child)}
              onUndiscard={(child) => setChildToUndiscard(child)}
              onDestroy={(child) => setChildToDestroy(child)}
            />
          </DetailSection>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(childToDiscard)}
        title={t(AppLocales.Admin.Assets.Confirm.DiscardTitle)}
        message={t(AppLocales.Admin.Assets.Confirm.DiscardMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Discard)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleDiscardChild}
        onClose={() => setChildToDiscard(null)}
        isDestructive
      />

      <ConfirmDialog
        isOpen={Boolean(childToUndiscard)}
        title={t(AppLocales.Admin.Assets.Confirm.RestoreTitle)}
        message={t(AppLocales.Admin.Assets.Confirm.RestoreMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Restore)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleUndiscardChild}
        onClose={() => setChildToUndiscard(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(childToDestroy)}
        title={t(AppLocales.Admin.Assets.Confirm.DestroyTitle)}
        message={t(AppLocales.Admin.Assets.Confirm.DestroyMessage)}
        confirmLabel={t(AppLocales.Admin.Common.Actions.Destroy)}
        cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
        onConfirm={handleDestroyChild}
        onClose={() => setChildToDestroy(null)}
        isDestructive
      />
    </div>
  );
};