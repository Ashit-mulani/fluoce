"use client";

import { Spinner } from "@/components/ui/spinner";
import { useGetMe } from "@/hooks/tanstack/auth-tanstack";
import { authUrl, filesboxUrl } from "@/utils/const";
import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { isPending } = useGetMe();
  const { user } = useSelector((state) => state.user);

  if (isPending) {
    return null;
  }

  if (!user) {
    window.location.href = `${authUrl}/auth?ref=${filesboxUrl}/dashboard`;
  }

  return (
    <AuthContext.Provider value={{ isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
