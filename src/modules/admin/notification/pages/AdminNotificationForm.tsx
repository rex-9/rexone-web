// src/modules/admin/notification/pages/AdminNotificationForm.tsx

import React, { useMemo, useState } from "react";
import { iconsLib } from "../../../../assets";
import { useTranslate, AppLocales } from "../../../../locales";
import type {
  IAdminNotificationTemplate,
  IAdminNotificationTemplateFormValues,
} from "../types";
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_CHANNELS,
  DEFAULT_NOTIFICATION_CLIENTS,
  NOTIFICATION_CLIENTS,
  NOTIFICATION_TEMPLATE_LINKS,
  type TNotificationChannel,
} from "../constants";
import {
  AlertDialog,
  Checkbox,
  Dropdown,
  FormActionRow,
  FormContainer,
  TextArea,
  TextInput,
} from "../../components";
import { Button } from "../../../../design";
import { ButtonVariants } from "../../../../design/constants";
import { ADMIN_ACTIONS } from "../../constants";

export interface IAdminNotificationFormProps {
  mode: typeof ADMIN_ACTIONS.CREATE | typeof ADMIN_ACTIONS.EDIT;
  template?: IAdminNotificationTemplate;
  onSubmit: (values: IAdminNotificationTemplateFormValues) => Promise<void>;
  onCancel: () => void;
}

const emptyForm: IAdminNotificationTemplateFormValues = {
  event: "",
  name: "",
  description: "",
  category: NOTIFICATION_CATEGORIES.MARKETING,
  link: "",
  clients: [...DEFAULT_NOTIFICATION_CLIENTS],
  admin: true,
  in_app_title: "",
  in_app_body: "",
  in_app_data: {},
  push_title: "",
  push_body: "",
  push_template_id: "",
  email_subject: "",
  email_body: "",
  email_template_id: "",
};

export const AdminNotificationForm: React.FC<IAdminNotificationFormProps> = ({
  mode,
  template,
  onSubmit,
  onCancel,
}) => {
  const t = useTranslate();
  const isCreate = mode === ADMIN_ACTIONS.CREATE;

  const [formValues, setFormValues] =
    useState<IAdminNotificationTemplateFormValues>(() => {
      if (template) {
        return {
          event: template.event || "",
          name: template.name || "",
          description: template.description || "",
          category: template.category || NOTIFICATION_CATEGORIES.MARKETING,
          link: template.link || "",
          clients: template.clients || [...DEFAULT_NOTIFICATION_CLIENTS],
          admin: template.admin ?? true,
          in_app_title: template.in_app_title || "",
          in_app_body: template.in_app_body || "",
          in_app_data: template.in_app_data || {},
          push_title: template.push_title || "",
          push_body: template.push_body || "",
          push_template_id: template.push_template_id || "",
          email_subject: template.email_subject || "",
          email_body: template.email_body || "",
          email_template_id: template.email_template_id || "",
        };
      }
      return emptyForm;
    });

  const [activeChannelTab, setActiveChannelTab] =
    useState<TNotificationChannel>(NOTIFICATION_CHANNELS.IN_APP);
  const [linkSelection, setLinkSelection] = useState(() => {
    const link = template?.link || "";
    return link.startsWith("https://")
      ? NOTIFICATION_TEMPLATE_LINKS.EXTERNAL
      : link;
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const handleCopyVariable = async (variableName: string) => {
    try {
      await navigator.clipboard.writeText(variableName);
      setCopiedVar(variableName);
      setTimeout(() => setCopiedVar(null), 1800);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = variableName;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedVar(variableName);
      setTimeout(() => setCopiedVar(null), 1800);
    }
  };

  const categoryOptions = useMemo(
    () => [
      { value: NOTIFICATION_CATEGORIES.MARKETING, label: "Marketing" },
      { value: NOTIFICATION_CATEGORIES.BROADCAST, label: "Broadcast" },
      { value: NOTIFICATION_CATEGORIES.SYSTEM, label: "System" },
    ],
    [],
  );

  const linkOptions = useMemo(
    () => [
      {
        value: NOTIFICATION_TEMPLATE_LINKS.NONE,
        label: t(
          AppLocales.Admin.Notifications.Templates.Dialog.LinkOptions.None,
        ),
      },
      {
        value: NOTIFICATION_TEMPLATE_LINKS.EXTERNAL,
        label: t(
          AppLocales.Admin.Notifications.Templates.Dialog.LinkOptions.External,
        ),
      },
      {
        value: NOTIFICATION_TEMPLATE_LINKS.HOME,
        label: t(
          AppLocales.Admin.Notifications.Templates.Dialog.LinkOptions.Home,
        ),
      },
      {
        value: NOTIFICATION_TEMPLATE_LINKS.PROFILE,
        label: t(
          AppLocales.Admin.Notifications.Templates.Dialog.LinkOptions.Profile,
        ),
      },
      {
        value: NOTIFICATION_TEMPLATE_LINKS.PAYMENT,
        label: t(
          AppLocales.Admin.Notifications.Templates.Dialog.LinkOptions.Payment,
        ),
      },
      {
        value: NOTIFICATION_TEMPLATE_LINKS.AI,
        label: t(
          AppLocales.Admin.Notifications.Templates.Dialog.LinkOptions.Ai,
        ),
      },
    ],
    [t],
  );

  const handleChange = <K extends keyof IAdminNotificationTemplateFormValues>(
    field: K,
    value: IAdminNotificationTemplateFormValues[K],
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCreate) {
      if (!formValues.event.trim()) {
        setAlertMessage(
          t(AppLocales.Admin.Notifications.Templates.Dialog.EventRequired),
        );
        return;
      }

      if (!/^[a-z][a-z0-9_]*$/.test(formValues.event.trim())) {
        setAlertMessage(
          t(AppLocales.Admin.Notifications.Templates.Dialog.EventInvalid),
        );
        return;
      }
    }

    if (!formValues.name.trim()) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Templates.Dialog.NameRequired),
      );
      return;
    }

    if (formValues.clients.length === 0) {
      setAlertMessage(
        t(AppLocales.Admin.Notifications.Templates.Dialog.ClientRequired),
      );
      return;
    }

    await onSubmit(formValues);
  };

  return (
    <>
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <FormContainer onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Template General Information */}
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-base-200 pb-3">
            <iconsLib.document className="h-5 w-5 text-primary" />
            <h3 className="text-body-m font-bold text-base-content">
              {t(AppLocales.Admin.Notifications.Templates.Dialog.GeneralInfo)}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label={t(
                AppLocales.Admin.Notifications.Templates.Dialog.EventLabel,
              )}
              placeholder={t(
                AppLocales.Admin.Notifications.Templates.Dialog
                  .EventPlaceholder,
              )}
              tooltip={t(
                AppLocales.Admin.Notifications.Templates.Dialog.EventTooltip,
              )}
              value={formValues.event}
              onChange={(e) => {
                if (!isCreate) return;
                const sanitized = e.target.value
                  .toLowerCase()
                  .replace(/[\s-]+/g, "_")
                  .replace(/[^a-z0-9_]/g, "");
                handleChange("event", sanitized);
              }}
              disabled={!isCreate}
              required={isCreate}
            />

            <TextInput
              label={t(
                AppLocales.Admin.Notifications.Templates.Dialog.NameLabel,
              )}
              placeholder={t(
                AppLocales.Admin.Notifications.Templates.Dialog.NamePlaceholder,
              )}
              tooltip={t(
                AppLocales.Admin.Notifications.Templates.Dialog.NameTooltip,
              )}
              value={formValues.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Dropdown
              label={t(
                AppLocales.Admin.Notifications.Templates.Dialog.CategoryLabel,
              )}
              tooltip={t(
                AppLocales.Admin.Notifications.Templates.Dialog.CategoryTooltip,
              )}
              options={categoryOptions}
              value={formValues.category}
              onValueChange={(val) => handleChange("category", val)}
            />

            <Dropdown
              label={t(
                AppLocales.Admin.Notifications.Templates.Dialog.LinkLabel,
              )}
              tooltip={t(
                AppLocales.Admin.Notifications.Templates.Dialog.LinkTooltip,
              )}
              options={linkOptions}
              value={linkSelection}
              onValueChange={(value) => {
                setLinkSelection(value);
                handleChange(
                  "link",
                  value === NOTIFICATION_TEMPLATE_LINKS.EXTERNAL ? "" : value,
                );
              }}
            />
          </div>

          {linkSelection === NOTIFICATION_TEMPLATE_LINKS.EXTERNAL && (
            <TextInput
              type="url"
              label={t(
                AppLocales.Admin.Notifications.Templates.Dialog
                  .ExternalUrlLabel,
              )}
              placeholder={t(
                AppLocales.Admin.Notifications.Templates.Dialog
                  .ExternalUrlPlaceholder,
              )}
              tooltip={t(
                AppLocales.Admin.Notifications.Templates.Dialog
                  .ExternalUrlTooltip,
              )}
              value={formValues.link || ""}
              onChange={(event) => handleChange("link", event.target.value)}
              pattern="https://.*"
              required
            />
          )}

          <TextArea
            label={t(AppLocales.Admin.Notifications.Templates.Dialog.DescLabel)}
            placeholder={t(
              AppLocales.Admin.Notifications.Templates.Dialog.DescPlaceholder,
            )}
            tooltip={t(
              AppLocales.Admin.Notifications.Templates.Dialog.DescTooltip,
            )}
            value={formValues.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
          />

          <div className="rounded-lg border border-base-200 bg-base-200/20 p-3 space-y-1">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formValues.admin}
                onChange={(e) => handleChange("admin", e.target.checked)}
              >
                {t(AppLocales.Admin.Notifications.Templates.Dialog.AdminOnly)}
              </Checkbox>
              <div
                className="tooltip tooltip-right flex items-center text-base-content/50 hover:text-base-content transition-colors cursor-help"
                data-tip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .AdminOnlyTooltip,
                )}
              >
                <iconsLib.info className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-caption text-xs text-base-content/60 pl-8">
              {t(
                AppLocales.Admin.Notifications.Templates.Dialog
                  .AdminOnlyHelper,
              )}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <p className="text-body-s font-semibold text-base-content">
                {t(AppLocales.Admin.Notifications.Templates.Dialog.ClientsLabel)}
              </p>
              <div
                className="tooltip tooltip-right flex items-center text-base-content/50 hover:text-base-content transition-colors cursor-help"
                data-tip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .ClientsTooltip,
                )}
              >
                <iconsLib.info className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-caption text-xs text-base-content/60">
              {t(
                AppLocales.Admin.Notifications.Templates.Dialog.ClientsHelper,
              )}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {Object.values(NOTIFICATION_CLIENTS).map((client) => (
                <Checkbox
                  key={client}
                  checked={formValues.clients.includes(client)}
                  onChange={(event) => {
                    const clients = event.target.checked
                      ? [...formValues.clients, client]
                      : formValues.clients.filter((value) => value !== client);
                    handleChange("clients", clients);
                  }}
                >
                  {client === NOTIFICATION_CLIENTS.WEB
                    ? t(
                        AppLocales.Admin.Notifications.Templates.Dialog
                          .ClientWeb,
                      )
                    : t(
                        AppLocales.Admin.Notifications.Templates.Dialog
                          .ClientMobile,
                      )}
                </Checkbox>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Multi-Channel Content */}
        <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-base-200 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <iconsLib.sparkles className="h-5 w-5 text-secondary" />
              <h3 className="text-body-m font-bold text-base-content">
                {t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .ChannelContent,
                )}
              </h3>
            </div>
            <span className="text-caption text-xs text-base-content/50">
              {t(AppLocales.Admin.Notifications.Templates.Dialog.VariablesHint)}
            </span>
          </div>

          {/* Dynamic Variables Guide Card */}
          <div className="rounded-xl bg-base-200/40 border border-base-300 p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <iconsLib.info className="h-4 w-4 text-primary shrink-0" />
                <span className="text-body-s font-bold text-base-content">
                  {t(
                    AppLocales.Admin.Notifications.Templates.Dialog
                      .VariablesTitle,
                  )}
                </span>
                <span className="badge badge-sm badge-outline badge-primary font-medium text-[11px]">
                  {t(
                    AppLocales.Admin.Notifications.Templates.Dialog
                      .VariablesBadge,
                  )}
                </span>
              </div>
              <span className="text-caption text-xs text-base-content/60">
                {copiedVar
                  ? `${t(AppLocales.Admin.Notifications.Templates.Dialog.VariablesCopied)} ${copiedVar}`
                  : t(
                      AppLocales.Admin.Notifications.Templates.Dialog
                        .VariablesClickToCopy,
                    )}
              </span>
            </div>

            <p className="text-caption text-xs text-base-content/70 leading-relaxed">
              {t(
                AppLocales.Admin.Notifications.Templates.Dialog
                  .VariablesDescription,
              )}
            </p>

            <div className="flex flex-wrap gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleCopyVariable("{{user_name}}")}
                className="btn btn-xs btn-outline border-base-300 bg-base-100 hover:bg-primary hover:border-primary hover:text-primary-content gap-1.5 font-mono text-xs cursor-pointer transition-all"
              >
                {copiedVar === "{{user_name}}" ? (
                  <iconsLib.checkr className="h-3.5 w-3.5 text-success stroke-[2.5]" />
                ) : (
                  <iconsLib.copy className="h-3.5 w-3.5 opacity-60" />
                )}
                <code>{"{{user_name}}"}</code>
                <span className="text-[10px] opacity-75 font-sans">
                  {t(
                    AppLocales.Admin.Notifications.Templates.Dialog
                      .VariablesUserNameDesc,
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyVariable("{{user_email}}")}
                className="btn btn-xs btn-outline border-base-300 bg-base-100 hover:bg-primary hover:border-primary hover:text-primary-content gap-1.5 font-mono text-xs cursor-pointer transition-all"
              >
                {copiedVar === "{{user_email}}" ? (
                  <iconsLib.checkr className="h-3.5 w-3.5 text-success stroke-[2.5]" />
                ) : (
                  <iconsLib.copy className="h-3.5 w-3.5 opacity-60" />
                )}
                <code>{"{{user_email}}"}</code>
                <span className="text-[10px] opacity-75 font-sans">
                  {t(
                    AppLocales.Admin.Notifications.Templates.Dialog
                      .VariablesUserEmailDesc,
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyVariable("{{link}}")}
                className="btn btn-xs btn-outline border-base-300 bg-base-100 hover:bg-primary hover:border-primary hover:text-primary-content gap-1.5 font-mono text-xs cursor-pointer transition-all"
              >
                {copiedVar === "{{link}}" ? (
                  <iconsLib.checkr className="h-3.5 w-3.5 text-success stroke-[2.5]" />
                ) : (
                  <iconsLib.copy className="h-3.5 w-3.5 opacity-60" />
                )}
                <code>{"{{link}}"}</code>
                <span className="text-[10px] opacity-75 font-sans">
                  {t(
                    AppLocales.Admin.Notifications.Templates.Dialog
                      .VariablesLinkDesc,
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Channel Tabs */}
          <div className="flex gap-2 border-b border-base-200 pb-2">
            <Button
              type="button"
              variant={ButtonVariants.TERTIARY}
              onClick={() => setActiveChannelTab(NOTIFICATION_CHANNELS.IN_APP)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-body-s font-semibold rounded-lg transition-colors ${
                activeChannelTab === NOTIFICATION_CHANNELS.IN_APP
                  ? "bg-primary! text-primary-content! shadow-sm"
                  : "text-base-content/60 hover:bg-base-200"
              }`}
            >
              <iconsLib.chat className="w-4 h-4" />
              {t(AppLocales.Admin.Notifications.Templates.Dialog.InAppTab)}
            </Button>
            <Button
              type="button"
              variant={ButtonVariants.TERTIARY}
              onClick={() => setActiveChannelTab(NOTIFICATION_CHANNELS.PUSH)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-body-s font-semibold rounded-lg transition-colors ${
                activeChannelTab === NOTIFICATION_CHANNELS.PUSH
                  ? "bg-primary! text-primary-content! shadow-sm"
                  : "text-base-content/60 hover:bg-base-200"
              }`}
            >
              <iconsLib.bell className="w-4 h-4" />
              {t(AppLocales.Admin.Notifications.Templates.Dialog.PushTab)}
            </Button>
            <Button
              type="button"
              variant={ButtonVariants.TERTIARY}
              onClick={() => setActiveChannelTab(NOTIFICATION_CHANNELS.EMAIL)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-body-s font-semibold rounded-lg transition-colors ${
                activeChannelTab === NOTIFICATION_CHANNELS.EMAIL
                  ? "bg-primary! text-primary-content! shadow-sm"
                  : "text-base-content/60 hover:bg-base-200"
              }`}
            >
              <iconsLib.mail className="w-4 h-4" />
              {t(AppLocales.Admin.Notifications.Templates.Dialog.EmailTab)}
            </Button>
          </div>

          {/* Tab Contents */}
          {activeChannelTab === NOTIFICATION_CHANNELS.IN_APP && (
            <div className="space-y-4 pt-2">
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.InAppTitle,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .InAppTitlePlaceholder,
                )}
                tooltip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .InAppTitleTooltip,
                )}
                value={formValues.in_app_title || ""}
                onChange={(e) => handleChange("in_app_title", e.target.value)}
              />
              <TextArea
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.InAppBody,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .InAppBodyPlaceholder,
                )}
                tooltip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .InAppBodyTooltip,
                )}
                value={formValues.in_app_body || ""}
                onChange={(e) => handleChange("in_app_body", e.target.value)}
                rows={4}
              />
            </div>
          )}

          {activeChannelTab === NOTIFICATION_CHANNELS.PUSH && (
            <div className="space-y-4 pt-2">
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.PushTitle,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushTitlePlaceholder,
                )}
                tooltip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushTitleTooltip,
                )}
                value={formValues.push_title || ""}
                onChange={(e) => handleChange("push_title", e.target.value)}
              />
              <TextArea
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.PushBody,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushBodyPlaceholder,
                )}
                tooltip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushBodyTooltip,
                )}
                value={formValues.push_body || ""}
                onChange={(e) => handleChange("push_body", e.target.value)}
                rows={4}
              />
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushTemplateId,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushTemplateIdPlaceholder,
                )}
                tooltip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .PushTemplateIdTooltip,
                )}
                value={formValues.push_template_id || ""}
                onChange={(e) =>
                  handleChange("push_template_id", e.target.value)
                }
              />
            </div>
          )}

          {activeChannelTab === NOTIFICATION_CHANNELS.EMAIL && (
            <div className="space-y-4 pt-2">
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.EmailSubject,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailSubjectPlaceholder,
                )}
                tooltip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailSubjectTooltip,
                )}
                value={formValues.email_subject || ""}
                onChange={(e) => handleChange("email_subject", e.target.value)}
              />
              <TextArea
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog.EmailBody,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailBodyPlaceholder,
                )}
                tooltip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailBodyTooltip,
                )}
                value={formValues.email_body || ""}
                onChange={(e) => handleChange("email_body", e.target.value)}
                rows={6}
              />
              <TextInput
                label={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailTemplateId,
                )}
                placeholder={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailTemplateIdPlaceholder,
                )}
                tooltip={t(
                  AppLocales.Admin.Notifications.Templates.Dialog
                    .EmailTemplateIdTooltip,
                )}
                value={formValues.email_template_id || ""}
                onChange={(e) =>
                  handleChange("email_template_id", e.target.value)
                }
              />
            </div>
          )}
        </div>

        {/* Action Row */}
        <FormActionRow
          cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
          submitLabel={
            isCreate
              ? t(AppLocales.Admin.Notifications.Templates.NewTemplate)
              : t(AppLocales.Admin.Common.Actions.Save)
          }
          onCancel={onCancel}
        />
      </FormContainer>
    </>
  );
};
