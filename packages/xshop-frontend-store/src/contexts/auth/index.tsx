"use client";
import { createContext, useContext } from "react";

import { User } from "../../generated/graphql";

interface AuthContextType {
  token?: string;
  me?: User;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider: React.FC<{
  initialState: AuthContextType;
  children: React.ReactNode;
}> = ({ initialState, children }) => {
  return (
    <AuthContext.Provider value={initialState}>{children}</AuthContext.Provider>
  );
};
