import React, { useState } from "react";
import ProfileAvatar from "./ProfileAvatar";
import { LanguageDropdown, ThemeToggle, Button } from "..";
import { ButtonVariants, ComponentSizes, ButtonTypes } from "../../constants";
import { FeedbackDialog } from "../../../modules/feedback";
import { iconsLib } from "../../../assets";

const FeedbackIcon = iconsLib.feedback;

export const NavBar: React.FC = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <nav className="flex gap-2 justify-between items-center w-full p-2">
      <div>
        <ProfileAvatar className="ml-auto" />
      </div>
      <div className="flex gap-2 items-center px-2">
        <Button
          type={ButtonTypes.BUTTON}
          variant={ButtonVariants.TERTIARY}
          size={ComponentSizes.SM}
          onClick={() => setFeedbackOpen(true)}
          className="p-2 rounded-full text-base-content/70 hover:text-base-content"
          title="Send Feedback"
          aria-label="Send Feedback"
        >
          <FeedbackIcon className="w-5 h-5" />
        </Button>
        <ThemeToggle />
        <LanguageDropdown />
      </div>
      <FeedbackDialog
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </nav>
  );
};

export default NavBar;
