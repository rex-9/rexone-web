import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../design/components/button";

interface IAdminHeaderActionButtonProps {
  label: string;
  onClick: () => void;
}

export const AdminHeaderActionButton: React.FC<
  IAdminHeaderActionButtonProps
> = ({ label, onClick }) => (
  <Button
    type="button"
    onClick={onClick}
    className="h-[40px] w-[40px] p-0 self-start md:self-auto"
    aria-label={label}
    title={label}
  >
    <PlusIcon className="h-[18px] w-[18px]" />
    <span className="sr-only">{label}</span>
  </Button>
);
