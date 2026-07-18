"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { setApiSessionToken } from "@/lib/api";

interface AuthContextType {
  session: any;
  loading: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: "user" | "admin";
  } | null;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending } = useSession();

  // Sync session token into the api.ts store so every Express API call
  // automatically includes Authorization: Bearer <token>
  useEffect(() => {
    const token = (sessionData?.session as any)?.token || null;
    setApiSessionToken(token);
  }, [sessionData]);

  const user = sessionData?.user
    ? {
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        image: sessionData.user.image || undefined,
        role: (sessionData.user.role as "user" | "admin") || "user",
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        session: sessionData,
        loading: isPending,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
