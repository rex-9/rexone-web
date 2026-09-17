import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { Button } from "../../../../design";
import { ButtonVariants, ComponentSizes } from "../../../../design/constants";
import { useDocumentTitle } from "../../../../hooks";
import { AppLocales } from "../../../../locales/app_locales";
import { PageHeader } from "../../components";
import { AdminRedemptionsTable } from "../components";

export const AdminUserCouponsPage: React.FC = () => {
  const { t } = useTranslation();
  useDocumentTitle(t(AppLocales.Admin.UserCoupons.Title));
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t(AppLocales.Admin.UserCoupons.Title)}
        description={t(AppLocales.Admin.UserCoupons.Description)}
        action={
          <Button
            variant={ButtonVariants.TERTIARY}
            size={ComponentSizes.MD}
            onClick={() => navigate(AppRoutes.client.protected.admin.COUPONS)}
          >
            <iconsLib.arrowLeft className="w-4 h-4 mr-1.5" />
            {t(AppLocales.Admin.UserCoupons.BackButton)}
          </Button>
        }
      />

      <AdminRedemptionsTable />
    </div>
  );
};

export default AdminUserCouponsPage;
