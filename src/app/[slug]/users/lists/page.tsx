"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { pusherClient } from "@/lib/pusher/pusher.client";
import { AttendanceCable } from "@/types/attendance";
import { Service, ServiceResponse } from "@/types/service";
import { User, UserResponse, UserWithProfiles } from "@/types/user";
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

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Validaciones mínimas
      if (!userData?.role?.id || !data?.id) return;

      if (userData?.role?.name === "agent") setIsAgent(userData);

      const usersParams = new URLSearchParams({
        organization_id: String(data.id),
        role_id: String(userData?.role.id),
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
        role_id: String(userData?.role.id),
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

    channel?.bind("attendance", function (attendance: AttendanceCable) {
      const { attended_by, id: attendanceId, status, profile } = attendance;
      if (!attended_by || !attendanceId || !status || !profile) {
        fetchQueue();
        loadData();
        return;
      }

      const isVisibleStatus = ["pending", "processing", "postponed"].includes(
        status
      );

      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex((u) => u.user.id === attended_by);
        if (userIndex === -1) return prevUsers;

        const user = prevUsers[userIndex];
        const originalProfiles = [...user.profiles];

        // Buscar el índice actual del attendance
        const existingIndex = originalProfiles.findIndex(
          (p) => p.attendance_id === attendanceId
        );

        // Eliminar duplicados (por si acaso)
        const profiles = originalProfiles.filter(
          (p) => p.attendance_id !== attendanceId
        );

        // Si es visible, insertarlo en el lugar correcto
        if (isVisibleStatus) {
          const updatedProfile = {
            ...profile,
            attendance_id: attendanceId,
            status,
            name: profile.name,
            // service_ids: profile.service_ids ?? [],
          };

          if (existingIndex !== -1) {
            // Insertar en la posición original
            profiles.splice(existingIndex, 0, updatedProfile);
          } else {
            // Si no existía, agregar al final
            profiles.push(updatedProfile);
          }
        }

        const updatedUser = { ...user, profiles };
        const newUsers = [...prevUsers];
        newUsers[userIndex] = updatedUser;

        return newUsers;
      });

      fetchQueue();
    });

    return () => {
      // 🔒 Limpieza al desmontar
      channel?.unbind_all();
      channel?.unsubscribe();
    };
  }, [fetchQueue]);

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <AttendanceListsPageContainer
        isWorkingTodayEmpty={isEmpty}
        isAgent={isAgent}
        users={users}
        queue={queue}
        filteredServices={filteredServices}
      />
    </>
  );
}
