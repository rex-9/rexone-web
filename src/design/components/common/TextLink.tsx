import React from "react";
import { Link } from "react-router-dom";
import { useTranslate } from "../../../locales";
import { cn } from "../../helpers";

export interface ITextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: React.ReactNode;
  children?: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  className?: string;
  external?: boolean;
}

export const TextLink: React.FC<ITextLinkProps> = ({
  label,
  children,
  to,
  href,
  onClick,
  className,
  external,
  target,
  rel,
  ...rest
}) => {
  const t = useTranslate();

  const content = children ?? (typeof label === "string" ? t(label) : label);

  const linkClasses = cn(
    "text-primary hover:underline hover:opacity-90 transition-opacity",
    "font-semibold cursor-pointer",
    className,
  );

  // If onClick is provided and no to/href, render as button
  if (onClick && !to && !href) {
    return (
      <button type="button" onClick={onClick} className={linkClasses}>
        {content}
      </button>
    );
  }

  // If external or href provided, render as <a>
  if (href || external) {
    const isBlank = target === "_blank" || external;
    return (
      <a
        href={href || to || "#"}
        target={isBlank ? "_blank" : target}
        rel={isBlank ? "noopener noreferrer" : rel}
        onClick={onClick}
        className={linkClasses}
        {...rest}
      >
        {content}
      </a>
    );
  }

  // Otherwise render as React Router Link (requires 'to' prop)
  return (
    <Link to={to || "#"} className={linkClasses} onClick={onClick}>
      {content}
    </Link>
  );
};

export default TextLink;
