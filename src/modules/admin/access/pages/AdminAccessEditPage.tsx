// src/modules/admin/access/pages/AdminAccessEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { useLoading } from "../../../../contexts/LoadingContext";
import { useToast } from "../../../../contexts/ToastContext";
import { useDocumentTitle } from "../../../../hooks";
import { iconsLib } from "../../../../assets";
import { Button, StatusBadge } from "../../../../design";
import { ButtonVariants } from "../../../../design/constants";
import AdminAccessesController from "../access.controller";
import type { IAdminAccess } from "../types";
import {
  AlertDialog,
  AdminState,
  FormActionRow,
  FormContainer,
  TextInput,
  PageHeader,
} from "../../components";
import { formatAdminDate } from "../../../../helpers";
import { useTranslate, AppLocales } from "../../../../locales";

export const AdminAccessEditPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(
    `${t(AppLocales.Admin.Accesses.ExtendDialog.Title)} | Admin`,
  );

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { setLoading } = useLoading();

  const [access, setAccess] = useState<IAdminAccess | null>(null);
  const [days, setDays] = useState<number>(30);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadAccess = async () => {
      setLoading(true);
      const result = await AdminAccessesController.getAccess(id);
      setLoading(false);

      if (result.success && result.access) {
        setAccess(result.access);
      } else {
        setError(
          result.error || t(AppLocales.Admin.Accesses.Errors.LoadListFailed),
        );
      }
    };

    void loadAccess();
  }, [id, setLoading, t]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !access) return;

    if (!access.expires_at) {
      setAlertMessage("Lifetime access cannot be extended.");
      return;
    }

    if (days <= 0) {
      setAlertMessage("Please enter a positive number of days.");
      return;
    }

    setLoading(true, { overlay: false });

    const result = await AdminAccessesController.extendAccess(id, { days });
    setLoading(false, { overlay: false });

    if (result.success) {
      toast.success(
        t(AppLocales.Admin.Accesses.Toasts.ExtendSuccess, {
          user: access.user_name || access.user_email,
        }),
      );
      navigate(AppRoutes.client.protected.admin.ACCESSES);
    } else {
      setAlertMessage(
        result.error || t(AppLocales.Admin.Accesses.Errors.ExtendFailed),
      );
    }
  };

  return (
    <div className="space-y-6">
      <AlertDialog
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <PageHeader
        title={t(AppLocales.Admin.Accesses.ExtendDialog.Title)}
        description="Extend the validity period of an active user entitlement"
        action={
          <Button
            variant={ButtonVariants.SECONDARY}
            onClick={() => navigate(AppRoutes.client.protected.admin.ACCESSES)}
          >
            <iconsLib.arrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        }
      />

      {error && !access ? (
        <AdminState
          title={t(AppLocales.Admin.Common.State.ErrorTitle)}
          message={error}
        />
      ) : access ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Entitlement Details Card */}
          <div className="lg:col-span-1 bg-base-100 rounded-xl border border-base-200 p-6 space-y-4">
            <h3 className="font-semibold text-base-content text-lg">
              Entitlement Info
            </h3>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Accesses.Table.User)}
                </span>
                <span className="font-medium text-base-content">
                  {access.user_name || access.user_email || access.user_id}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Accesses.Table.Product)}
                </span>
                <span className="font-medium text-base-content">
                  {access.product_name ||
                    access.product_code ||
                    access.product_id}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">Status</span>
                <StatusBadge status={access.status} />
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Accesses.Table.GrantedAt)}
                </span>
                <span className="text-base-content/70">
                  {formatAdminDate(access.granted_at)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                <span className="text-base-content/60">
                  {t(AppLocales.Admin.Accesses.Table.ExpiresAt)}
                </span>
                <span className="font-medium text-base-content">
                  {access.expires_at
                    ? formatAdminDate(access.expires_at)
                    : t(AppLocales.Admin.Common.Status.Lifetime)}
                </span>
              </div>

              {access.remaining_days !== undefined &&
                access.remaining_days !== null &&
                access.remaining_days > 0 && (
                  <div className="flex justify-between items-center py-1.5 border-b border-base-200">
                    <span className="text-base-content/60">Remaining Days</span>
                    <span className="font-medium text-base-content">
                      {access.remaining_days} days
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Extend Form */}
          <div className="lg:col-span-2">
            {!access.expires_at ? (
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-6 text-sm text-warning space-y-2">
                <p className="font-semibold text-base">Lifetime Access</p>
                <p>
                  This entitlement has lifetime validity and does not expire. It
                  cannot be extended further.
                </p>
              </div>
            ) : (
              <FormContainer onSubmit={handleSubmit}>
                <TextInput
                  label={t(
                    AppLocales.Admin.Accesses.ExtendDialog.AdditionalDaysLabel,
                  )}
                  placeholder={t(
                    AppLocales.Admin.Accesses.ExtendDialog
                      .AdditionalDaysPlaceholder,
                  )}
                  type="number"
                  value={days.toString()}
                  onChange={(e) => setDays(parseInt(e.target.value, 10) || 0)}
                  min={1}
                  required
                  helperText="Number of additional days to add to the existing expiry date."
                />

                <FormActionRow
                  cancelLabel={t(AppLocales.Admin.Common.Actions.Cancel)}
                  submitLabel={t(
                    AppLocales.Admin.Accesses.ExtendDialog.ExtendButton,
                  )}
                  onCancel={() =>
                    navigate(AppRoutes.client.protected.admin.ACCESSES)
                  }
                />
              </FormContainer>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
