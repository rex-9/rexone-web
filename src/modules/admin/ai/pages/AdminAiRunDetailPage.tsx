// src/modules/admin/ai/pages/AdminAiRunDetailPage.tsx

import React from "react";
import { useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import {
  DateTime,
  DateTimeFormats,
  DetailField,
  DetailGrid,
  DetailHeader,
  DetailSection,
  StatusBadge,
} from "../../../../design";
import { AdminState } from "../../components";
import { useAdminDetail } from "../../hooks/useAdminDetail";
import { AppLocales, useTranslate } from "../../../../locales";
import AiController from "../ai.controller";
import type { IAdminAiRun } from "../types";

const loadRun = async (id: string) => {
  const result = await AiController.getRun(id);
  return { ...result, record: result.run };
};

export const AdminAiRunDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslate();

  const { record: run, error } = useAdminDetail<IAdminAiRun>(id, loadRun);

  const listPath = AppRoutes.client.protected.admin.AI_RUNS;

  return (
    <div className="space-y-6">
      <DetailHeader
        breadcrumbs={[
          {
            label: t(AppLocales.Admin.Common.Detail.Admin),
            to: AppRoutes.client.protected.admin.HOME,
          },
          { label: t(AppLocales.Admin.Ai.RunsTitle), to: listPath },
          {
            label: run?.id
              ? `${run.id.slice(0, 8)}...`
              : t(AppLocales.Admin.Common.Detail.Details),
          },
        ]}
        title={run?.model ? `${run.model} (${run.feature || "run"})` : t(AppLocales.Admin.Ai.RunDetail.Title)}
        description={run?.feature ? `Feature: ${run.feature}` : t(AppLocales.Admin.Ai.RunDetail.Description)}
        backTo={listPath}
        icon={iconsLib.cube}
        statusBadge={run ? <StatusBadge status={run.status} label={run.status.toUpperCase()} /> : undefined}
        entityId={run?.id}
        timestamps={
          run
            ? {
                createdAt: run.created_at,
              }
            : undefined
        }
      />

      {error ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : run ? (
        <div className="space-y-6">
          {/* Top Card: Panoramic Run Overview (Full Width) */}
          <DetailSection
            title={t(AppLocales.Admin.Ai.RunDetail.Overview)}
            icon={iconsLib.cube}
          >
            <DetailGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
              <DetailField
                label={t(AppLocales.Admin.Ai.RunsTable.Status)}
                value={
                  <StatusBadge
                    status={run.status}
                    label={run.status.toUpperCase()}
                  />
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Ai.RunsTable.Feature)}
                value={
                  <span className="badge badge-sm badge-outline font-mono">
                    {run.feature || "chat"}
                  </span>
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Ai.RunsTable.Profile)}
                value={
                  <span className="font-mono text-xs font-semibold text-primary select-all">
                    {run.profile_key || "-"}
                  </span>
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Ai.ProfilesTable.Provider)}
                value={
                  <span className="badge badge-neutral uppercase font-mono text-xs font-medium">
                    {run.provider || "-"}
                  </span>
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Ai.RunsTable.Model)}
                value={
                  <span className="font-mono text-xs font-medium bg-base-200 px-2 py-1 rounded select-all">
                    {run.model || "-"}
                  </span>
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Ai.RunsTable.Latency)}
                value={
                  <span className="font-mono text-sm font-semibold">
                    {run.latency_ms != null ? `${run.latency_ms} ms` : "-"}
                  </span>
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Ai.RunsTable.Tokens)}
                value={
                  <span className="font-mono text-sm font-semibold text-primary">
                    {run.total_tokens != null
                      ? run.total_tokens.toLocaleString()
                      : "-"}
                  </span>
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Created)}
                value={
                  run.created_at ? (
                    <DateTime
                      value={run.created_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  ) : (
                    "-"
                  )
                }
              />
              <DetailField
                label={t(AppLocales.Admin.Common.Detail.Updated)}
                value={
                  run.updated_at ? (
                    <DateTime
                      value={run.updated_at}
                      format={DateTimeFormats.ADMIN}
                    />
                  ) : (
                    "-"
                  )
                }
              />
            </DetailGrid>
          </DetailSection>

          {/* 2 Equal Columns: Performance Telemetry & Context Identifiers */}
          <div className="grid gap-6 lg:grid-cols-2 items-start">
            <DetailSection
              title={t(AppLocales.Admin.Ai.RunDetail.Diagnostics)}
              icon={iconsLib.chartBar}
            >
              <DetailGrid className="grid-cols-1 sm:grid-cols-2">
                <DetailField
                  label={t(AppLocales.Admin.Ai.RunDetail.PromptTokens)}
                  value={
                    run.prompt_tokens != null
                      ? run.prompt_tokens.toLocaleString()
                      : "-"
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Ai.RunDetail.CompletionTokens)}
                  value={
                    run.completion_tokens != null
                      ? run.completion_tokens.toLocaleString()
                      : "-"
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Ai.RunDetail.InputMessagesCount)}
                  value={
                    run.input_messages_count != null
                      ? String(run.input_messages_count)
                      : "-"
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Ai.RunDetail.InputChars)}
                  value={
                    run.input_chars != null
                      ? run.input_chars.toLocaleString()
                      : "-"
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Ai.RunDetail.OutputChars)}
                  value={
                    run.output_chars != null
                      ? run.output_chars.toLocaleString()
                      : "-"
                  }
                />
              </DetailGrid>
            </DetailSection>

            <DetailSection
              title={t(AppLocales.Admin.Common.Detail.Details)}
              icon={iconsLib.info}
            >
              <DetailGrid className="grid-cols-1">
                <DetailField
                  label={t(AppLocales.Admin.Ai.RunsTable.Id)}
                  value={
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-base-content/90 select-all break-all">
                        {run.id}
                      </span>
                    </div>
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Ai.RunDetail.UserId)}
                  value={
                    run.user_id ? (
                      <span className="font-mono text-xs text-base-content/90 select-all break-all">
                        {run.user_id}
                      </span>
                    ) : (
                      "-"
                    )
                  }
                />
                <DetailField
                  label={t(AppLocales.Admin.Ai.RunDetail.ChatMessageId)}
                  value={
                    run.chat_message_id ? (
                      <span className="font-mono text-xs text-base-content/90 select-all break-all">
                        {run.chat_message_id}
                      </span>
                    ) : (
                      "-"
                    )
                  }
                />
              </DetailGrid>
            </DetailSection>
          </div>

          {run.error && (
            <DetailSection
              title={t(AppLocales.Admin.Ai.RunDetail.Error)}
              icon={iconsLib.warning}
            >
              <div className="rounded-lg bg-error/10 border border-error/20 p-4 font-mono text-xs text-error whitespace-pre-wrap leading-relaxed">
                {run.error}
              </div>
            </DetailSection>
          )}

          {run.request_metadata &&
            Object.keys(run.request_metadata).length > 0 && (
              <DetailSection
                title={t(AppLocales.Admin.Ai.RunDetail.RequestMetadata)}
                icon={iconsLib.document}
              >
                <pre className="rounded-lg bg-base-200/80 border border-base-300 p-4 font-mono text-xs overflow-x-auto text-base-content/90 max-h-60">
                  {JSON.stringify(run.request_metadata, null, 2)}
                </pre>
              </DetailSection>
            )}
        </div>
      ) : null}
    </div>
  );
};
