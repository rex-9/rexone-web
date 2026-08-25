import React from "react";
import { Button } from "../../../design/components/button";
import { iconsLib } from "../../../assets";

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
    <iconsLib.plus className="h-[18px] w-[18px]" />
    <span className="sr-only">{label}</span>
  </Button>
);
