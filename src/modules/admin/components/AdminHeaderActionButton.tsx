import React from "react";
import { Button } from "../../../design/components/button";
import { ButtonSizes, ButtonVariants } from "../../../design/constants";
import { iconsLib } from "../../../assets";
import { ADMIN_ACTIONS } from "../constants";
import type { AdminResource } from "../roles";
import { AdminActionButton } from "./AdminActionButton";

interface IAdminHeaderActionButtonProps {
  label: string;
  onClick: () => void;
  recycle?: {
    label: string;
    onClick: () => void;
    resource: AdminResource;
  };
}

export const AdminHeaderActionButton: React.FC<
  IAdminHeaderActionButtonProps
> = ({ label, onClick, recycle }) => (
  <div className="flex shrink-0 items-center gap-2 self-start md:self-auto">
    {recycle && (
      <AdminActionButton
        action={ADMIN_ACTIONS.READ}
        resource={recycle.resource}
        size={ButtonSizes.SM}
        variant={ButtonVariants.SECONDARY}
        className="h-10 w-10 p-0"
        aria-label={recycle.label}
        title={recycle.label}
        onClick={recycle.onClick}
      >
        <iconsLib.archiveBox className="h-5 w-5" />
      </AdminActionButton>
    )}

    <Button
      type="button"
      onClick={onClick}
      className="h-10 w-10 p-0"
      aria-label={label}
      title={label}
    >
      <iconsLib.plus className="h-5 w-5" />
      <span className="sr-only">{label}</span>
    </Button>
  </div>
);
