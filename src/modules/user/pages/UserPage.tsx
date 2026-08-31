// src/modules/user/pages/UserPage.tsx

import React, { useState } from "react";
import { PageLayout } from "../../../design/pages/PageLayout";
import { Button, ProfileAvatar } from "../../../design";
import { FileInput } from "../../../design/components/form";
import { ButtonVariants, ComponentSizes } from "../../../design/constants";
import UserController from "../user.controller";
import { useAuth } from "../../../contexts";
import { useTranslate } from "../../../hooks";
import { AppLocales } from "../../../locales/app_locales";

export const UserPage: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const t = useTranslate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const result = await UserController.uploadImage(selectedFile, {
        type: "avatar",
        resource_model: "user",
        resource_id: currentUser?.id,
      });

      if (result?.asset?.url && currentUser) {
        setCurrentUser({
          ...currentUser,
          profile_pic_url: result.asset.url,
        });
        setSelectedFile(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageLayout enableAppServices>
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {/* Header card */}
        <div className="bg-base-100/70 border border-base-300 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-5">
            <ProfileAvatar
              src={currentUser?.profile_pic_url}
              alt={currentUser?.name || currentUser?.username}
              size={ComponentSizes.LG}
            />
            <div>
              <h1 className="text-2xl font-bold font-primary text-base-content">
                {currentUser?.name || currentUser?.username || t(AppLocales.User.Profile)}
              </h1>
              <p className="text-body-m text-base-content/70">
                {currentUser?.email}
              </p>
              {currentUser?.username && (
                <p className="text-body-s text-primary font-medium mt-0.5">
                  @{currentUser.username}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Avatar Upload Card */}
        <div className="bg-base-100/70 border border-base-300 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
          <h2 className="text-lg font-bold font-primary text-base-content">
            {t(AppLocales.User.ChangeAvatar)}
          </h2>
          <p className="text-body-s text-base-content/70">
            {t(AppLocales.User.AvatarHint)}
          </p>

          <div className="space-y-4">
            <FileInput
              accept="image/*"
              buttonText={selectedFile ? selectedFile.name : t(AppLocales.User.SelectImage)}
              onChange={(file) => setSelectedFile(file)}
            />

            {selectedFile && (
              <Button
                variant={ButtonVariants.PRIMARY}
                size={ComponentSizes.MD}
                disabled={isUploading}
                onClick={handleUploadClick}
              >
                {isUploading ? t(AppLocales.Common.Loading) : t(AppLocales.User.UploadAvatar)}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
