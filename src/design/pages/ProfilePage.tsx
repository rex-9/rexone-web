import React, { useState } from "react";
import { LayoutPage } from "./LayoutPage";
import { Button } from "../";
import userController from "../../controllers/user.controller";

export const ProfilePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await userController.uploadImage(selectedFile);
      // Optionally, handle the response or update the state
    } else {
      console.error("No file selected");
    }
  };

  return (
    <LayoutPage>
      <div>Profile</div>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUploadClick}>Upload</Button>
    </LayoutPage>
  );
};
