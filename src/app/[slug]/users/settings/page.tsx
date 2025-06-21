"use client";

import SettingsSection from "@/components/settings/SettingsSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch, BranchResponse } from "@/types/branch";
import { Role, RoleResponse } from "@/types/role";
import { Service, ServiceResponse } from "@/types/service";
import { User, UserResponse } from "@/types/user";
import { useEffect, useState } from "react";
import BranchSettingsList from "./BranchSettingsList";
import OrganizationSettings from "./OrganizationSettings";
import ServiceSettingsList from "./ServiceSettingsList";
import UserSettingsList from "./UserSettingsList";

const SettingsPage = () => {
  const { data } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const servicesParams = new URLSearchParams();
      if (data?.id) {
        servicesParams.set("organization_id", String(data?.id));
      }

      try {
        setIsLoading(true);
        const [servicesRes, usersRes, branchesRes, rolesRes] =
          await Promise.all([
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
            httpInternalApi.httpGetPublic(
              "/roles",
              servicesParams
            ) as Promise<RoleResponse>,
          ]);
        setServices(servicesRes.services);
        setUsers(usersRes.users);
        setBranches(branchesRes.branches);
        setRoles(rolesRes.roles);
      } catch (error) {
        console.error("Error al cargar servicios y usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data?.id]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen w-full py-4 max-w-5xl mx-auto">
      <h1 className="w-full flex items-center text-3xl font-bold justify-start mb-6">
        Configuraciones
      </h1>
      <SettingsSection title="Configuración de la Organización">
        <OrganizationSettings />
      </SettingsSection>

      <SettingsSection title="Configuración de Sucursales">
        <BranchSettingsList initialBranches={branches} organization_id={data?.id || 0} />
      </SettingsSection>

      <SettingsSection title="Configuración Servicios">
        <ServiceSettingsList initialServices={services} organization_id={data?.id || 0} />
      </SettingsSection>

      <SettingsSection title="Configuración de Usuarios">
        <UserSettingsList
          initialUsers={users}
          branches={branches}
          roles={roles}
          organization_id={data?.id || 0}
        />
      </SettingsSection>
    </div>
  );
};

export default SettingsPage;
