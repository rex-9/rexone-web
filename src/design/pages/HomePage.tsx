import { SignOutButton, Button } from "../components";
import { LayoutPage } from "./LayoutPage";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { DevTestButtons } from "../../modules/log/components/DevTestButtons";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <LayoutPage>
      <div className="w-full max-w-sm space-y-16">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate(AppRoutes.client.protected.PAYMENT)}
        >
          💳 View Plans & Pricing
        </Button>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate(AppRoutes.client.protected.AI)}
        >
          🤖 AI Assistant
        </Button>

        <DevTestButtons />

        <SignOutButton />
      </div>
    </LayoutPage>
  );
};
