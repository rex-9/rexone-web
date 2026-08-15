import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  Admin,
  IAdminChatMessage,
  IAdminChatMessageFormValues,
} from "../../../../modules/admin";
import {
  AdminFormAlert,
  AdminFormShell,
  AdminLayout,
  AdminLoadingState,
  AdminState,
  FormActionRow,
  TextArea,
} from "../../../components";

const messageRoles = ["user", "assistant"];

export const AdminChatMessageEditPage: React.FC = () => {
  useDocumentTitle("Edit Chat Message");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [message, setMessage] = useState<IAdminChatMessage | null>(null);
  const [role, setRole] = useState("user");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const timeoutId = window.setTimeout(() => {
      void Admin.ChatController.getMessage(
        id,
        (nextMessage) => {
          setMessage(nextMessage);
          setRole(nextMessage.role || "user");
          setContent(nextMessage.content || "");
          setIsLoading(false);
        },
        (message) => {
          setError(message);
          setIsLoading(false);
        },
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    const values: IAdminChatMessageFormValues = {
      role,
      content: content.trim(),
    };

    setIsSubmitting(true);
    setError("");

    await Admin.ChatController.updateMessage(
      id,
      values,
      () => {
        toast.success("Chat message updated");
        navigate(AppRoutes.client.protected.ADMIN_CHAT_MESSAGES);
      },
      (message) => {
        setError(message);
        setIsSubmitting(false);
      },
    );
  };

  return (
    <AdminLayout title="Edit Chat Message">
      {isLoading ? (
        <AdminLoadingState />
      ) : !id ? (
        <AdminState
          title="Unable to load chat message"
          message="Missing message id."
        />
      ) : error && !message ? (
        <AdminState title="Unable to load chat message" message={error} />
      ) : (
        <>
          {error && (
            <div className="mb-16">
              <AdminFormAlert message={error} />
            </div>
          )}
          <AdminFormShell>
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
                isSubmitting={isSubmitting}
                onCancel={() =>
                  navigate(AppRoutes.client.protected.ADMIN_CHAT_MESSAGES)
                }
              />
            </form>
          </AdminFormShell>
        </>
      )}
    </AdminLayout>
  );
};
