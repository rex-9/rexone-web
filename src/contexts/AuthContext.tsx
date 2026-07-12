// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
  useState,
} from "react";
import { useAtom } from "jotai";
import { IUser } from "../models/user.model";
import atoms from "../atoms";

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

  const isAuthenticated = !!token;

  const signin = useCallback(
    (token: string, user: IUser) => {
      setToken(token);
      setCurrentUser(user);
      setGoogleChallengeToken(null);
    },
    [setToken, setCurrentUser],
  );

  const signout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    setGoogleChallengeToken(null);
  }, [setToken, setCurrentUser]);

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
