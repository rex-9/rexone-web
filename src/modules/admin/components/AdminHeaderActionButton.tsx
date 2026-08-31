import React from "react";
import { Button } from "../../../design/components/button";
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
  <div className="flex shrink-0 items-center gap-10 self-start md:self-auto">
    
    {recycle && (
      <AdminActionButton
        action={ADMIN_ACTIONS.READ}
        resource={recycle.resource}
        size="sm"
        variant="secondary"
        className="h-[40px] w-[40px] p-0"
        aria-label={recycle.label}
        title={recycle.label}
        onClick={recycle.onClick}
      >
        <iconsLib.archiveBox className="h-[18px] w-[18px]" />
      </AdminActionButton>
    )}

    <Button
      type="button"
      onClick={onClick}
      className="h-[40px] w-[40px] p-0"
      aria-label={label}
      title={label}
    >
      <iconsLib.plus className="h-[18px] w-[18px]" />
      <span className="sr-only">{label}</span>
    </Button>
  </div>
);
