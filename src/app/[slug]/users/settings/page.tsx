"use client";

import SettingsSection from "@/components/settings/SettingsSection";
import { useTheme } from "@/components/ThemeProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch, BranchResponse } from "@/types/branch";
import { Role, RoleResponse } from "@/types/role";
import { Service, ServiceResponse } from "@/types/service";
import { User, UserResponse } from "@/types/user";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BranchSettingsList from "./BranchSettingsList";
import OrganizationSettings from "./OrganizationSettings";
import ServiceSettingsList from "./ServiceSettingsList";
import UserSettingsList from "./UserSettingsList";

const SettingsPage = () => {
  const { theme } = useTheme();
  const { data, slug } = useOrganization();
  const { userData } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const containerBg =
    theme === "dark"
      ? "bg-[#111827] hover:bg-gray-300/10"
      : "bg-gray-300 hover:bg-[#111827] hover:text-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const shadow =
    theme === "dark"
      ? "shadow-[0_0_12px_rgba(61,217,235,0.2)]"
      : "shadow-[0_4px_12px_rgba(61,217,235,0.1)]";

  useEffect(() => {
    const fetchData = async () => {
      const servicesParams = new URLSearchParams();
      const usersParams = new URLSearchParams();
      const branchesParams = new URLSearchParams();
      const roesParams = new URLSearchParams();

      if (data?.id) {
        servicesParams.set("organization_id", String(data?.id));
        usersParams.set("organization_id", String(data?.id));
        branchesParams.set("organization_id", String(data?.id));
        roesParams.set("organization_id", String(data?.id));
      }

      if (userData?.role?.name !== "admin") {
        servicesParams.set("branch_id", String(userData?.branch_id));
        branchesParams.set("id", String(userData?.branch_id));
        usersParams.set("branch_id", String(userData?.branch_id));
        usersParams.set("id", String(userData?.id));
        roesParams.set("id", String(userData?.role?.id));
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
              branchesParams
            ) as Promise<BranchResponse>,
            httpInternalApi.httpGetPublic(
              "/roles",
              roesParams
            ) as Promise<RoleResponse>,
          ]);
        setServices(servicesRes.services);
        setUsers(usersRes.users);
        setBranches(branchesRes.branches);
        setRoles(rolesRes.roles);
        setIsAdmin(userData?.role?.name === "admin");
      } catch (error) {
        console.error("Error al cargar servicios y usuarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data?.id, userData?.branch_id, userData?.id, userData?.role?.id, userData?.role?.name]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="w-full py-4 max-w-5xl mx-auto">
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
      <div className="w-full max-w-5xl mx-auto flex justify-end px-2 mt-8 mb-6">
        <Link
          href={`/${slug}/auth/change-password`}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition sm:px-3 sm:py-2 sm:text-sm ${borderColor} ${containerBg} ${shadow}`}
        >
          <KeyRound className="w-5 h-5" />
          <span className="hidden sm:inline">Cambiar contraseña</span>
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;
