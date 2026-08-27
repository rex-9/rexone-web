import React from "react";
import { Link } from "react-router-dom";
import { useTranslate } from "../../../locales";
import { cn } from "../../utils";

export interface ITextLinkProps {
  label: string;
  to?: string;
  onClick?: () => void;
  className?: string;
}

export const TextLink: React.FC<ITextLinkProps> = ({
  label,
  to,
  onClick,
  className,
}) => {
  const t = useTranslate();

  const linkClasses = cn(
    "text-primary hover:underline hover:opacity-90 transition-opacity",
    "font-semibold cursor-pointer",
    className,
  );

  // If onClick is provided, render as button
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={linkClasses}>
        {t(label)}
      </button>
    );
  }

  // Otherwise render as Link (requires 'to' prop)
  return (
    <Link to={to || "#"} className={linkClasses}>
      {t(label)}
    </Link>
  );
};
