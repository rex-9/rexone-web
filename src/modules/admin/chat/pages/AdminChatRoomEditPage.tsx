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
  AlertDialog,
  AdminLoadingState,
  AdminState,
  FormActionRow,
  TextInput,
} from "../../components";
import { ADMIN_PAGE_TITLES } from "../../constants";

export const AdminChatRoomEditPage: React.FC = () => {
  useDocumentTitle(ADMIN_PAGE_TITLES.CHAT_ROOM_EDIT);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOverlayLoading, setLoading } = useLoading();
  const [room, setRoom] = useState<IAdminChatRoom | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

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

    setLoading(true, { overlay: false });

    await ChatController.updateRoom(
      id,
      values,
      () => {
        setLoading(false, { overlay: false });
        toast.success("Chat room updated");
        navigate(AppRoutes.client.protected.ADMIN_CHAT_ROOMS);
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
        <AdminState title="Unable to load chat room" message="Missing room id." />
      ) : isOverlayLoading ? (
        <AdminLoadingState />
      ) : error && !room ? (
        <AdminState title="Unable to load chat room" message={error} />
      ) : (
        <form onSubmit={handleSubmit}>
            <TextInput
              label="Title"
              value={title}
              required
              onChange={(event) => setTitle(event.target.value)}
            />
            <FormActionRow
              submitLabel="Save changes"
              onCancel={() =>
                navigate(AppRoutes.client.protected.ADMIN_CHAT_ROOMS)
              }
            />
          </form>
      )}
    </>
  );
};
