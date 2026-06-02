import React from "react";
import { LoadingOverlay } from "./design";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppConfig from "./AppConfig";
import { AuthProvider, LoadingProvider } from "./contexts";
import { RouteManager } from "./routes";
import { MarkerProvider } from "./modules/anapana/contexts";
import { ToastProvider } from "./contexts/ToastContext";

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={AppConfig.GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <LoadingProvider>
          <ToastProvider>
            {/* // ANAPANA MODULE */}
            <MarkerProvider>
              <LoadingOverlay />
              <RouteManager />
            </MarkerProvider>
          </ToastProvider>
        </LoadingProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
