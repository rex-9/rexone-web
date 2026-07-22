import React, { useState } from "react";
import LayoutPage from "./LayoutPage";
import { Button } from "../";
import userController from "../../controllers/user.controller";
import { useToast } from "../../contexts/ToastContext";
import { userService } from "../../services";
import type { MailTemplate } from "../../services/user.service";

const ProfilePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deliveringMail, setDeliveringMail] = useState<MailTemplate | null>(
    null,
  );
  const { showToast } = useToast();

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

  const handleDeliverMail = async (type: MailTemplate) => {
    setDeliveringMail(type);

    try {
      const response = await userService.deliverMail(type);
      const status = response.data?.status;

      if (!status?.success) {
        showToast(
          "error",
          status?.error || response.error || "Failed to deliver email.",
        );
        return;
      }

      showToast(
        "success",
        status.message || "Email delivered successfully.",
      );
    } finally {
      setDeliveringMail(null);
    }
  };

  return (
    <LayoutPage>
      <main className="flex w-full max-w-2xl flex-1 flex-col gap-24 px-20 py-32">
        <section className="flex flex-col gap-12">
          <h1 className="text-heading-l font-semibold text-base-content">
            Profile
          </h1>
          <input type="file" onChange={handleFileChange} />
          <Button onClick={handleUploadClick} disabled={!selectedFile}>
            Upload
          </Button>
        </section>

        <section className="flex flex-col gap-12 rounded-m border border-base-300 bg-base-100 p-20">
          <div>
            <h2 className="text-heading-s font-semibold text-base-content">
              Email actions
            </h2>
            <p className="mt-4 text-body-s text-base-content/70">
              Manually send an account email to your current email address.
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            <Button
              type="button"
              variant="secondary"
              onClick={() => void handleDeliverMail("email_verification")}
              disabled={deliveringMail !== null}
            >
              {deliveringMail === "email_verification"
                ? "Sending verification..."
                : "Send verification email"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void handleDeliverMail("password_reset")}
              disabled={deliveringMail !== null}
            >
              {deliveringMail === "password_reset"
                ? "Sending reset email..."
                : "Send password reset email"}
            </Button>
          </div>
        </section>
      </main>
    </LayoutPage>
  );
};

export default ProfilePage;
