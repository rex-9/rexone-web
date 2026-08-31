import React, { useState } from "react";
import { Button, HeadNavbar } from "..";
import { ButtonVariants, ComponentSizes, ButtonTypes } from "../../constants";
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
            type={ButtonTypes.BUTTON}
            variant={ButtonVariants.TERTIARY}
            size={ComponentSizes.SM}
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
