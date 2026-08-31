import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

interface ILoadingContextProps {
  isLoading: boolean;
  isOverlayLoading: boolean;
  setLoading: (loading: boolean, options?: { overlay?: boolean }) => void;
}

const LoadingContext = createContext<ILoadingContextProps | undefined>(
  undefined
);

const LOADING_RESET_DELAY_MS = 50;

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOverlayLoading, setIsOverlayLoading] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);
  const loadingModeRef = useRef<"overlay" | "inline" | null>(null);

  const clearResetTimeout = useCallback(() => {
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  }, []);

  const setLoading = useCallback(
    (loading: boolean, options?: { overlay?: boolean }) => {
      clearResetTimeout();

      if (loading) {
        const useOverlay =
          options?.overlay ?? loadingModeRef.current !== "inline";

        loadingModeRef.current = useOverlay ? "overlay" : "inline";
        setIsLoading(true);
        setIsOverlayLoading(useOverlay);
        return;
      }

      resetTimeoutRef.current = window.setTimeout(() => {
        resetTimeoutRef.current = null;
        loadingModeRef.current = null;
        setIsLoading(false);
        setIsOverlayLoading(false);
      }, LOADING_RESET_DELAY_MS);
    },
    [clearResetTimeout],
  );

  useEffect(() => clearResetTimeout, [clearResetTimeout]);

  const value = useMemo(
    () => ({ isLoading, isOverlayLoading, setLoading }),
    [isLoading, isOverlayLoading, setLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): ILoadingContextProps => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
