import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import ChatController from "../chat.controller";
import {
  IAdminChatRoom,
  IAdminChatRoomFormValues,
} from "../types";
import {
  AdminFormAlert,
  AdminLoadingState,
  AdminState,
  FormActionRow,
  TextInput,
} from "../../components";

export const AdminChatRoomEditPage: React.FC = () => {
  useDocumentTitle("Edit Chat Room");

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading, setLoading } = useLoading();
  const [room, setRoom] = useState<IAdminChatRoom | null>(null);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      void ChatController.getRoom(
        id,
        (nextRoom) => {
          setRoom(nextRoom);
          setTitle(nextRoom.title || "");
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

    const values: IAdminChatRoomFormValues = {
      title: title.trim(),
    };

    setIsSubmitting(true);
    setError("");

    await ChatController.updateRoom(
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
    <>
      {!id ? (
        <AdminState title="Unable to load chat room" message="Missing room id." />
      ) : isLoading ? (
        <AdminLoadingState />
      ) : error && !room ? (
        <AdminState title="Unable to load chat room" message={error} />
      ) : (
        <>
          {error && (
            <div className="mb-16">
              <AdminFormAlert message={error} />
            </div>
          )}
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
        </>
      )}
    </>
  );
};
