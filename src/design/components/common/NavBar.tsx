import React, { useState } from "react";
import { HeadNavbar } from "./HeadNavbar";
import { Button } from "../button";
import { FeedbackDialog } from "../../../modules/feedback";
import { iconsLib } from "../../../assets";

const FeedbackIcon = iconsLib.feedback;

export const NavBar: React.FC = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <HeadNavbar
        actions={
        <Button
          type="button"
          variant="tertiary"
          onClick={() => setFeedbackOpen(true)}
          className="hidden h-[40px] w-[40px] p-0 md:inline-flex"
          title="Send Feedback"
          aria-label="Send Feedback"
        >
          <FeedbackIcon className="h-[20px] w-[20px]" />
        </Button>
        }
      />
      <FeedbackDialog
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
};

export default NavBar;
