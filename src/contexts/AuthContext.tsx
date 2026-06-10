import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useReducer,
} from "react";
import { useAtom } from "jotai";
import { IUser } from "../models/user.model";
import atoms from "../atoms";
import {
  TGoogleSsoAction,
  IGoogleSsoState,
  googleSsoStateReducer,
  initialGoogleSsoState,
} from "../reducers/googleSso.reducer";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: IUser | null;
  googleSsoState: IGoogleSsoState;
  setCurrentUser: (user: IUser | null) => void;
  signin: (token: string, user: IUser) => void;
  signout: () => void;
  dispatchGoogleSsoAction: (action: TGoogleSsoAction) => void;
}

const fallbackAuthContext: AuthContextType = {
  isAuthenticated: false,
  token: null,
  currentUser: null,
  googleSsoState: initialGoogleSsoState,
  setCurrentUser: () => {},
  signin: () => {},
  signout: () => {},
  dispatchGoogleSsoAction: () => {},
};

let hasWarnedMissingAuthProvider = false;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem("token");
  if (!raw) return null;

  // Support both atomWithStorage JSON and legacy raw string values.
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" && parsed.trim() ? parsed : null;
  } catch {
    return raw.trim() ? raw : null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useAtom(atoms.tokenAtom);
  const [currentUser, setCurrentUser] = useAtom(atoms.currentUserAtom);
  const [googleSsoState, dispatchGoogleSsoAction] = useReducer(
    googleSsoStateReducer,
    initialGoogleSsoState,
  );

  const hydratedToken = token || readStoredToken();
  const isAuthenticated = !!hydratedToken;

  useEffect(() => {
    if (!token && hydratedToken) {
      setToken(hydratedToken);
    }
  }, [hydratedToken, setToken, token]);

  const signin = useCallback(
    (token: string, user: IUser) => {
      setToken(token);
      setCurrentUser(user);
      dispatchGoogleSsoAction({ type: "VERIFY_GOOGLE_SUCCESS_AUTHENTICATED" });
    },
    [setToken, setCurrentUser],
  );

  const signout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    dispatchGoogleSsoAction({ type: "RESET" });
  }, [setToken, setCurrentUser]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      token: hydratedToken,
      currentUser,
      googleSsoState,
      setCurrentUser,
      signin,
      signout,
      dispatchGoogleSsoAction,
    }),
    [
      isAuthenticated,
      hydratedToken,
      currentUser,
      googleSsoState,
      setCurrentUser,
      signin,
      signout,
      dispatchGoogleSsoAction,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    if (
      !hasWarnedMissingAuthProvider &&
      typeof console !== "undefined"
    ) {
      hasWarnedMissingAuthProvider = true;
      console.warn(
        "useAuth called outside AuthProvider; using fallback context.",
      );
    }
    return fallbackAuthContext;
  }
  return context;
};
