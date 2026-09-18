import React from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../AppRoutes";
import { iconsLib } from "../../../../assets";
import { Button } from "../../../../design";
import { ButtonSizes, ButtonVariants } from "../../../../design/constants";
import { useDocumentTitle } from "../../../../hooks";
import { AppLocales, useTranslate } from "../../../../locales";
import { PageHeader } from "../../components";
import { AdminRedemptionsTable } from "../components";

export const AdminUserCouponsPage: React.FC = () => {
  const t = useTranslate();
  useDocumentTitle(t(AppLocales.Admin.UserCoupons.Title));
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t(AppLocales.Admin.UserCoupons.Title)}
        description={t(AppLocales.Admin.UserCoupons.Description)}
        action={
          <Button
            size={ButtonSizes.SM}
            variant={ButtonVariants.SECONDARY}
            className="shrink-0 gap-1.5"
            onClick={() => navigate(AppRoutes.client.protected.admin.COUPONS)}
          >
            <iconsLib.arrowLeft className="h-4 w-4" />
            {t(AppLocales.Admin.Common.Actions.Back)}
          </Button>
        }
      />

      <AdminRedemptionsTable />
    </div>
  );
};

export default AdminUserCouponsPage;
