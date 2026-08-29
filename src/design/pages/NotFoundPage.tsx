import AppRoutes from "../../AppRoutes";
import { TextLink } from "../";
import { useAuth } from "../../contexts";
import { LayoutPage } from "./LayoutPage";
import { AppLocales } from "../../locales";

export const NotFoundPage: React.FC = () => {
  const { token } = useAuth();

  return (
    <LayoutPage>
      404 Not Found
      <TextLink
        to={
          token
            ? AppRoutes.client.protected.HOME
            : AppRoutes.client.public.SIGN_IN
        }
        label={AppLocales.Common.GoBack}
      />
    </LayoutPage>
  );
};
