import React from "react";
import { LoadingOverlay } from "./design";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import AppConfig from "./AppConfig";
import { AuthProvider, ErrorBoundary, LoadingProvider } from "./contexts";
import { RouteManager } from "./routes";
import { MarkerProvider } from "./modules/anapana/contexts";
import { ToastProvider } from "./contexts/ToastContext";
import { useTheme } from "./hooks";
import { queryClient, idbPersister } from "./services";

const App: React.FC = () => {
  useTheme();

  return (
    <ErrorBoundary>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: idbPersister }}
      >
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
      </PersistQueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
