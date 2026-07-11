import React from "react";
import { Link } from "react-router-dom";
import { clsx } from "ts-clsx";
import { useTranslation } from "react-i18next";

export interface TextLinkProps {
  label: string;
  to?: string;
  onClick?: () => void;
  className?: string;
}

export const TextLink: React.FC<TextLinkProps> = ({
  label,
  to,
  onClick,
  className,
}) => {
  const { t } = useTranslation();

  const linkClasses = clsx(
    "text-primary hover:text-primary-focus hover:underline transition-colors",
    "font-semibold",
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

export default TextLink;
