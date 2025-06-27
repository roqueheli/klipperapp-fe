"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Role } from "@/types/role";
import { Service, ServiceResponse } from "@/types/service";
import { User, UserResponse, UserWithProfiles } from "@/types/user";
import { getRoleByName } from "@/utils/roleUtils";
import { startTransition, useCallback, useEffect, useState } from "react";
import AttendanceListsPageContainer from "./AttendanceListsPageContainer";

export default function AttendanceListsPage() {
  const { data } = useOrganization();
  const { userData } = useUser();

  const [role, setRole] = useState<Role>();
  const [isAgent, setIsAgent] = useState<User>();
  const [isEmpty, setIsEmpty] = useState(false);
  const [users, setUsers] = useState<UserWithProfiles[]>([]);
  const [queue, setQueue] = useState<User[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    try {
      const queueRes = await httpInternalApi.httpGetPublic(
        "/attendances/by_users_queue"
      );
      setQueue(queueRes as User[]);
    } catch (error) {
      console.error("Error al cargar la queue:", error);
    }
  }, []);

  const updateAttendanceStatus = (
    userId: number,
    attId: number,
    status: "pending" | "processing" | "finished" | "postponed" | "canceled"
  ) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.user.id !== userId) return user;
        const updatedProfiles = user.profiles
          .map((att) => (att.id === attId ? { ...att, status } : att))
          .filter(
            (att) =>
              att.status &&
              ["pending", "processing", "postponed"].includes(att.status)
          );

        return { ...user, profiles: updatedProfiles };
      })
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Validaciones mínimas
        if (!userData?.role?.id || !data?.id) return;

        const agentRole = await getRoleByName("agent");
        setRole(agentRole);

        const isUserAgent = userData.role.id === agentRole.id;
        if (isUserAgent) setIsAgent(userData);

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

        const workingTodayUsersPromise = httpInternalApi.httpGetPublic(
          "/users/working_today",
          usersParams
        ) as Promise<UserResponse>;

        const attendancesParams = new URLSearchParams({
          organization_id: String(data.id),
          role_id: String(agentRole.id),
          branch_id: String(userData.branch_id || 1),
        });

        const [workingTodayUsers, queueRes, usersRes, servicesRes] =
          await Promise.all([
            workingTodayUsersPromise,
            httpInternalApi.httpGetPublic("/attendances/by_users_queue"),
            httpInternalApi.httpGetPublic(
              "/attendances/by_usersworking_today",
              attendancesParams
            ),
            httpInternalApi.httpGetPublic(
              "/services/",
              servicesParams
            ) as Promise<ServiceResponse>,
          ]);

        setIsEmpty(workingTodayUsers.users.length === 0);

        startTransition(() => {
          setQueue(queueRes as User[]);
          setUsers(usersRes as UserWithProfiles[]);
          setFilteredServices(servicesRes.services);
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [data?.id, userData]);

  return (
    <AttendanceListsPageContainer
      isWorkingTodayEmpty={isEmpty}
      isAgent={isAgent}
      fetchQueue={fetchQueue}
      users={users}
      isLoading={isLoading}
      queue={queue}
      filteredServices={filteredServices}
      updateAttendanceStatus={updateAttendanceStatus}
    />
  );
}
