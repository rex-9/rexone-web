import React from "react";
import AppRoutes from "../../AppRoutes";
import { TextLink } from "../";
import { useAuth } from "../../contexts";
import { AppLocales } from "../../locales";

export const NotFoundPage: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-h2 font-display font-semibold text-base-content">
        404 Not Found
      </h1>
      <TextLink
        to={
          token
            ? AppRoutes.client.protected.HOME
            : AppRoutes.client.public.SIGN_IN
        }
        label={AppLocales.Common.GoBack}
      />
    </div>
  );
};

export default NotFoundPage;
