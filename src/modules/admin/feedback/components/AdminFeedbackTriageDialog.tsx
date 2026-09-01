import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextArea,
  Button,
  Badge,
  Dropdown,
  FormContainer,
} from "../../../../design/components";
import type { IAdminFeedback, IUpdateFeedbackPayload } from "../types";
import {
  ADMIN_FEEDBACK_PRIORITY,
  ADMIN_FEEDBACK_STATUS,
} from "../constants";

const statusOptions = [
  { value: ADMIN_FEEDBACK_STATUS.NEW, label: "New" },
  { value: ADMIN_FEEDBACK_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: ADMIN_FEEDBACK_STATUS.RESOLVED, label: "Resolved" },
  { value: ADMIN_FEEDBACK_STATUS.CLOSED, label: "Closed" },
];

const priorityOptions = [
  { value: ADMIN_FEEDBACK_PRIORITY.LOW, label: "Low" },
  { value: ADMIN_FEEDBACK_PRIORITY.MEDIUM, label: "Medium" },
  { value: ADMIN_FEEDBACK_PRIORITY.HIGH, label: "High" },
  { value: ADMIN_FEEDBACK_PRIORITY.URGENT, label: "Urgent" },
  { value: ADMIN_FEEDBACK_PRIORITY.CRITICAL, label: "Critical" },
];

interface IAdminFeedbackTriageDialogProps {
  isOpen: boolean;
  feedback: IAdminFeedback | null;
  onClose: () => void;
  onSubmit: (id: string, data: IUpdateFeedbackPayload) => Promise<void>;
  isLoading?: boolean;
}

export const AdminFeedbackTriageDialog: React.FC<
  IAdminFeedbackTriageDialogProps
> = ({ isOpen, feedback, onClose, onSubmit, isLoading = false }) => {
  const [status, setStatus] = useState<string>("new");
  const [priority, setPriority] = useState<string>("medium");
  const [adminNotes, setAdminNotes] = useState<string>("");

  useEffect(() => {
    if (feedback) {
      setStatus(feedback.status || "new");
      setPriority(feedback.priority || "medium");
      setAdminNotes(feedback.admin_notes || "");
    }
  }, [feedback]);

  if (!isOpen || !feedback) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(feedback.id, {
      status,
      priority,
      admin_notes: adminNotes,
    });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Feedback Details & Triage">
      <FormContainer onSubmit={handleSubmit} className="space-y-4">
        {/* User & Meta info */}
        <div className="rounded-lg bg-base-200 p-3 space-y-2 text-caption">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-base-content">
              {feedback.user_name || feedback.user_email || "Anonymous User"}
            </span>
            <span className="opacity-60 text-xs">
              {new Date(feedback.created_at).toLocaleString()}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="secondary">{feedback.category}</Badge>
            {feedback.platform && (
              <Badge variant="info">{feedback.platform}</Badge>
            )}
            {feedback.rating && (
              <span className="text-warning font-semibold">
                ⭐ {feedback.rating}/10
              </span>
            )}
          </div>

          {(feedback.device || feedback.browser || feedback.os) && (
            <div className="text-xs opacity-60 pt-1 font-mono">
              {[
                feedback.platform,
                feedback.os,
                feedback.browser,
                feedback.device,
              ]
                .filter(Boolean)
                .join(" • ")}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="mb-1 block text-caption font-semibold text-base-content opacity-70">
            User Message
          </label>
          <div className="rounded-lg border border-base-300 bg-base-100 p-3 text-body-m text-base-content whitespace-pre-wrap">
            {feedback.content}
          </div>
        </div>

        {/* Status & Priority Selection */}
        <div className="grid grid-cols-2 gap-3">
          <Dropdown
            label="Status"
            value={status}
            onValueChange={(val) => setStatus(val)}
            options={statusOptions}
            size="sm"
          />
          <Dropdown
            label="Priority"
            value={priority}
            onValueChange={(val) => setPriority(val)}
            options={priorityOptions}
            size="sm"
          />
        </div>

        {/* Admin Notes */}
        <div>
          <TextArea
            label="Internal Admin Notes"
            placeholder="Add internal resolution notes or steps taken..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Update Status
          </Button>
        </div>
      </FormContainer>
    </Dialog>
  );
};
