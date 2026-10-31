// src/modules/admin/ai/pages/AdminAiProfileCreatePage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import {
  DetailHeader,
  Dropdown,
  Badge,
  BadgeVariants,
  ComponentSizes,
} from "../../../../design";
import AiController from "../ai.controller";
import {
  AlertDialog,
  FormActionRow,
  FormContainer,
  TextInput,
  TextArea,
  Toggle,
} from "../../components";
import { AI_CUSTOM_MODEL_OPTION } from "../constants";
import { formatAiRatePerMillion } from "../helpers/aiCost.helper";
import { useTranslate, AppLocales } from "../../../../locales";
import type { IAdminAiConfig, IAdminAiProfileFormValues } from "../types";

export const AdminAiProfileCreatePage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(`${t(AppLocales.Admin.Ai.ProfileCreateTitle)} | Admin`);

  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();

  const [alertMessage, setAlertMessage] = useState("");
  const [config, setConfig] = useState<IAdminAiConfig | null>(
    null,
  );

  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<string>("");
  const [enabled, setEnabled] = useState(true);
  const [model, setModel] = useState<string>("");
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [inputCostPerMillion, setInputCostPerMillion] = useState<string>("");
  const [cachedCostPerMillion, setCachedCostPerMillion] = useState<string>("");
  const [outputCostPerMillion, setOutputCostPerMillion] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [maxOutputTokens, setMaxOutputTokens] = useState<string>("");
  const [contextMaxTokens, setContextMaxTokens] = useState<string>("");
  const [historyMaxMessages, setHistoryMaxMessages] = useState<string>("");
  const [timeoutSeconds, setTimeoutSeconds] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      const result = await AiController.getConfig();
      setLoading(false);

      if (result.success && result.config) {
        const data = result.config;
        setConfig(data);
        setProvider(data.default_provider);
        setModel(data.default_model);
        setTemperature(String(data.defaults.temperature));
        setMaxOutputTokens(String(data.defaults.max_output_tokens));
        setContextMaxTokens(String(data.defaults.context_max_tokens));
        setHistoryMaxMessages(String(data.defaults.history_max_messages));
        setTimeoutSeconds(String(data.defaults.timeout_seconds));
      } else if (result.error) {
        setAlertMessage(result.error);
      }
    };

    void loadConfig();
  }, [setLoading]);

  const selectedProvider = useMemo(
    () =>
      config?.providers.find((item) => item.key === provider) || null,
    [config, provider],
  );

  const selectedModelMeta = useMemo(
    () =>
      selectedProvider?.models.find((item) => item.model === model) || null,
    [selectedProvider, model],
  );

  useEffect(() => {
    if (selectedModelMeta) {
      setInputCostPerMillion(
        selectedModelMeta.input_cost_per_million != null
          ? String(selectedModelMeta.input_cost_per_million)
          : "",
      );
      setCachedCostPerMillion(
        selectedModelMeta.cached_cost_per_million != null
          ? String(selectedModelMeta.cached_cost_per_million)
          : "",
      );
      setOutputCostPerMillion(
        selectedModelMeta.output_cost_per_million != null
          ? String(selectedModelMeta.output_cost_per_million)
          : "",
      );
    } else if (isCustomModel) {
      setInputCostPerMillion("");
      setCachedCostPerMillion("");
      setOutputCostPerMillion("");
    }
  }, [selectedModelMeta, isCustomModel]);

  const providerOptions = useMemo(
    () =>
      (config?.providers || []).map((item) => ({
        value: item.key,
        label: item.label,
      })),
    [config],
  );

  const modelOptions = useMemo(() => {
    const list = selectedProvider?.models || [];
    return [
      ...list.map((m) => ({ value: m.model, label: m.model })),
      {
        value: AI_CUSTOM_MODEL_OPTION,
        label: t(AppLocales.Admin.Ai.CustomModel),
      },
    ];
  }, [selectedProvider, t]);

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    if (!isCustomModel) {
      const nextProv = config?.providers.find(
        (item) => item.key === newProvider,
      );
      const defaultModel =
        nextProv?.default_model || nextProv?.models[0]?.model || "";
      setModel(defaultModel);
    }
  };

  const handleModelChange = (val: string) => {
    if (val === AI_CUSTOM_MODEL_OPTION) {
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
      setAlertMessage(t(AppLocales.Admin.Ai.ProfileForm.KeyRequired));
      return;
    }
    if (!name.trim()) {
      setAlertMessage(t(AppLocales.Admin.Ai.ProfileForm.NameRequired));
      return;
    }
    if (!model.trim()) {
      setAlertMessage(t(AppLocales.Admin.Ai.ProfileForm.ModelRequired));
      return;
    }

    const values: IAdminAiProfileFormValues = {
      key: normalizedKey,
      provider:
        provider.trim() ||
        config?.default_provider ||
        config?.providers[0]?.key ||
        "",
      name: name.trim(),
      enabled,
      model: model.trim(),
      input_cost_per_million:
        inputCostPerMillion !== "" ? parseFloat(inputCostPerMillion) : null,
      cached_cost_per_million:
        cachedCostPerMillion !== "" ? parseFloat(cachedCostPerMillion) : null,
      output_cost_per_million:
        outputCostPerMillion !== "" ? parseFloat(outputCostPerMillion) : null,
      temperature:
        temperature !== ""
          ? parseFloat(temperature)
          : (config?.defaults.temperature ?? null),
      max_output_tokens:
        maxOutputTokens !== ""
          ? parseInt(maxOutputTokens, 10)
          : (config?.defaults.max_output_tokens ?? null),
      context_max_tokens:
        contextMaxTokens !== ""
          ? parseInt(contextMaxTokens, 10)
          : (config?.defaults.context_max_tokens ?? null),
      history_max_messages:
        historyMaxMessages !== ""
          ? parseInt(historyMaxMessages, 10)
          : (config?.defaults.history_max_messages ?? null),
      timeout_seconds:
        timeoutSeconds !== ""
          ? parseInt(timeoutSeconds, 10)
          : (config?.defaults.timeout_seconds ?? null),
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

      <DetailHeader
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
                <span className="text-caption text-base-content/50">
                  {t(AppLocales.Admin.Ai.ProfileForm.PresetsLabel)}
                </span>
                {(config?.profile_key_presets || []).map((preset) => (
                  <Badge
                    key={preset.key}
                    variant={
                      key === preset.key
                        ? BadgeVariants.PRIMARY
                        : BadgeVariants.DEFAULT
                    }
                    size={ComponentSizes.XS}
                    onClick={() => {
                      const isPresetName = (
                        config?.profile_key_presets || []
                      ).some((item) => item.name === name);
                      setKey(preset.key);
                      if (!name || isPresetName) {
                        setName(preset.name);
                      }
                    }}
                    className="cursor-pointer font-mono font-medium transition-colors"
                  >
                    {preset.key}
                  </Badge>
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
            <div className="space-y-2">
              <Dropdown
                label={t(AppLocales.Admin.Ai.ProfileForm.ProviderLabel)}
                value={provider}
                options={providerOptions}
                onValueChange={handleProviderChange}
              />
              {selectedProvider && (
                <div className="flex items-center gap-2 pt-0.5">
                  <Badge
                    variant={
                      selectedProvider.configured
                        ? BadgeVariants.SUCCESS
                        : BadgeVariants.WARNING
                    }
                    size={ComponentSizes.XS}
                  >
                    {selectedProvider.configured
                      ? t(AppLocales.Admin.Ai.ApiKeyConfigured)
                      : t(AppLocales.Admin.Ai.ApiKeyMissing)}
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Dropdown
                label={t(AppLocales.Admin.Ai.ProfileForm.ModelLabel)}
                value={isCustomModel ? AI_CUSTOM_MODEL_OPTION : model}
                options={modelOptions}
                onValueChange={handleModelChange}
              />
              {isCustomModel && (
                <TextInput
                  placeholder={t(
                    AppLocales.Admin.Ai.ProfileForm.CustomModelPlaceholder,
                  )}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                  className="font-mono text-sm mt-1"
                />
              )}
              {selectedModelMeta &&
                (selectedModelMeta.input_cost_per_million != null ||
                  selectedModelMeta.output_cost_per_million != null) && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <Badge
                      variant={BadgeVariants.DEFAULT}
                      size={ComponentSizes.XS}
                      className="font-mono"
                    >
                      {t(AppLocales.Admin.Ai.InputRate)}:{" "}
                      {formatAiRatePerMillion(
                        selectedModelMeta.input_cost_per_million,
                      )}
                    </Badge>
                    {selectedModelMeta.cached_cost_per_million != null && (
                      <Badge
                        variant={BadgeVariants.DEFAULT}
                        size={ComponentSizes.XS}
                        className="font-mono"
                      >
                        {t(AppLocales.Admin.Ai.CachedRate)}:{" "}
                        {formatAiRatePerMillion(
                          selectedModelMeta.cached_cost_per_million,
                        )}
                      </Badge>
                    )}
                    <Badge
                      variant={BadgeVariants.DEFAULT}
                      size={ComponentSizes.XS}
                      className="font-mono"
                    >
                      {t(AppLocales.Admin.Ai.OutputRate)}:{" "}
                      {formatAiRatePerMillion(
                        selectedModelMeta.output_cost_per_million,
                      )}
                    </Badge>
                  </div>
                )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <TextInput
              label={`${t(AppLocales.Admin.Ai.InputRate)} ($ / 1M)`}
              type="number"
              step="0.0001"
              min="0"
              value={inputCostPerMillion}
              onChange={(e) => setInputCostPerMillion(e.target.value)}
            />
            <TextInput
              label={`${t(AppLocales.Admin.Ai.CachedRate)} ($ / 1M)`}
              type="number"
              step="0.0001"
              min="0"
              value={cachedCostPerMillion}
              onChange={(e) => setCachedCostPerMillion(e.target.value)}
            />
            <TextInput
              label={`${t(AppLocales.Admin.Ai.OutputRate)} ($ / 1M)`}
              type="number"
              step="0.0001"
              min="0"
              value={outputCostPerMillion}
              onChange={(e) => setOutputCostPerMillion(e.target.value)}
            />
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
