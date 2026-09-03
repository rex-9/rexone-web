// src/modules/admin/asset/pages/AdminAssetEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { Badge, Button, Image } from "../../../../design";
import { ButtonVariants } from "../../../../design/constants";
import { AppLocales, useTranslate } from "../../../../locales";
import AdminAssetController from "../asset.controller";
import type { IAdminAsset } from "../types";
import {
  AlertDialog,
  AdminState,
  FormActionRow,
  FormContainer,
  TextInput,
  Dropdown,
  PageHeader,
} from "../../components";
import {
  ASSET_TYPE_OPTIONS,
  formatAssetFileSize,
  isImageAsset,
} from "../constants";
import { formatAdminDate } from "../../../../helpers";

export const AdminAssetEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Assets.EditTitle)} | Admin`);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();

  const [asset, setAsset] = useState<IAdminAsset | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("general");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadAsset = async () => {
      setLoading(true);
      const result = await AdminAssetController.getAsset(id);
      setLoading(false);

      if (result.success && result.asset) {
        setAsset(result.asset);
        setName(result.asset.name || "");
        setType(result.asset.type || "general");
      } else {
        setError(
          result.error || t(AppLocales.Admin.Assets.Errors.LoadOneFailed),
        );
      }
    };

    void loadAsset();
  }, [id, setLoading, t]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    if (!name.trim()) {
      setAlertMessage("Asset name is required.");
      return;
    }

    setLoading(true, { overlay: false });

    const result = await AdminAssetController.updateAsset(id, {
      name: name.trim(),
      type,
    });
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(
        result.message || t(AppLocales.Admin.Assets.Toasts.UpdateSuccess),
      );
      navigate(AppRoutes.client.protected.admin.ASSETS);
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Assets.Errors.UpdateFailed),
      );
    }
  };

  const filteredTypeOptions = ASSET_TYPE_OPTIONS.filter(
    (opt) => opt.value !== "",
  );

  return (
    <div className="space-y-6">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <PageHeader
        title={t(AppLocales.Admin.Assets.EditTitle)}
        description={t(AppLocales.Admin.Assets.EditDescription)}
        action={
          <Button
            variant={ButtonVariants.SECONDARY}
            onClick={() => navigate(AppRoutes.client.protected.admin.ASSETS)}
          >
            <iconsLib.arrowLeft className="w-5 h-5 mr-2" />
            {t(AppLocales.Admin.Common.Actions.Cancel)}
          </Button>
        }
      />

      {error && !asset ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : asset ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Preview and Details Card */}
          <div className="lg:col-span-1 bg-base-100 rounded-xl border border-base-200 p-6 space-y-4">
            <h3 className="font-semibold text-base-content text-lg">
              {t(AppLocales.Admin.Assets.Table.Preview)}
            </h3>

            <div className="w-full aspect-video rounded-lg overflow-hidden bg-base-200 flex items-center justify-center border border-base-300">
              {isImageAsset(asset) ? (
                <Image
                  src={asset.url}
                  alt={asset.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  fallback={
                    <div className="flex flex-col items-center gap-2 text-base-content/60">
                      <iconsLib.photo className="w-12 h-12" />
                      <span className="text-xs uppercase font-medium">
                        {asset.format || "Media"}
                      </span>
                    </div>
                  }
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-base-content/60">
                  <iconsLib.photo className="w-12 h-12" />
                  <span className="text-xs uppercase font-medium">
                    {asset.format || "Media"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Assets.Table.Type)}
                </span>
                <Badge>{asset.type}</Badge>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Assets.Table.Format)}
                </span>
                <span className="font-medium uppercase text-base-content">
                  {asset.format || "N/A"}
                </span>
              </div>

              {asset.extension && (
                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">Extension</span>
                  <span className="font-medium text-base-content">
                    .{asset.extension}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Assets.Table.Size)}
                </span>
                <span className="font-medium text-base-content">
                  {formatAssetFileSize(asset.size_bytes)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Assets.Table.Source)}
                </span>
                <span className="font-medium capitalize text-base-content">
                  {asset.source}
                </span>
              </div>

              {asset.assetable_type && (
                <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                  <span className="text-base-content/60">Attached To</span>
                  <span className="font-medium text-base-content">
                    {asset.assetable_type}
                    {asset.assetable_id
                      ? ` (#${asset.assetable_id.slice(0, 8)})`
                      : ""}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Assets.Table.Created)}
                </span>
                <span className="text-base-content/70">
                  {formatAdminDate(asset.created_at)}
                </span>
              </div>

              {asset.url && (
                <div className="pt-2">
                  <Button
                    variant={ButtonVariants.TERTIARY}
                    className="p-0 h-auto text-primary hover:underline text-xs"
                    onClick={() =>
                      window.open(asset.url, "_blank", "noopener,noreferrer")
                    }
                  >
                    View Original Media ↗
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Asset Edit Form */}
          <div className="lg:col-span-2">
            <FormContainer onSubmit={handleSubmit}>
              <div className="space-y-4">
                <TextInput
                  label="Asset Name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter asset name"
                  helperText="Unique identifier name for this asset in storage"
                />

                <Dropdown
                  label={t(AppLocales.Admin.Assets.UploadDialog.TypeLabel)}
                  value={type}
                  options={filteredTypeOptions.map((opt) => ({
                    value: opt.value,
                    label: opt.label,
                  }))}
                  onValueChange={(val) => setType(val)}
                />
              </div>

              <FormActionRow
                cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
                submitLabel={t(AppLocales.Admin.Common.Actions.Save)}
                onCancel={() =>
                  navigate(AppRoutes.client.protected.admin.ASSETS)
                }
              />
            </FormContainer>
          </div>
        </div>
      ) : null}
    </div>
  );
};
