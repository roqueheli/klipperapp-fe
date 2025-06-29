"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { UserResponse } from "@/types/user";
import { getRoleByName } from "@/utils/roleUtils";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";

export default function SidebarContainer({ token }: { token?: string }) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes("/auth/login");
  const { data } = useOrganization();
  const { userData } = useUser();
  const [isEmpty, setIsEmpty] = useState(false);

  const readyToFetch = useMemo(() => {
    return !!data?.id && !!userData?.branch_id;
  }, [data?.id, userData?.branch_id]);

  useEffect(() => {
    if (!readyToFetch) return;
    const fetchData = async () => {
      const usersParams = new URLSearchParams();
      const agentRole = await getRoleByName("agent");

      if (data?.id !== undefined) {
        usersParams.set("organization_id", String(data.id));
        usersParams.set("role_id", String(agentRole?.id));
      }

      if (userData?.branch_id !== undefined) {
        usersParams.set("branch_id", String(userData.branch_id));
      }

      try {
        const workingUsers = (await httpInternalApi.httpGetPublic(
          "/users/working_today",
          usersParams
        )) as UserResponse;
        setIsEmpty(workingUsers.users.length === 0);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    fetchData();
  }, [readyToFetch]);

  if (isLoginPage) return null;

  return <Sidebar token={token} isWorkingTodayEmpty={isEmpty} />;
}
