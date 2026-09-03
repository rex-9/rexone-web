// src/modules/admin/asset/components/AdminAssetUploadDialog.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  FileInput,
  Dropdown,
  Button,
  ProgressBar,
  ProgressBarVariants,
  Image,
} from "../../../../design";
import { ButtonVariants, UPLOAD_SIZE_LIMITS } from "../../../../constants";
import { AppLocales, useTranslate } from "../../../../locales";
import AdminAssetController from "../asset.controller";
import { ASSET_TYPE_OPTIONS, ASSET_TYPES } from "../constants";

interface IAdminAssetUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAssetUploadDialog: React.FC<IAdminAssetUploadDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const t = useTranslate();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>(ASSET_TYPES.GENERAL);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setType(ASSET_TYPES.GENERAL);
    setError(null);
    setProgress(0);
    setIsUploading(false);
  }, []);

  // Guarantee clean state whenever dialog closes or opens
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  // Object URL lifecycle: create on file change, revoke on cleanup or file removal
  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileChange = (selectedFile: File | null) => {
    setError(null);
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    const isVideo = selectedFile.type.startsWith("video/");
    const sizeLimit = isVideo
      ? UPLOAD_SIZE_LIMITS.UNCOMPRESSED_VIDEO_BYTES
      : UPLOAD_SIZE_LIMITS.UNCOMPRESSED_NON_VIDEO_BYTES;

    if (selectedFile.size > sizeLimit) {
      setError(
        `File exceeds the maximum size limit of ${sizeLimit / (1024 * 1024)}MB.`,
      );
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await AdminAssetController.uploadAsset(file, {
        type,
        folder: "admin_uploads",
      });

      clearInterval(interval);
      setProgress(100);

      if (response.success) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 300);
      } else {
        setError(
          response.error || t(AppLocales.Admin.Assets.Errors.UploadFailed),
        );
      }
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || t(AppLocales.Admin.Assets.Errors.UploadFailed));
    } finally {
      setIsUploading(false);
    }
  };

  const filteredTypeOptions = ASSET_TYPE_OPTIONS.filter(
    (opt) => opt.value !== "",
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={isUploading ? () => {} : handleClose}
      title={t(AppLocales.Admin.Assets.UploadDialog.Title)}
    >
      <div className="flex flex-col gap-4 py-4">
        <Dropdown
          label={t(AppLocales.Admin.Assets.UploadDialog.TypeLabel)}
          value={type}
          options={filteredTypeOptions.map((opt) => ({
            value: opt.value,
            label: opt.label,
          }))}
          onValueChange={(val) => setType(val)}
          disabled={isUploading}
        />

        <FileInput
          label={t(AppLocales.Admin.Assets.UploadDialog.FileLabel)}
          onChange={handleFileChange}
          disabled={isUploading}
          error={error || undefined}
        />

        {previewUrl && (
          <div className="mt-2 flex justify-center">
            <Image
              src={previewUrl}
              alt="Preview"
              className="max-h-48 rounded-lg object-contain"
            />
          </div>
        )}

        {isUploading && (
          <ProgressBar
            value={progress}
            showPercentage
            label={t(AppLocales.Admin.Assets.UploadDialog.Uploading)}
            variant={ProgressBarVariants.PRIMARY}
          />
        )}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant={ButtonVariants.SECONDARY}
          onClick={handleClose}
          disabled={isUploading}
        >
          {t(AppLocales.Admin.Common.Actions.Cancel)}
        </Button>
        <Button
          variant={ButtonVariants.PRIMARY}
          onClick={handleUpload}
          disabled={!file || isUploading}
          isLoading={isUploading}
        >
          {t(AppLocales.Admin.Assets.UploadDialog.UploadButton)}
        </Button>
      </div>
    </Dialog>
  );
};
