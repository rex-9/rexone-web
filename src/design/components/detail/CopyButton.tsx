// src/design/components/detail/CopyButton.tsx
import React, { useState } from "react";
import { iconsLib } from "../../../assets";
import { cn } from "../../helpers";

export interface ICopyButtonProps {
  text: string;
  className?: string;
  iconClassName?: string;
  title?: string;
  copiedTitle?: string;
}

export const CopyButton: React.FC<ICopyButtonProps> = ({
  text,
  className,
  iconClassName,
  title = "Copy to clipboard",
  copiedTitle = "Copied!",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older environments
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? copiedTitle : title}
      aria-label={copied ? copiedTitle : title}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md text-base-content/40 transition-all duration-200 hover:bg-base-300 hover:text-base-content active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        copied && "text-success hover:text-success",
        className,
      )}
    >
      {copied ? (
        <iconsLib.checkr className={cn("h-3.5 w-3.5 stroke-[2.5]", iconClassName)} />
      ) : (
        <iconsLib.copy className={cn("h-3.5 w-3.5", iconClassName)} />
      )}
    </button>
  );
};
