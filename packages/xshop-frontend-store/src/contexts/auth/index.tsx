"use client";
import { createContext, useContext, useEffect, useState } from "react";

import { User } from "../../generated/graphql";
import { getMe } from "@/requests/auth.client";
import { getToken } from "@/utils/auth.client";

interface AuthContextType {
  token?: string;
  me?: User;
  loading: boolean;
  reload: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = getToken();
  const [me, setMe] = useState<User>();
  const [loading, setLoading] = useState(true);

  const loadMe = () => {
    getMe()
      .then((res) => {
        if (res.errors) {
          throw new Error("Failed to fetch user info");
        }
        setMe(res.data?.me);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log("token", token);
    if (!token) {
      setLoading(false);
      return;
    }
    loadMe();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        me,
        loading,
        reload: loadMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
