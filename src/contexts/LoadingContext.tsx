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

interface LoadingContextProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);

const LOADING_RESET_DELAY_MS = 50;

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);

  const clearResetTimeout = useCallback(() => {
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  }, []);

  const setLoading = useCallback(
    (loading: boolean) => {
      clearResetTimeout();

      if (loading) {
        setIsLoading(true);
        return;
      }

      resetTimeoutRef.current = window.setTimeout(() => {
        resetTimeoutRef.current = null;
        setIsLoading(false);
      }, LOADING_RESET_DELAY_MS);
    },
    [clearResetTimeout],
  );

  useEffect(() => clearResetTimeout, [clearResetTimeout]);

  const value = useMemo(
    () => ({ isLoading, setLoading }),
    [isLoading, setLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextProps => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
