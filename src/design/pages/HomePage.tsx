import { SignOutButton, Button } from "../components";
import { LayoutPage } from "./LayoutPage";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { LogController } from "../../modules/log";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // === Test: Trigger a frontend rendering error ===
  const triggerFrontendError = () => {
    // This will cause a runtime error (cannot read property of undefined)
    const obj: any = undefined;
    console.log(obj.someProperty); // Uncaught TypeError
  };

  // === Test: Trigger an API error (should NOT be logged) ===
  const triggerApiError = async () => {
    try {
      await fetch("/v1/nonexistent-endpoint");
    } catch {
      // This error will have "fetch" in stack trace → filtered out
    }
  };

  // === Test: Storage issue (optional) ===
  const triggerStorageIssue = () => {
    // 🚨 This will be caught by the fixed AtomService
    localStorage.setItem("invalid_json", "{not valid}");
    // The next time AtomService loads, it will remove this entry
    LogController.logStorageIssue(
      "invalid_json",
      "valid JSON",
      localStorage.getItem("invalid_json"),
      { component: "HomePage" },
    );
  };

  return (
    <LayoutPage>
      <div className="space-y-4">
        <Button
          variant="secondary"
          onClick={() => navigate(AppRoutes.client.protected.PAYMENT)}
        >
          💳 View Plans & Pricing
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate(AppRoutes.client.protected.AI)}
        >
          🤖 AI Assistant
        </Button>

        {/* TEST BUTTONS – remove after verification */}
        <div className="border border-dashed border-gray-400 p-4 space-y-2">
          <p className="text-sm text-gray-500">
            🧪 Test Logging (remove later)
          </p>
          <Button variant="primary" onClick={triggerFrontendError}>
            🔥 Trigger FE Error (should log)
          </Button>
          <Button variant="primary" onClick={triggerApiError}>
            🌐 Trigger API Error (should NOT log)
          </Button>
          <Button variant="primary" onClick={triggerStorageIssue}>
            💾 Trigger Storage Issue (should log)
          </Button>
        </div>

        <SignOutButton />
      </div>
    </LayoutPage>
  );
};

// Example usage for pagination api calls

// Admin.UserController.getUsers(
//   { page: 1, limit: 20 },

//   (users, pagination) => {
//     console.log("users ===>", users);
//     console.log("pagination ===>", pagination);
//   },

//   (error) => {
//     console.log("error ===> ", error);
//   },
// );

// Example usage for assets and localization

// import { icons, images, videos } from "../../assets";
// import { AppLocales } from "../../locales/app_locales";
// import { useTranslation } from "react-i18next";
// const { t } = useTranslation();
/* {<Image asset={icons.instagram} className="w-8" />}
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
  /> */
