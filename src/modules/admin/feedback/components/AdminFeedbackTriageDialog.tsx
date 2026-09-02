// src/modules/admin/feedback/components/AdminFeedbackTriageDialog.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  TextArea,
  Button,
  StatusBadge,
  Dropdown,
  FormContainer,
} from "../../../../design/components";
import {
  BadgeVariants,
  ButtonTypes,
  ButtonVariants,
  DropdownSizes,
} from "../../../../design/constants";
import { formatAdminDate } from "../../../../helpers";
import type { IAdminFeedback, IUpdateFeedbackPayload } from "../types";
import {
  ADMIN_FEEDBACK_PRIORITY,
  ADMIN_FEEDBACK_STATUS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

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
  const t = useTranslate();
  const [status, setStatus] = useState<string>(ADMIN_FEEDBACK_STATUS.NEW);
  const [priority, setPriority] = useState<string>(ADMIN_FEEDBACK_PRIORITY.MEDIUM);
  const [adminNotes, setAdminNotes] = useState<string>("");

  const statusOptions = useMemo(
    () => [
      { value: ADMIN_FEEDBACK_STATUS.NEW, label: t(AppLocales.Admin.Feedback.Filters.Open) },
      { value: ADMIN_FEEDBACK_STATUS.IN_PROGRESS, label: t(AppLocales.Admin.Feedback.Filters.InReview) },
      { value: ADMIN_FEEDBACK_STATUS.RESOLVED, label: t(AppLocales.Admin.Feedback.Filters.Resolved) },
      { value: ADMIN_FEEDBACK_STATUS.CLOSED, label: t(AppLocales.Admin.Feedback.Filters.Closed) },
    ],
    [t],
  );

  const priorityOptions = useMemo(
    () => [
      { value: ADMIN_FEEDBACK_PRIORITY.LOW, label: t(AppLocales.Admin.Feedback.Filters.Low) },
      { value: ADMIN_FEEDBACK_PRIORITY.MEDIUM, label: t(AppLocales.Admin.Feedback.Filters.Normal) },
      { value: ADMIN_FEEDBACK_PRIORITY.HIGH, label: t(AppLocales.Admin.Feedback.Filters.High) },
      { value: ADMIN_FEEDBACK_PRIORITY.URGENT, label: t(AppLocales.Admin.Feedback.Filters.Urgent) },
      { value: ADMIN_FEEDBACK_PRIORITY.CRITICAL, label: t(AppLocales.Admin.Feedback.Filters.Urgent) },
    ],
    [t],
  );

  useEffect(() => {
    if (feedback) {
      setStatus(feedback.status || ADMIN_FEEDBACK_STATUS.NEW);
      setPriority(feedback.priority || ADMIN_FEEDBACK_PRIORITY.MEDIUM);
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
    <Dialog isOpen={isOpen} onClose={onClose} title={t(AppLocales.Admin.Feedback.Drawer.Title)}>
      <FormContainer onSubmit={handleSubmit} className="space-y-4">
        {/* User & Meta info */}
        <div className="rounded-lg bg-base-200 p-3 space-y-2 text-caption">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-base-content">
              {feedback.user_name || feedback.user_email || "Anonymous User"}
            </span>
            <span className="opacity-60 text-xs">
              {formatAdminDate(feedback.created_at)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <StatusBadge
              status={feedback.category}
              variant={BadgeVariants.SECONDARY}
            />
            {feedback.platform && (
              <StatusBadge
                status={feedback.platform}
                variant={BadgeVariants.INFO}
              />
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
            {t(AppLocales.Admin.Feedback.Table.Content)}
          </label>
          <div className="rounded-lg border border-base-300 bg-base-100 p-3 text-body-m text-base-content whitespace-pre-wrap">
            {feedback.content}
          </div>
        </div>

        {/* Status & Priority Selection */}
        <div className="grid grid-cols-2 gap-3">
          <Dropdown
            label={t(AppLocales.Admin.Feedback.Table.Status)}
            value={status}
            onValueChange={(val) => setStatus(val)}
            options={statusOptions}
            size={DropdownSizes.SM}
          />
          <Dropdown
            label={t(AppLocales.Admin.Feedback.Table.Priority)}
            value={priority}
            onValueChange={(val) => setPriority(val)}
            options={priorityOptions}
            size={DropdownSizes.SM}
          />
        </div>

        {/* Admin Notes */}
        <div>
          <TextArea
            label="Admin Notes"
            placeholder="Enter internal moderation notes..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type={ButtonTypes.BUTTON}
            variant={ButtonVariants.SECONDARY}
            onClick={onClose}
            disabled={isLoading}
          >
            {t(AppLocales.Admin.Common.Actions.Cancel)}
          </Button>
          <Button
            type={ButtonTypes.SUBMIT}
            variant={ButtonVariants.PRIMARY}
            isLoading={isLoading}
          >
            {t(AppLocales.Admin.Feedback.Drawer.UpdateStatus)}
          </Button>
        </div>
      </FormContainer>
    </Dialog>
  );
};

