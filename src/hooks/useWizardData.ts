import httpInternalApi from "@/lib/common/http.internal.service";
import { ServiceResponse } from "@/types/service";
import { UserResponse } from "@/types/user";
import { getRoleByName } from "@/utils/roleUtils";
import { useEffect, useState, useCallback } from "react";

export const useWizardData = (organizationId?: number, branchId?: number) => {
  const [users, setUsers] = useState<UserResponse>();
  const [services, setServices] = useState<ServiceResponse>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!organizationId || !branchId) return;

    const agentRole = await getRoleByName("agent");

    const params = new URLSearchParams({
      organization_id: String(organizationId),
      branch_id: String(branchId),
      role_id: String(agentRole.id),
    });

    try {
      setIsLoading(true);
      const [servicesRes, usersRes] = await Promise.all([
        httpInternalApi.httpGetPublic("/services", params),
        httpInternalApi.httpGetPublic("/users/working_today", params),
      ]);
      setServices(servicesRes as ServiceResponse);
      setUsers(usersRes as UserResponse);
    } catch (error) {
      console.error("Error fetching wizard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, branchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { users, services, isLoading };
};
