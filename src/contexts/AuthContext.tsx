// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useAtom } from "jotai";
import { IUser } from "../models/user.model";
import atoms from "../atoms";
import { isTokenExpired } from "../helpers";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  signin: (token: string, user: IUser) => void;
  signout: () => void;
  googleChallengeToken: string | null;
  setGoogleChallengeToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useAtom(atoms.tokenAtom);
  const [currentUser, setCurrentUser] = useAtom(atoms.currentUserAtom);
  const [googleChallengeToken, setGoogleChallengeToken] = useState<
    string | null
  >(null);

  // Check if authenticated using token expiry from JWT
  const isAuthenticated = useMemo(() => {
    if (!token) return false;
    return !isTokenExpired(token);
  }, [token]);

  // Auto-check token expiry on app load and when token changes
  useEffect(() => {
    // console.log("token ===> ", isTokenExpired(token!));
    if (token && isTokenExpired(token)) {
      console.log("Token expired, signing out...");
      signout();
    }
  }, [token]);

  // Also check expiry periodically (every 60 seconds)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        console.log("Token expired during session, signing out...");
        signout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [token]);

  const signin = useCallback(
    (token: string, user: IUser) => {
      setToken(token);
      setCurrentUser(user);
      setGoogleChallengeToken(null);
    },
    [setToken, setCurrentUser, setGoogleChallengeToken],
  );

  const signout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    setGoogleChallengeToken(null);
  }, [setToken, setCurrentUser, setGoogleChallengeToken]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      currentUser,
      setCurrentUser,
      signin,
      signout,
      googleChallengeToken,
      setGoogleChallengeToken,
    }),
    [
      isAuthenticated,
      token,
      currentUser,
      signin,
      signout,
      googleChallengeToken,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
