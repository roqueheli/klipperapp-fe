"use client";

import httpInternalApi from "@/lib/common/http.internal.service";
import { User } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  userData: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export function UserProvider({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: User | null;
}) {
  const [state, setState] = useState<UserContextType>({
    userData, // Usamos los datos iniciales del servidor
    loading: !userData, // Si no hay datos iniciales, cargamos
    error: null,
    refresh: async () => {},
  });

  // Efecto para manejar la hidratación
  useEffect(() => {
    // Si tenemos datos iniciales, no necesitamos recargar
    if (userData) return;

    const loadData = async () => {
      try {
        const userData = await httpInternalApi.httpGetPublic<User>("/auth/me");
        setState((prev) => ({
          ...prev,
          userData,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: "Failed to load user data " + err,
          loading: false,
        }));
      }
    };

    loadData();
  }, [userData]);

  const refresh = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const userData = await httpInternalApi.httpGetPublic<User>("/auth/me");
      setState({
        userData,
        loading: false,
        error: null,
        refresh,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to refresh user data " + err,
        loading: false,
      }));
    }
  };

  return <UserContext.Provider value={{ ...state, refresh }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
