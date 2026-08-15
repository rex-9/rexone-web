import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  Admin,
  IAdminChatRoom,
  IAdminChatRoomFormValues,
} from "../../../../modules/admin";
import {
  AdminFormAlert,
  AdminFormShell,
  AdminLayout,
  AdminLoadingState,
  AdminState,
  FormActionRow,
  TextInput,
} from "../../../components";

export const AdminChatRoomEditPage: React.FC = () => {
  useDocumentTitle("Edit Chat Room");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [room, setRoom] = useState<IAdminChatRoom | null>(null);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const timeoutId = window.setTimeout(() => {
      void Admin.ChatController.getRoom(
        id,
        (nextRoom) => {
          setRoom(nextRoom);
          setTitle(nextRoom.title || "");
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

    const values: IAdminChatRoomFormValues = {
      title: title.trim(),
    };

    setIsSubmitting(true);
    setError("");

    await Admin.ChatController.updateRoom(
      id,
      values,
      () => {
        toast.success("Chat room updated");
        navigate(AppRoutes.client.protected.ADMIN_CHAT_ROOMS);
      },
      (message) => {
        setError(message);
        setIsSubmitting(false);
      },
    );
  };

  return (
    <AdminLayout title="Edit Chat Room">
      {isLoading ? (
        <AdminLoadingState />
      ) : !id ? (
        <AdminState title="Unable to load chat room" message="Missing room id." />
      ) : error && !room ? (
        <AdminState title="Unable to load chat room" message={error} />
      ) : (
        <>
          {error && (
            <div className="mb-16">
              <AdminFormAlert message={error} />
            </div>
          )}
          <AdminFormShell>
            <form onSubmit={handleSubmit}>
              <TextInput
                label="Title"
                value={title}
                required
                onChange={(event) => setTitle(event.target.value)}
              />
              <FormActionRow
                submitLabel="Save changes"
                isSubmitting={isSubmitting}
                onCancel={() =>
                  navigate(AppRoutes.client.protected.ADMIN_CHAT_ROOMS)
                }
              />
            </form>
          </AdminFormShell>
        </>
      )}
    </AdminLayout>
  );
};
