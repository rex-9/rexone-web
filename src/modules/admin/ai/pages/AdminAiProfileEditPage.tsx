// src/modules/admin/ai/pages/AdminAiProfileEditPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { Dropdown } from "../../../../design";
import AiController from "../ai.controller";
import type {
  IAdminAiProfile,
  IAdminAiProfileFormValues,
} from "../types";
import {
  AlertDialog,
  AdminState,
  FormActionRow,
  FormContainer,
  TextInput,
  TextArea,
  Toggle,
  AdminDetailHeader,
} from "../../components";
import {
  AI_PROVIDER_OPTIONS,
  AI_PROVIDER_MODELS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminAiProfileEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Ai.ProfileEditTitle)} | Admin`);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();

  const [profile, setProfile] = useState<IAdminAiProfile | null>(null);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [name, setName] = useState("");
  const [provider, setProvider] = useState<string>("deepseek");
  const [enabled, setEnabled] = useState(true);
  const [model, setModel] = useState("");
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [temperature, setTemperature] = useState<string>("");
  const [maxOutputTokens, setMaxOutputTokens] = useState<string>("");
  const [contextMaxTokens, setContextMaxTokens] = useState<string>("");
  const [historyMaxMessages, setHistoryMaxMessages] = useState<string>("");
  const [timeoutSeconds, setTimeoutSeconds] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const modelOptions = useMemo(() => {
    const list = AI_PROVIDER_MODELS[provider] || [];
    return [
      ...list.map((m) => ({ value: m.value, label: m.label })),
      {
        value: "__custom__",
        label: t(AppLocales.Admin.Ai.CustomModel) || "Custom Model...",
      },
    ];
  }, [provider, t]);

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    if (!isCustomModel) {
      const defaultModel = AI_PROVIDER_MODELS[newProvider]?.[0]?.value || "";
      setModel(defaultModel);
    }
  };

  const handleModelChange = (val: string) => {
    if (val === "__custom__") {
      setIsCustomModel(true);
      setModel("");
    } else {
      setIsCustomModel(false);
      setModel(val);
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadProfile = async () => {
      setLoading(true);
      const result = await AiController.getProfile(id);
      setLoading(false);

      if (result.success && result.profile) {
        const p = result.profile;
        setProfile(p);
        setName(p.name || "");
        const prov = p.provider || "deepseek";
        setProvider(prov);
        setEnabled(p.enabled);
        setModel(p.model || "");
        const knownModels = AI_PROVIDER_MODELS[prov] || [];
        const isKnown = knownModels.some((m) => m.value === p.model);
        setIsCustomModel(!isKnown && Boolean(p.model));
        setTemperature(p.temperature != null ? String(p.temperature) : "");
        setMaxOutputTokens(
          p.max_output_tokens != null ? String(p.max_output_tokens) : "",
        );
        setContextMaxTokens(
          p.context_max_tokens != null ? String(p.context_max_tokens) : "",
        );
        setHistoryMaxMessages(
          p.history_max_messages != null ? String(p.history_max_messages) : "",
        );
        setTimeoutSeconds(
          p.timeout_seconds != null ? String(p.timeout_seconds) : "",
        );
        setSystemPrompt(p.system_prompt || "");
      } else {
        setError(result.error || t(AppLocales.Admin.Ai.Errors.LoadProfile));
      }
    };

    void loadProfile();
  }, [id, setLoading, t]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    if (!name.trim()) {
      setAlertMessage("Profile Name is required.");
      return;
    }
    if (!model.trim()) {
      setAlertMessage("Model Identifier is required.");
      return;
    }

    const values: IAdminAiProfileFormValues = {
      provider: provider.trim() || "deepseek",
      name: name.trim(),
      enabled,
      model: model.trim(),
      temperature: temperature !== "" ? parseFloat(temperature) : null,
      max_output_tokens:
        maxOutputTokens !== "" ? parseInt(maxOutputTokens, 10) : null,
      context_max_tokens:
        contextMaxTokens !== "" ? parseInt(contextMaxTokens, 10) : null,
      history_max_messages:
        historyMaxMessages !== "" ? parseInt(historyMaxMessages, 10) : null,
      timeout_seconds:
        timeoutSeconds !== "" ? parseInt(timeoutSeconds, 10) : null,
      system_prompt: systemPrompt.trim() || null,
    };

    setLoading(true, { overlay: false });
    const result = await AiController.updateProfile(id, values);
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(t(AppLocales.Admin.Ai.Toasts.ProfileUpdateSuccess));
      navigate(
        AppRoutes.withId(
          AppRoutes.client.protected.admin.AI_PROFILE_DETAIL,
          id,
        ),
      );
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Ai.Errors.UpdateProfile),
      );
    }
  };

  const listPath = AppRoutes.client.protected.admin.AI_PROFILES;

  return (
    <div className="space-y-6">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Ai.ProfilesTitle), to: listPath },
          {
            label: profile?.name || t(AppLocales.Admin.Common.Detail.Details),
            to: id
              ? AppRoutes.withId(
                  AppRoutes.client.protected.admin.AI_PROFILE_DETAIL,
                  id,
                )
              : listPath,
          },
          { label: t(AppLocales.Admin.Common.Actions.Edit) },
        ]}
        title={t(AppLocales.Admin.Ai.ProfileEditTitle)}
        description={t(AppLocales.Admin.Ai.ProfileEditDescription)}
        backTo={listPath}
      />

      {error && !profile ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : profile ? (
        <FormContainer onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <TextInput
                label={t(AppLocales.Admin.Ai.ProfileForm.KeyLabel)}
                value={profile.key}
                disabled
                className="font-mono text-sm bg-base-200 cursor-not-allowed opacity-80"
              />

              <TextInput
                label={t(AppLocales.Admin.Ai.ProfileForm.NameLabel)}
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Dropdown
                label={t(AppLocales.Admin.Ai.ProfileForm.ProviderLabel)}
                value={provider}
                options={AI_PROVIDER_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                onValueChange={handleProviderChange}
              />

              <div className="space-y-2">
                <Dropdown
                  label={t(AppLocales.Admin.Ai.ProfileForm.ModelLabel)}
                  value={isCustomModel ? "__custom__" : model}
                  options={modelOptions}
                  onValueChange={handleModelChange}
                />
                {isCustomModel && (
                  <TextInput
                    placeholder="Enter custom model identifier (e.g. gpt-4o, claude-3-7-sonnet)"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                    className="font-mono text-sm mt-1"
                  />
                )}
              </div>
            </div>

            <div className="pt-2">
              <Toggle
                label={t(AppLocales.Admin.Ai.ProfileForm.EnabledLabel)}
                checked={enabled}
                onCheckedChange={(val: boolean) => setEnabled(val)}
              />
            </div>

          <div className="grid gap-4 md:grid-cols-3">
            <TextInput
              label={t(AppLocales.Admin.Ai.ProfileForm.TemperatureLabel)}
              type="number"
              step="0.05"
              min="0"
              max="2"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />

            <TextInput
              label={t(AppLocales.Admin.Ai.ProfileForm.MaxOutputTokensLabel)}
              type="number"
              min="1"
              value={maxOutputTokens}
              onChange={(e) => setMaxOutputTokens(e.target.value)}
            />

            <TextInput
              label={t(AppLocales.Admin.Ai.ProfileForm.ContextMaxTokensLabel)}
              type="number"
              min="1"
              value={contextMaxTokens}
              onChange={(e) => setContextMaxTokens(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label={t(AppLocales.Admin.Ai.ProfileForm.HistoryMaxMessagesLabel)}
              type="number"
              min="1"
              value={historyMaxMessages}
              onChange={(e) => setHistoryMaxMessages(e.target.value)}
            />

            <TextInput
              label={t(AppLocales.Admin.Ai.ProfileForm.TimeoutSecondsLabel)}
              type="number"
              min="1"
              value={timeoutSeconds}
              onChange={(e) => setTimeoutSeconds(e.target.value)}
            />
          </div>

          <TextArea
            label={t(AppLocales.Admin.Ai.ProfileForm.SystemPromptLabel)}
            value={systemPrompt}
            rows={6}
            placeholder={t(
              AppLocales.Admin.Ai.ProfileForm.SystemPromptPlaceholder,
            )}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />

          <FormActionRow
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            submitLabel={t(AppLocales.Admin.Ai.ProfileForm.SaveProfile)}
            onCancel={() =>
              navigate(
                AppRoutes.withId(
                  AppRoutes.client.protected.admin.AI_PROFILE_DETAIL,
                  id!,
                ),
              )
            }
          />
        </div>
      </FormContainer>
      ) : null}
    </div>
  );
};
