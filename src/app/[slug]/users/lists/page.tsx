"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { pusherClient } from "@/lib/pusher/pusher.client";
import { Service, ServiceResponse } from "@/types/service";
import { User, UserResponse, UserWithProfiles } from "@/types/user";
import { getRoleByName } from "@/utils/roleUtils";
import { startTransition, useCallback, useEffect, useState } from "react";
import AttendanceListsPageContainer from "./AttendanceListsPageContainer";

export default function AttendanceListsPage() {
  const { data } = useOrganization();
  const { userData } = useUser();

  const [isAgent, setIsAgent] = useState<User>();
  const [isEmpty, setIsEmpty] = useState(false);
  const [users, setUsers] = useState<UserWithProfiles[]>([]);
  const [queue, setQueue] = useState<User[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsersWithProfiles = useCallback(async () => {
    try {
      const agentRole = await getRoleByName("agent");

      const attendancesParams = new URLSearchParams({
        organization_id: String(data?.id),
        role_id: String(agentRole.id),
        branch_id: String(userData?.branch_id || 1),
      });

      const usersRes = await httpInternalApi.httpGetPublic(
        "/attendances/by_users_working_today",
        attendancesParams
      );

      setUsers(usersRes as UserWithProfiles[]);
    } catch (error) {
      console.error("Error al cargar usuarios con perfiles:", error);
    }
  }, [data?.id, userData?.branch_id]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Validaciones mínimas
      if (!userData?.role?.id || !data?.id) return;

      const agentRole = await getRoleByName("agent");

      if (userData.role.name === "agent") setIsAgent(userData);

      const usersParams = new URLSearchParams({
        organization_id: String(data.id),
        role_id: String(agentRole.id),
      });

      const servicesParams = new URLSearchParams({
        organization_id: String(data.id),
      });

      if (userData.branch_id) {
        usersParams.set("branch_id", String(userData.branch_id));
      }

      const [workingTodayUsers, queueRes, servicesRes] = await Promise.all([
        httpInternalApi.httpGetPublic(
          "/users/working_today",
          usersParams
        ) as Promise<UserResponse>,
        httpInternalApi.httpGetPublic("/attendances/by_users_queue"),
        httpInternalApi.httpGetPublic(
          "/services/",
          servicesParams
        ) as Promise<ServiceResponse>,
      ]);

      setIsEmpty(workingTodayUsers.users.length === 0);
      startTransition(async () => {
        setQueue(queueRes as User[]);
        await fetchUsersWithProfiles();
        setFilteredServices(servicesRes.services);
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQueue = useCallback(async () => {
    try {
      const queueRes = await httpInternalApi.httpGetPublic(
        "/attendances/by_users_queue"
      );
      const queueData = queueRes as User[];
      setQueue(queueData);
    } catch (error) {
      console.error("Error al cargar la queue:", error);
    }
  }, []);

  useEffect(() => {
    const channel = pusherClient?.subscribe("attendance_channel");

    channel?.bind("attendance", function () {
      fetchUsersWithProfiles();
      fetchQueue();
    });

    return () => {
      // 🔒 Limpieza al desmontar
      channel?.unbind_all();
      channel?.unsubscribe();
    };
  }, [fetchQueue, fetchUsersWithProfiles]);

  useEffect(() => {
    loadData();
  }, []);

  const hasPostponed = users.some((user) =>
    user.profiles.some((profile) => profile.status === "postponed")
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <AttendanceListsPageContainer
        isWorkingTodayEmpty={isEmpty}
        isAgent={isAgent}
        users={users}
        queue={queue}
        filteredServices={filteredServices}
        hasPostponed={hasPostponed}
      />
    </>
  );
}
