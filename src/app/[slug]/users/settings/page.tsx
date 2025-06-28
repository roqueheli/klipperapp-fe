"use client";

import SettingsSection from "@/components/settings/SettingsSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch, BranchResponse } from "@/types/branch";
import { Role, RoleResponse } from "@/types/role";
import { Service, ServiceResponse } from "@/types/service";
import { User, UserResponse } from "@/types/user";
import { getRoleByName } from "@/utils/roleUtils";
import { useEffect, useState } from "react";
import BranchSettingsList from "./BranchSettingsList";
import OrganizationSettings from "./OrganizationSettings";
import ServiceSettingsList from "./ServiceSettingsList";
import UserSettingsList from "./UserSettingsList";

const SettingsPage = () => {
  const { data } = useOrganization();
  const { userData } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const agentRole = await getRoleByName("admin");
      setIsAdmin(agentRole.id === userData?.role?.id);

      const servicesParams = new URLSearchParams();
      const usersParams = new URLSearchParams();

      if (data?.id) {
        servicesParams.set("organization_id", String(data?.id));
        usersParams.set("organization_id", String(data?.id));
      }

      if (agentRole.id !== userData?.role?.id) {
        servicesParams.set("branch_id", String(userData?.branch_id));
        usersParams.set("branch_id", String(userData?.branch_id));
        usersParams.set("id", String(userData?.id));
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
              usersParams
            ) as Promise<UserResponse>,
            httpInternalApi.httpGetPublic(
              "/branches",
              servicesParams
            ) as Promise<BranchResponse>,
            httpInternalApi.httpGetPublic(
              "/roles",
              usersParams
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
        ⚙️ Configuraciones
      </h1>

      {isAdmin && (
        <>
          <SettingsSection title="Configuración de la Organización">
            <OrganizationSettings />
          </SettingsSection>

          <SettingsSection title="Configuración de Sucursales">
            <BranchSettingsList
              initialBranches={branches || []}
              organization_id={data?.id || 0}
            />
          </SettingsSection>

          <SettingsSection title="Configuración Servicios">
            <ServiceSettingsList
              initialServices={services || []}
              organization_id={data?.id || 0}
            />
          </SettingsSection>
        </>
      )}

      <SettingsSection title="Configuración de Usuarios">
        <UserSettingsList
          initialUsers={users || []}
          branches={branches || []}
          roles={roles || []}
          organization_id={data?.id || 0}
          isAdmin={isAdmin}
        />
      </SettingsSection>
    </div>
  );
};

export default SettingsPage;
