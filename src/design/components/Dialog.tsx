/**
 * Meritbox Design System - Dialog Molecule
 *
 * For adding a new merit or editing one
 * Rounded 20-24px, dimmed background with slight vignette
 */

import React, { Fragment, useEffect } from "react";
import {
  Dialog as HeadlessDialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { clsx } from "ts-clsx";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onBack,
  title,
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-navy-900 bg-opacity-40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-16">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className={clsx(
                  "relative z-10 bg-base-100 rounded-lg p-24 shadow-m",
                  "w-full max-w-[448px]",
                  "max-h-[90vh] overflow-y-auto",
                  className,
                )}
              >
                <div className="flex items-center justify-between mb-8">
                  {/* Back Button (left side) */}
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="p-8 rounded-m hover:bg-base-200 transition-colors"
                    >
                      <svg
                        className="w-20 h-20 text-base-content"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Title (center, optional) */}
                  {title && (
                    <HeadlessDialog.Title className="text-h3 font-display font-semibold text-base-content flex-1 text-center">
                      {title}
                    </HeadlessDialog.Title>
                  )}

                  {/* Spacer to push close button to the right when there's no back button */}
                  {!onBack && !title && <div className="flex-1" />}

                  {/* Close Button (always on right side) */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-8 rounded-m hover:bg-base-200 transition-colors ml-auto"
                  >
                    <svg
                      className="w-20 h-20 text-base-content"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div>{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="flex justify-end gap-12 pt-16 border-t border-base-300">
                    {footer}
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
};

export default Dialog;
