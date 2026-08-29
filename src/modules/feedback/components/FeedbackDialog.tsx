// src/modules/feedback/components/FeedbackDialog.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  FormContainer,
  RatingSlider,
  TextArea,
  Button,
} from "../../../design/components";
import { useToast } from "../../../contexts";
import FeedbackController from "../feedback.controller";
import { FEEDBACK_RATINGS } from "../constants";

export interface IFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackDialog: React.FC<IFeedbackDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(FEEDBACK_RATINGS.DEFAULT);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      error(t("feedback.error_empty", "Please enter your feedback."));
      return;
    }

    try {
      setSubmitting(true);
      await FeedbackController.submitFeedback({
        content,
        rating,
      });

      success(t("feedback.success", "Thank you for your feedback!"));
      setContent("");
      setRating(FEEDBACK_RATINGS.DEFAULT);
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : t(
              "feedback.error_submit",
              "Failed to submit feedback. Please try again.",
            );
      error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t("feedback.title", "Share Your Feedback")}
    >
      <FormContainer onSubmit={handleSubmit} className="p-0 bg-transparent gap-4">
        <RatingSlider
          value={rating}
          onChange={setRating}
          min={FEEDBACK_RATINGS.MIN}
          max={FEEDBACK_RATINGS.MAX}
          label={t("feedback.rating_label", "How was your experience?")}
          disabled={submitting}
        />

        <TextArea
          id="feedback-content"
          label={t("feedback.content_label", "What's on your mind?")}
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t(
            "feedback.placeholder",
            "Tell us anything — bugs, suggestions, questions, or ideas. We triage automatically!",
          )}
          disabled={submitting}
          autoExpand={false}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={onClose}
            disabled={submitting}
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={submitting}
            disabled={submitting || !content.trim()}
          >
            {t("feedback.submit", "Send Feedback")}
          </Button>
        </div>
      </FormContainer>
    </Dialog>
  );
};

export default FeedbackDialog;
