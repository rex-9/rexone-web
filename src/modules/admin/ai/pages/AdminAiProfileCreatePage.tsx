// src/modules/admin/ai/pages/AdminAiProfileCreatePage.tsx

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { Dropdown } from "../../../../design";
import AiController from "../ai.controller";
import type { IAdminAiProfileFormValues } from "../types";
import {
  AlertDialog,
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
  AI_PROFILE_KEY_PRESETS,
} from "../constants";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminAiProfileCreatePage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Ai.ProfileCreateTitle)} | Admin`);

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();

  const [alertMessage, setAlertMessage] = useState("");

  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<string>("deepseek");
  const [enabled, setEnabled] = useState(true);
  const [model, setModel] = useState<string>("deepseek-chat");
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [temperature, setTemperature] = useState<string>("0.7");
  const [maxOutputTokens, setMaxOutputTokens] = useState<string>("2000");
  const [contextMaxTokens, setContextMaxTokens] = useState<string>("8000");
  const [historyMaxMessages, setHistoryMaxMessages] = useState<string>("20");
  const [timeoutSeconds, setTimeoutSeconds] = useState<string>("30");
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, "_");
    if (!normalizedKey) {
      setAlertMessage("Profile Key is required.");
      return;
    }
    if (!name.trim()) {
      setAlertMessage("Profile Name is required.");
      return;
    }
    if (!model.trim()) {
      setAlertMessage("Model Identifier is required.");
      return;
    }

    const values: IAdminAiProfileFormValues = {
      key: normalizedKey,
      provider: provider.trim() || "deepseek",
      name: name.trim(),
      enabled,
      model: model.trim(),
      temperature: temperature !== "" ? parseFloat(temperature) : 0.7,
      max_output_tokens:
        maxOutputTokens !== "" ? parseInt(maxOutputTokens, 10) : 2000,
      context_max_tokens:
        contextMaxTokens !== "" ? parseInt(contextMaxTokens, 10) : 8000,
      history_max_messages:
        historyMaxMessages !== "" ? parseInt(historyMaxMessages, 10) : 20,
      timeout_seconds:
        timeoutSeconds !== "" ? parseInt(timeoutSeconds, 10) : 30,
      system_prompt: systemPrompt.trim() || null,
    };

    setLoading(true);
    const result = await AiController.createProfile(values);
    setLoading(false);

    if (result.success && result.profile) {
      toast.success(t(AppLocales.Admin.Ai.Toasts.ProfileCreateSuccess));
      navigate(
        AppRoutes.withId(
          AppRoutes.client.protected.admin.AI_PROFILE_DETAIL,
          result.profile.id,
        ),
      );
    } else {
      setAlertMessage(result.error || t(AppLocales.Admin.Ai.Errors.CreateProfile));
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
          { label: t(AppLocales.Admin.Ai.ProfileCreateTitle) },
        ]}
        title={t(AppLocales.Admin.Ai.ProfileCreateTitle)}
        description={t(AppLocales.Admin.Ai.ProfileCreateDescription)}
        backTo={listPath}
      />

      <FormContainer onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <TextInput
                label={t(AppLocales.Admin.Ai.ProfileForm.KeyLabel)}
                placeholder={t(AppLocales.Admin.Ai.ProfileForm.KeyPlaceholder)}
                value={key}
                onChange={(e) =>
                  setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))
                }
                required
                className="font-mono text-sm"
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-caption text-base-content/50">Presets:</span>
                {AI_PROFILE_KEY_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setKey(preset.value);
                      if (!name) {
                        const friendly =
                          preset.label.split("(")[1]?.replace(")", "") ||
                          preset.value;
                        setName(friendly);
                      }
                    }}
                    className={`px-2 py-0.5 rounded text-caption font-mono transition-colors cursor-pointer ${
                      key === preset.value
                        ? "bg-primary text-primary-content font-semibold shadow-xs"
                        : "bg-base-200 text-base-content/70 hover:bg-base-300"
                    }`}
                  >
                    {preset.value}
                  </button>
                ))}
              </div>
            </div>

            <TextInput
              label={t(AppLocales.Admin.Ai.ProfileForm.NameLabel)}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
              onCheckedChange={(checked) => setEnabled(checked)}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

            <TextInput
              label={t(AppLocales.Admin.Ai.ProfileForm.HistoryMaxMessagesLabel)}
              type="number"
              min="0"
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
            placeholder={t(
              AppLocales.Admin.Ai.ProfileForm.SystemPromptPlaceholder,
            )}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={5}
          />

          <FormActionRow
            submitLabel={t(AppLocales.Admin.Ai.ProfileForm.CreateProfileSubmit)}
            cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
            onCancel={() => navigate(listPath)}
          />
        </div>
      </FormContainer>
    </div>
  );
};

export default AdminAiProfileCreatePage;
