import React from "react";
import { LoadingOverlay } from "./design";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppConfig from "./AppConfig";
import { AuthProvider, ErrorBoundary, LoadingProvider } from "./contexts";
import { RouteManager } from "./routes";
import { MarkerProvider } from "./modules/anapana/contexts";
import { ToastProvider } from "./contexts/ToastContext";
import { useTheme } from "./hooks";

const App: React.FC = () => {
  useTheme();

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={AppConfig.GOOGLE_CLIENT_ID}>
        <LoadingProvider>
          <AuthProvider>
            <ToastProvider>
              {/* // ANAPANA MODULE */}
              <MarkerProvider>
                <LoadingOverlay />
                <RouteManager />
              </MarkerProvider>
            </ToastProvider>
          </AuthProvider>
        </LoadingProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
};

export default App;
