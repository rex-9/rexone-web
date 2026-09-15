// src/modules/admin/ai/pages/AdminAiProfileDetailPage.tsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  StatusBadge,
  DateTime,
  DateTimeFormats,
  Button,
  ButtonSizes,
  ButtonVariants,
} from "../../../../design";
import {
  AdminDetailField,
  AdminDetailGrid,
  AdminDetailHeader,
  AdminDetailSection,
  AdminState,
} from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { usePermissions } from "../../../../hooks";
import {
  ADMIN_ACTIONS,
  ADMIN_RESOURCES,
  ADMIN_COMMON_LABELS,
} from "../../constants";
import { AppLocales, useTranslate } from "../../../../locales";
import AiController from "../ai.controller";
import type { IAdminAiProfile } from "../types";

const loadProfile = async (id: string) => {
  const result = await AiController.getProfile(id);
  return { ...result, record: result.profile };
};

export const AdminAiProfileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useTranslate();
  const { can } = usePermissions();

  const { record: profile, error } = useAdminDetail<IAdminAiProfile>(
    id,
    loadProfile,
  );

  const listPath = AppRoutes.client.protected.admin.AI_PROFILES;

  return (
    <div className="space-y-6">
      <AdminDetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Ai.ProfilesTitle), to: listPath },
          {
            label: profile?.name || t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={profile?.name || t(AppLocales.Admin.Ai.ProfileDetail.Title)}
        description={t(AppLocales.Admin.Ai.ProfileDetail.Description)}
        backTo={listPath}
        action={
          profile && can(ADMIN_ACTIONS.UPDATE, ADMIN_RESOURCES.AI_PROFILES) ? (
            <Button
              size={ButtonSizes.SM}
              variant={ButtonVariants.PRIMARY}
              onClick={() =>
                navigate(
                  AppRoutes.withId(
                    AppRoutes.client.protected.admin.AI_PROFILE_EDIT,
                    profile.id,
                  ),
                )
              }
            >
              <iconsLib.pencilSquare className="mr-1.5 h-4 w-4" />
              {t(AppLocales.Admin.Common.Actions.Edit)}
            </Button>
          ) : undefined
        }
      />

      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : profile ? (
        <div className="space-y-6">
          {/* Overview Card: Full Width Panoramic Layout */}
          <AdminDetailSection
            title={t(AppLocales.Admin.Ai.ProfileDetail.Overview)}
            icon={iconsLib.cube}
          >
            <AdminDetailGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              <AdminDetailField
                label={t(AppLocales.Admin.Ai.ProfilesTable.Key)}
                value={
                  <span className="font-mono text-xs font-semibold text-primary select-all">
                    {profile.key}
                  </span>
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Ai.ProfilesTable.Name)}
                value={profile.name}
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Ai.ProfilesTable.Provider)}
                value={
                  <span className="badge badge-neutral uppercase font-mono text-xs font-medium">
                    {profile.provider}
                  </span>
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Ai.ProfilesTable.Model)}
                value={
                  <span className="font-mono text-xs font-medium bg-base-200 px-2 py-1 rounded select-all">
                    {profile.model}
                  </span>
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Ai.ProfilesTable.Status)}
                value={
                  <StatusBadge
                    status={profile.enabled ? "active" : "inactive"}
                    label={
                      profile.enabled
                        ? ADMIN_COMMON_LABELS.ACTIVE
                        : ADMIN_COMMON_LABELS.INACTIVE
                    }
                  />
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={
                  profile.created_at ? (
                    <DateTime
                      value={profile.created_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  ) : (
                    "-"
                  )
                }
              />
              <AdminDetailField
                label={t(AppLocales.Admin.Common.Detail.Updated)}
                value={
                  profile.updated_at ? (
                    <DateTime
                      value={profile.updated_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  ) : (
                    "-"
                  )
                }
              />
            </AdminDetailGrid>
          </AdminDetailSection>

          {/* 2 Equal Columns: Execution Parameters & System Prompt */}
          <div className="grid gap-6 lg:grid-cols-2 items-start">
            <div className="space-y-6">
              <AdminDetailSection
                title={t(AppLocales.Admin.Ai.ProfileDetail.Parameters)}
                icon={iconsLib.sparkles}
              >
                <AdminDetailGrid className="grid-cols-1 sm:grid-cols-2">
                  <AdminDetailField
                    label={t(AppLocales.Admin.Ai.ProfileForm.TemperatureLabel)}
                    value={
                      profile.temperature != null
                        ? String(profile.temperature)
                        : "Default"
                    }
                  />
                  <AdminDetailField
                    label={t(
                      AppLocales.Admin.Ai.ProfileForm.MaxOutputTokensLabel,
                    )}
                    value={
                      profile.max_output_tokens != null
                        ? profile.max_output_tokens.toLocaleString()
                        : "Default"
                    }
                  />
                  <AdminDetailField
                    label={t(
                      AppLocales.Admin.Ai.ProfileForm.ContextMaxTokensLabel,
                    )}
                    value={
                      profile.context_max_tokens != null
                        ? profile.context_max_tokens.toLocaleString()
                        : "Default"
                    }
                  />
                  <AdminDetailField
                    label={t(
                      AppLocales.Admin.Ai.ProfileForm.HistoryMaxMessagesLabel,
                    )}
                    value={
                      profile.history_max_messages != null
                        ? String(profile.history_max_messages)
                        : "Default"
                    }
                  />
                  <AdminDetailField
                    label={t(AppLocales.Admin.Ai.ProfileForm.TimeoutSecondsLabel)}
                    value={
                      profile.timeout_seconds != null
                        ? `${profile.timeout_seconds}s`
                        : "Default"
                    }
                  />
                </AdminDetailGrid>
              </AdminDetailSection>

              {profile.settings && Object.keys(profile.settings).length > 0 && (
                <AdminDetailSection
                  title={t(AppLocales.Admin.Ai.ProfileDetail.Settings)}
                  icon={iconsLib.cube}
                >
                  <pre className="rounded-lg bg-base-200/80 border border-base-300 p-4 font-mono text-xs overflow-x-auto text-base-content/90 max-h-60">
                    {JSON.stringify(profile.settings, null, 2)}
                  </pre>
                </AdminDetailSection>
              )}
            </div>

            <AdminDetailSection
              title={t(AppLocales.Admin.Ai.ProfileDetail.SystemPrompt)}
              icon={iconsLib.document}
            >
              {profile.system_prompt ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-base-content/60">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-sm badge-ghost font-mono">
                        {profile.system_prompt.length} chars
                      </span>
                      <span className="badge badge-sm badge-ghost font-mono">
                        {
                          profile.system_prompt
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean).length
                        } words
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-base-300 bg-base-200/50 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-base-content/90 max-h-96 overflow-y-auto select-text">
                    {profile.system_prompt}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-base-300 p-8 text-center text-sm text-base-content/50">
                  {t(AppLocales.Admin.Ai.ProfileDetail.NoSystemPrompt)}
                </div>
              )}
            </AdminDetailSection>
          </div>
        </div>
      ) : null}
    </div>
  );
};
