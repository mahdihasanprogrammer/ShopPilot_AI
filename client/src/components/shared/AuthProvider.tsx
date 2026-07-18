"use client";

import React, { createContext, useContext } from "react";
import { useSession } from "@/lib/auth-client";

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
