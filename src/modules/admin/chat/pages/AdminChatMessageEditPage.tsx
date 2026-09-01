import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import ChatController from "../chat.controller";
import {
  IAdminChatMessage,
  IAdminChatMessageFormValues,
} from "../types";
import {
  AlertDialog,
  AdminState,
  Dropdown,
  FormActionRow,
  FormContainer,
  TextArea,
} from "../../components";
import { ADMIN_CHAT_PAGE_TITLES } from "../constants";
import { ADMIN_COMMON_LABELS } from "../../constants";

const messageRoleOptions = [
  { value: "user", label: "User" },
  { value: "assistant", label: "Assistant" },
];

export const AdminChatMessageEditPage: React.FC = () => {
  useDocumentTitle(ADMIN_CHAT_PAGE_TITLES.MESSAGE_EDIT);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();
  const [message, setMessage] = useState<IAdminChatMessage | null>(null);
  const [role, setRole] = useState("user");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      void ChatController.getMessage(
        id,
        (nextMessage) => {
          setMessage(nextMessage);
          setRole(nextMessage.role || "user");
          setContent(nextMessage.content || "");
          setLoading(false);
        },
        (message) => {
          setError(message);
          setLoading(false);
        },
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id, setLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const values: IAdminChatMessageFormValues = {
      role,
      content: content.trim(),
    };

    setLoading(true, { overlay: false });

    await ChatController.updateMessage(
      id,
      values,
      () => {
        setLoading(false, { overlay: false });
        toast.success("Chat message updated");
        navigate(AppRoutes.client.protected.admin.CHAT_MESSAGES);
      },
      (message) => {
        setAlertMessage(message);
        setLoading(false, { overlay: false });
      },
    );
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
      {error && !message ? (
        <AdminState title="Unable to load chat message" message={error} />
      ) : message? (
        <FormContainer onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <Dropdown
                label="Role"
                value={role}
                onValueChange={(val) => setRole(val)}
                options={messageRoleOptions}
              />
              <TextArea
                label="Message"
                value={content}
                required
                rows={6}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
            <FormActionRow
              cancelLabel={ADMIN_COMMON_LABELS.CANCEL}
              submitLabel="Save changes"
              onCancel={() =>
                navigate(AppRoutes.client.protected.admin.CHAT_MESSAGES)
              }
            />
          </FormContainer>
      ):null}
    </>
  );
};
