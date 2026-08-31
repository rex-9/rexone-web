import React, { useState } from "react";
import { Button } from "../";
import UserController from "../../modules/user/user.controller";
import { useAuth } from "../../contexts";

export const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
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
      }
    } else {
      console.error("No file selected");
    }
  };

  return (
    <div>
      <div>Profile</div>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUploadClick}>Upload</Button>
    </div>
  );
};

export default ProfilePage;
