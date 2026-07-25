import { SignOutButton, Button } from "../components";
import { LayoutPage } from "./LayoutPage";
// import { useAuth } from "../../contexts";
// import { icons, images, videos } from "../../assets";
// import { AppLocales } from "../../locales/app_locales";
// import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // const { currentUser } = useAuth();
  // const { t } = useTranslation();

  // No need just for the sample
  // useEffect(() => {
  //   if (currentUser) return;

  //   userController.getCurrentUser(setCurrentUser);
  // }, [currentUser, setCurrentUser]);

  return (
    <LayoutPage>
      {/* Payment Section */}
      <Button
        variant="primary"
        onClick={() => navigate(AppRoutes.client.protected.PAYMENT)}
        className="mt-4"
      >
        💳 View Plans & Pricing
      </Button>
      {/* {<Image asset={icons.instagram} className="w-8" />}
      {<Image asset={images.banner} className="w-96" />}
      <Typography className="text-xl font-bold" variant="primary">
        {t(AppLocales.Home)}
      </Typography>
      {currentUser && <p>Welcome, {currentUser.email}!</p>}
      <Video
        asset={videos.sample}
        controls={true}
        autoplay={false}
        muted={false}
        className="w-96"
      /> */}
      <SignOutButton />
    </LayoutPage>
  );
};
