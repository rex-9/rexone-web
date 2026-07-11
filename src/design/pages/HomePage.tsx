import { SignOutBtn, Video, Image, Typography } from "../components";
import LayoutPage from "./LayoutPage";
import { useAuth } from "../../contexts";
import { icons, images, videos } from "../../assets";
import { AppLocales } from "../../locales/app_locales";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { userController } from "../../controllers";

const HomePage: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { t } = useTranslation();
  const hasFetchedCurrentUserRef = useRef(false);

  // No need just for the sample
  useEffect(() => {
    if (currentUser || hasFetchedCurrentUserRef.current) return;

    hasFetchedCurrentUserRef.current = true;
    userController.getCurrentUser(setCurrentUser);
  }, [currentUser, setCurrentUser]);

  return (
    <LayoutPage>
      {<Image asset={icons.instagram} className="w-8" />}
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
      />
      <SignOutBtn />
    </LayoutPage>
  );
};

export default HomePage;
