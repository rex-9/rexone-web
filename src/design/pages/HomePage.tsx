import { SignOutButton, Button } from "../components";
import { LayoutPage } from "./LayoutPage";
// import { useAuth } from "../../contexts";
// import { icons, images, videos } from "../../assets";
// import { AppLocales } from "../../locales/app_locales";
// import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
// import { useEffect } from "react";
// import { UserController } from "../../controllers";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // const { currentUser } = useAuth();
  // const { t } = useTranslation();

  // No need just for the sample
  // useEffect(() => {
  //   // if (currentUser) return;

  //   // UserController.getCurrentUser(setCurrentUser);
  //   UserController.getUsers(
  //     { page: 1, limit: 20 },

  //     (users, pagination) => {
  //       console.log("users ===>", users);
  //       console.log("pagination ===>", pagination);
  //     },

  //     (error) => {
  //       console.log("error ===> ", error);
  //     },
  //   );
  // }, []);

  return (
    <LayoutPage>
      {/* Payment Section */}
      <Button
        variant="secondary"
        onClick={() => navigate(AppRoutes.client.protected.PAYMENT)}
      >
        💳 View Plans & Pricing
      </Button>

      {/* AI Chat Section */}
      <Button
        variant="secondary"
        onClick={() => navigate(AppRoutes.client.protected.AI)}
      >
        🤖 AI Assistant
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
