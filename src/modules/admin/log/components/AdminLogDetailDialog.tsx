// src/modules/admin/log/components/AdminLogDetailDialog.tsx
import React from "react";
import { Dialog, Button, Badge } from "../../../../design/components";
import {
  BadgeVariants,
  ButtonTypes,
  ButtonVariants,
} from "../../../../design/constants";
import { formatAdminDate } from "../../../../helpers";
import { ADMIN_LOG_SEVERITY } from "../constants";
import type { IAdminLog } from "../types";

interface IAdminLogDetailDialogProps {
  isOpen: boolean;
  log: IAdminLog | null;
  onClose: () => void;
  onToggleResolve: (id: string, currentlyResolved: boolean) => Promise<void>;
  isLoading?: boolean;
}

export const AdminLogDetailDialog: React.FC<IAdminLogDetailDialogProps> = ({
  isOpen,
  log,
  onClose,
  onToggleResolve,
  isLoading = false,
}) => {
  if (!isOpen || !log) return null;

  const isResolved = !!log.resolved_at;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Client Error Telemetry Detail"
    >
      <div className="space-y-4">
        {/* Header Summary */}
        <div className="rounded-lg bg-base-200 p-3 space-y-2 text-caption">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  log.severity === ADMIN_LOG_SEVERITY.FATAL ||
                  log.severity === ADMIN_LOG_SEVERITY.ERROR
                    ? BadgeVariants.ERROR
                    : BadgeVariants.WARNING
                }
              >
                {log.severity.toUpperCase()}
              </Badge>
              {log.platform && (
                <Badge variant={BadgeVariants.SECONDARY}>
                  {log.platform.toUpperCase()}
                </Badge>
              )}
              <span className="font-semibold text-xs opacity-70">
                Occurrences: {log.occurrence_count}
              </span>
            </div>
            {isResolved ? (
              <Badge variant={BadgeVariants.SUCCESS}>Resolved</Badge>
            ) : (
              <Badge variant={BadgeVariants.WARNING}>Unresolved</Badge>
            )}
          </div>

          <div className="font-mono text-xs opacity-75 pt-1">
            <div>
              <span className="font-semibold">URL:</span> {log.method || "GET"}{" "}
              {log.url || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Client:</span>{" "}
              {[log.browser, log.os, log.device, log.app_version]
                .filter(Boolean)
                .join(" • ") || "N/A"}
            </div>
            <div>
              <span className="font-semibold">First Logged:</span>{" "}
              {formatAdminDate(log.created_at)}
            </div>
            {log.last_occurred_at && (
              <div>
                <span className="font-semibold">Last Logged:</span>{" "}
                {formatAdminDate(log.last_occurred_at)}
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="mb-1 block text-caption font-semibold text-base-content opacity-70">
            Error Message
          </label>
          <div className="rounded-lg border border-error/30 bg-error/5 p-3 text-body-m font-mono text-error font-medium">
            {log.message}
          </div>
        </div>

        {/* Stack Trace */}
        {log.stack_trace && log.stack_trace.length > 0 && (
          <div>
            <label className="mb-1 block text-caption font-semibold text-base-content opacity-70">
              Stack Trace
            </label>
            <div className="max-h-48 overflow-auto rounded-lg border border-base-300 bg-base-300 p-3 font-mono text-xs text-base-content whitespace-pre">
              {log.stack_trace.join("\n")}
            </div>
          </div>
        )}

        {/* Context Payload */}
        {log.context && Object.keys(log.context).length > 0 && (
          <div>
            <label className="mb-1 block text-caption font-semibold text-base-content opacity-70">
              Diagnostic Context
            </label>
            <pre className="max-h-36 overflow-auto rounded-lg border border-base-300 bg-base-200 p-3 font-mono text-xs text-base-content">
              {JSON.stringify(log.context, null, 2)}
            </pre>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 flex justify-between gap-3">
          <Button
            type={ButtonTypes.BUTTON}
            variant={
              isResolved ? ButtonVariants.SECONDARY : ButtonVariants.PRIMARY
            }
            onClick={() => onToggleResolve(log.id, isResolved)}
            isLoading={isLoading}
          >
            {isResolved ? "Mark as Unresolved" : "Mark as Resolved"}
          </Button>

          <Button
            type={ButtonTypes.BUTTON}
            variant={ButtonVariants.SECONDARY}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
