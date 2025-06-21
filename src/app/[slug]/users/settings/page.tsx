"use client";

import SettingsSection from "@/components/settings/SettingsSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch, BranchResponse } from "@/types/branch";
import { Service, ServiceResponse } from "@/types/service";
import { User, UserResponse } from "@/types/user";
import { useEffect, useState } from "react";
import BranchSettingsList from "./BranchSettingsList";
import ConfigurationSettings from "./ConfigurationSettings";
import ServiceSettingsList from "./ServiceSettingsList";
import UserSettingsList from "./UserSettingsList";

const SettingsPage = () => {
  const { data } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const servicesParams = new URLSearchParams();
      if (data?.id) {
        servicesParams.set("organization_id", String(data?.id));
      }

      try {
        setIsLoading(true);
        const [servicesRes, usersRes, branchesRes] = await Promise.all([
          httpInternalApi.httpGetPublic(
            "/services",
            servicesParams
          ) as Promise<ServiceResponse>,
          httpInternalApi.httpGetPublic(
            "/users",
            servicesParams
          ) as Promise<UserResponse>,
          httpInternalApi.httpGetPublic(
            "/branches",
            servicesParams
          ) as Promise<BranchResponse>,
        ]);
        setServices(servicesRes.services);
        setUsers(usersRes.users);
        setBranches(branchesRes.branches);
      } catch (error) {
        console.error("Error al cargar servicios y usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data?.id]);

  console.log("Servicios iniciales:", services);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen w-full py-4 max-w-5xl mx-auto">
      <h1 className="w-full flex items-center text-3xl font-bold justify-start mb-6">
        Configuraciones
      </h1>
      <SettingsSection title="Configuración de la Organización">
        <ConfigurationSettings />
      </SettingsSection>

      <SettingsSection title="Configuración de Sucursales">
        <BranchSettingsList initialBranches={branches} />
      </SettingsSection>

      <SettingsSection title="Configuración Servicios">
        <ServiceSettingsList initialServices={services} />
      </SettingsSection>

      <SettingsSection title="Configuración de Usuarios">
        <UserSettingsList initialUsers={users} />
      </SettingsSection>
    </div>
  );
};

export default SettingsPage;
