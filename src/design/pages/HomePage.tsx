import { SignOutButton, Button } from "../components";
import { PageLayout } from "./PageLayout";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../AppRoutes";
import { DevTestButtons } from "../../modules/log/components/DevTestButtons";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
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
    </PageLayout>
  );
};
