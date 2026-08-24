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
  AdminLoadingState,
  AdminState,
  FormActionRow,
  TextArea,
} from "../../components";
import { ADMIN_PAGE_TITLES } from "../../constants";

const messageRoles = ["user", "assistant"];

export const AdminChatMessageEditPage: React.FC = () => {
  useDocumentTitle(ADMIN_PAGE_TITLES.CHAT_MESSAGE_EDIT);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOverlayLoading, setLoading } = useLoading();
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
        navigate(AppRoutes.client.protected.ADMIN_CHAT_MESSAGES);
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
      {!id ? (
        <AdminState
          title="Unable to load chat message"
          message="Missing message id."
        />
      ) : isOverlayLoading ? (
        <AdminLoadingState />
      ) : error && !message ? (
        <AdminState title="Unable to load chat message" message={error} />
      ) : (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-16">
              <label className="flex flex-col gap-4">
                <span className="text-body-s font-medium text-base-content">
                  Role
                </span>
                <select
                  className="rounded-m border-2 border-base-300 bg-base-100 px-16 py-12 text-body-m text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                >
                  {messageRoles.map((nextRole) => (
                    <option key={nextRole} value={nextRole}>
                      {nextRole}
                    </option>
                  ))}
                </select>
              </label>
              <TextArea
                label="Message"
                value={content}
                required
                rows={6}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
            <FormActionRow
              submitLabel="Save changes"
              onCancel={() =>
                navigate(AppRoutes.client.protected.ADMIN_CHAT_MESSAGES)
              }
            />
          </form>
      )}
    </>
  );
};
