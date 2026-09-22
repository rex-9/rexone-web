// src/modules/admin/notification/components/AdminNotificationPreview.tsx

import React, { useState } from "react";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import type { IAdminNotificationTemplate } from "../types";
import { NOTIFICATION_CHANNELS, type TNotificationChannel } from "../constants";
import { getTemplateConfiguredChannels } from "../helpers";

export interface IAdminNotificationPreviewProps {
  template?: IAdminNotificationTemplate | null;
  sendSocket: boolean;
  sendPush: boolean;
  sendEmail: boolean;
}

export const AdminNotificationPreview: React.FC<
  IAdminNotificationPreviewProps
> = ({ template, sendSocket, sendPush, sendEmail }) => {
  const t = useTranslate();
  const [activeChannel, setActiveChannel] = useState<TNotificationChannel>(
    NOTIFICATION_CHANNELS.IN_APP,
  );

  if (!template) {
    return (
      <div className="p-6 text-center text-caption text-base-content/50 text-xs">
        {t(AppLocales.Admin.Notifications.Preview.SelectTemplatePrompt)}
      </div>
    );
  }

  const configuredChannels = getTemplateConfiguredChannels(template);

  return (
    <div className="space-y-3">
      {/* Segmented Channel Switcher Tabs */}
      <div className="flex items-center justify-between gap-1 p-1 bg-base-200/80 rounded-xl border border-base-300/60">
        <button
          type="button"
          onClick={() => setActiveChannel(NOTIFICATION_CHANNELS.IN_APP)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            activeChannel === NOTIFICATION_CHANNELS.IN_APP
              ? "bg-base-100 text-base-content shadow-xs font-semibold"
              : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"
          }`}
        >
          <iconsLib.bell className="w-3.5 h-3.5 text-primary" />
          <span>{t(AppLocales.Admin.Notifications.Preview.InApp)}</span>
          {sendSocket && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-success"
              title={t(AppLocales.Admin.Notifications.Preview.ActiveInDispatch)}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveChannel(NOTIFICATION_CHANNELS.PUSH)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            activeChannel === NOTIFICATION_CHANNELS.PUSH
              ? "bg-base-100 text-base-content shadow-xs font-semibold"
              : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"
          }`}
        >
          <iconsLib.devicePhoneMobile className="w-3.5 h-3.5 text-warning" />
          <span>{t(AppLocales.Admin.Notifications.Preview.Push)}</span>
          {sendPush && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-warning"
              title={t(AppLocales.Admin.Notifications.Preview.ActiveInDispatch)}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveChannel(NOTIFICATION_CHANNELS.EMAIL)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            activeChannel === NOTIFICATION_CHANNELS.EMAIL
              ? "bg-base-100 text-base-content shadow-xs font-semibold"
              : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"
          }`}
        >
          <iconsLib.mail className="w-3.5 h-3.5 text-info" />
          <span>{t(AppLocales.Admin.Notifications.Preview.Email)}</span>
          {sendEmail && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-info"
              title={t(AppLocales.Admin.Notifications.Preview.ActiveInDispatch)}
            />
          )}
        </button>
      </div>

      {/* Visual Preview Content per Active Channel */}
      {activeChannel === NOTIFICATION_CHANNELS.IN_APP && (
        <div className="rounded-xl bg-base-100 border border-base-300 p-4 space-y-3 shadow-sm">
          {/* Header with Title and Close X */}
          <div className="flex items-start justify-between gap-2 border-b border-base-200/80 pb-2.5">
            <h4 className="font-bold text-xs sm:text-sm text-base-content leading-snug">
              {template.in_app_title || template.name}
            </h4>
            <div className="text-base-content/40 p-0.5 rounded cursor-default shrink-0">
              <iconsLib.close className="w-4 h-4" />
            </div>
          </div>

          {/* Body with whitespace-pre-wrap preserving multiline formatting and enter keys */}
          <div className="text-caption text-xs text-base-content/90 whitespace-pre-wrap leading-relaxed py-1">
            {template.in_app_body ||
              template.description ||
              t(AppLocales.Admin.Notifications.Preview.NoBodySpecified)}
          </div>

          {/* Footer with Timestamp and Action Buttons */}
          <div className="pt-2 border-t border-base-200/80 flex items-center justify-between gap-2">
            <span className="text-[11px] text-base-content/50 font-mono">
              {t(AppLocales.Admin.Notifications.Preview.JustNow)}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-xs btn-ghost text-base-content/60 pointer-events-none"
                tabIndex={-1}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-xs btn-primary font-semibold shadow-xs pointer-events-none"
                tabIndex={-1}
              >
                {template.cta_text || "Open link"}
              </button>
            </div>
          </div>

          {!configuredChannels.send_socket && (
            <div className="pt-1">
              <span className="text-[10px] text-warning font-medium">
                ⚠️ {t(AppLocales.Admin.Notifications.Preview.NotConfigured)}
              </span>
            </div>
          )}
        </div>
      )}

      {activeChannel === NOTIFICATION_CHANNELS.PUSH && (
        <div className="rounded-xl bg-base-200/50 border border-base-300/80 p-3.5 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 pb-0.5">
            <iconsLib.devicePhoneMobile className="w-3.5 h-3.5 text-warning" />
            <span className="text-[11px] font-semibold text-base-content/80">
              Mobile Push Banner
            </span>
          </div>

          <div className="rounded-xl bg-base-100 border border-base-300/80 p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-primary text-primary-content flex items-center justify-center text-[9px] font-black">
                  R
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase font-mono text-base-content/80">
                  RexOne
                </span>
              </div>
              <span className="text-[10px] text-base-content/50 font-mono">
                {t(AppLocales.Admin.Notifications.Preview.JustNow)}
              </span>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-xs text-base-content leading-snug">
                {template.push_title || template.in_app_title || template.name}
              </p>
              <div className="text-caption text-xs text-base-content/85 whitespace-pre-wrap leading-relaxed">
                {template.push_body ||
                  template.in_app_body ||
                  template.description ||
                  t(AppLocales.Admin.Notifications.Preview.NoBodySpecified)}
              </div>
            </div>

            <div className="pt-1.5 border-t border-base-200/80 flex items-center justify-between text-[10px] text-base-content/50">
              <span>{t(AppLocales.Admin.Notifications.Preview.TapToOpen)}</span>
              {template.push_template_id && (
                <span className="font-mono text-[9px] badge badge-ghost badge-xs">
                  {t(AppLocales.Admin.Notifications.Preview.OneSignalTemplate)}:{" "}
                  {template.push_template_id}
                </span>
              )}
            </div>
          </div>

          {!configuredChannels.send_push && (
            <div className="pt-0.5">
              <span className="text-[10px] text-warning font-medium">
                ⚠️ {t(AppLocales.Admin.Notifications.Preview.NotConfigured)}
              </span>
            </div>
          )}
        </div>
      )}

      {activeChannel === NOTIFICATION_CHANNELS.EMAIL && (
        <div className="rounded-xl bg-base-200/50 border border-base-300/80 p-3.5 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 pb-0.5">
            <iconsLib.mail className="w-3.5 h-3.5 text-info" />
            <span className="text-[11px] font-semibold text-base-content/80">
              Email Message Mockup
            </span>
          </div>

          <div className="rounded-xl bg-base-100 border border-base-300/80 overflow-hidden shadow-xs">
            {/* Window title dots */}
            <div className="bg-base-200/60 px-3 py-1.5 border-b border-base-300/60 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error/70 inline-block" />
                <span className="w-2 h-2 rounded-full bg-warning/70 inline-block" />
                <span className="w-2 h-2 rounded-full bg-success/70 inline-block" />
              </div>
              <span className="text-[10px] font-mono text-base-content/50 truncate max-w-50">
                {template.email_subject ||
                  template.in_app_title ||
                  template.name}
              </span>
              <div className="w-8" />
            </div>

            {/* Email Meta Bar */}
            <div className="p-2.5 border-b border-base-200 bg-base-100 space-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-base-content/50 w-10 font-medium">
                  {t(AppLocales.Admin.Notifications.Preview.EmailFrom)}:
                </span>
                <span className="text-xs font-semibold text-base-content">
                  RexOne{" "}
                  <span className="font-normal text-base-content/60">
                    &lt;support@rexone.rex9.me&gt;
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-base-content/50 w-10 font-medium">
                  {t(AppLocales.Admin.Notifications.Preview.EmailTo)}:
                </span>
                <span className="text-xs text-base-content/70 font-mono">
                  recipient@example.com
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-base-content/50 w-10 font-medium">
                  {t(AppLocales.Admin.Notifications.Preview.Subject)}:
                </span>
                <span className="text-xs font-semibold text-base-content">
                  {template.email_subject ||
                    template.in_app_title ||
                    template.name}
                </span>
              </div>
            </div>

            {/* Email Body Canvas */}
            <div className="p-3.5 space-y-2.5 bg-base-100">
              <div className="text-xs text-base-content/85 whitespace-pre-wrap leading-relaxed">
                {template.email_body ||
                  template.in_app_body ||
                  template.description ||
                  t(AppLocales.Admin.Notifications.Preview.NoBodySpecified)}
              </div>

              {(template.cta_text || template.link) && (
                <div className="pt-1.5 pb-0.5">
                  <div className="inline-block px-3 py-1 rounded-md bg-primary text-primary-content font-semibold text-xs shadow-xs text-center">
                    {template.cta_text || "Open in RexOne"}
                  </div>
                </div>
              )}

              {template.email_template_id && (
                <div className="pt-1">
                  <span className="font-mono text-[9px] badge badge-ghost badge-xs">
                    {t(AppLocales.Admin.Notifications.Preview.BrevoTemplate)}:{" "}
                    {template.email_template_id}
                  </span>
                </div>
              )}

              <div className="pt-2.5 border-t border-base-200 text-[10px] text-base-content/40 leading-normal">
                {t(AppLocales.Admin.Notifications.Preview.EmailFooter)}
              </div>
            </div>
          </div>

          {!configuredChannels.send_email && (
            <div className="pt-0.5">
              <span className="text-[10px] text-warning font-medium">
                ⚠️ {t(AppLocales.Admin.Notifications.Preview.NotConfigured)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
