"use client";

import httpInternalApi from "@/lib/common/http.internal.service";
import { Organization } from "@/types/organization";
import { createContext, useContext, useEffect, useState } from "react";

interface OrganizationContextType {
  data: Organization | null;
  slug: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType>({
  data: null,
  slug: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export function OrganizationProvider({
  children,
  initialData,
  slug,
}: {
  children: React.ReactNode;
  initialData: Organization | null;
  slug: string;
}) {
  const [state, setState] = useState<OrganizationContextType>({
    data: initialData, // Usamos los datos iniciales del servidor
    slug,
    loading: !initialData, // Si no hay datos iniciales, cargamos
    error: null,
    refresh: async () => {},
  });

  // Efecto para manejar la hidratación
  useEffect(() => {
    // Si tenemos datos iniciales, no necesitamos recargar
    if (initialData) return;

    const loadData = async () => {
      try {
        const data = await httpInternalApi.httpGetPublic<Organization>("/organizations", new URLSearchParams({slug}));
       
        setState((prev) => ({
          ...prev,
          data,
          loading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: "Failed to load organization data",
          loading: false,
        }));
      }
    };

    loadData();
  }, [slug, initialData]);

  const refresh = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await httpInternalApi.httpGetPublic<Organization>("/organizations", new URLSearchParams({slug}));
    
      setState({
        data,
        slug,
        loading: false,
        error: null,
        refresh,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to refresh data",
        loading: false,
      }));
    }
  };

  // Actualizamos la función refresh en el estado
  useEffect(() => {
    setState((prev) => ({ ...prev, refresh }));
  }, [slug]);

  return (
    <OrganizationContext.Provider value={state}>
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganization = () => useContext(OrganizationContext);
