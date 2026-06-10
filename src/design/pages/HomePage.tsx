import { SignOutBtn, VideoPlayer, Asset, Typography } from "../molecules";
import LayoutPage from "./LayoutPage";
import { useAuth } from "../../contexts";
import assets from "../../assets";
import { AppLocales } from "../../locales/app_locales";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { userController } from "../../controllers";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import Button from "../molecules/Button";

const HomePage: React.FC = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
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
      {<Asset asset={assets.icons.asset.insta} className="w-8" />}
      {<Asset asset={assets.images.banner} className="w-96" />}
      <Typography className="text-xl font-bold" variant="primary">
        {t(AppLocales.Home)}
      </Typography>
      <Button onClick={() => navigate(AppRoutes.client.public.PAYMENT)}>
        Pay Now
      </Button>
      {currentUser && <p>Welcome, {currentUser.email}!</p>}
      <VideoPlayer
        video={assets.videos.sample}
        controls={true}
        autoplay={false}
        muted={false}
        className="w-96"
        // width="640px"
        // height="360px"
      />
      <SignOutBtn />
    </LayoutPage>
  );
};

export default HomePage;
