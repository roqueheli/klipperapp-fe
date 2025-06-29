"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { User, UserResponse } from "@/types/user";
import { isBeforeTwoPM } from "@/utils/date.utils";
import { getRoleByName } from "@/utils/roleUtils";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CheckinPage = () => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isWorkingTodayEmpty, setIsWorkingTodayEmpty] = useState(false);
  const [originalSelectedUserIds, setOriginalSelectedUserIds] = useState<
    Set<number>
  >(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const agentRole = await getRoleByName("agent");

      const usersParams = new URLSearchParams();
      if (data?.id !== undefined) {
        usersParams.set("organization_id", String(data.id));
      }

      if (userData?.branch_id !== undefined) {
        usersParams.set("branch_id", String(userData.branch_id));
        usersParams.set("role_id", String(agentRole?.id));
        usersParams.set("active", "true");
      }

      try {
        const [allRes, workingRes] = await Promise.all([
          httpInternalApi.httpGetPublic(
            "/users",
            usersParams
          ) as Promise<UserResponse>,
          httpInternalApi.httpGetPublic(
            "/users/working_today",
            usersParams
          ) as Promise<UserResponse>,
        ]);

        const allUsers = allRes.users || [];
        const workingUsers = workingRes.users || [];

        setSelectedUsers(workingUsers);
        setOriginalSelectedUserIds(new Set(workingUsers.map((u) => u.id)));
        setIsWorkingTodayEmpty(workingUsers.length === 0);

        // Filtramos para que no aparezcan en ambas listas
        const workingUserIds = new Set(workingUsers.map((u) => u.id));
        const filteredAvailable = allUsers.filter(
          (u) => !workingUserIds.has(u.id)
        );
        setAvailableUsers(filteredAvailable);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [data?.id, userData?.branch_id]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    // Movimiento dentro de la misma lista
    if (source.droppableId === destination.droppableId) {
      const users = [
        ...(source.droppableId === "selected" ? selectedUsers : availableUsers),
      ];
      const [moved] = users.splice(source.index, 1);
      users.splice(destination.index, 0, moved);

      if (source.droppableId === "selected") {
        setSelectedUsers(users);
      } else {
        setAvailableUsers(users);
      }
    } else {
      const sourceList =
        source.droppableId === "available" ? availableUsers : selectedUsers;
      const destList =
        destination.droppableId === "available"
          ? availableUsers
          : selectedUsers;

      const [moved] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, moved);

      setAvailableUsers([...availableUsers]);
      setSelectedUsers([...selectedUsers]);
    }
  };

  const handleSend = async () => {
    const usersToSend = selectedUsers.filter(
      (u) => !originalSelectedUserIds.has(u.id)
    );

    if (usersToSend.length === 0) {
      toast("No hay usuarios nuevos para check-in.");
      return;
    }

    try {
      const loadingToastId = toast.loading("Procesando check-ins...");

      const results = [];
      for (const u of usersToSend) {
        const uniqueToken = Date.now() + Math.floor(Math.random() * 1000);
        const start_working_date = new Date(uniqueToken).toISOString();

        const requestBody = {
          organization_id: data?.id,
          branch_id: userData?.branch_id,
          id: u.id,
          start_working_at: start_working_date,
        };

        try {
          await httpInternalApi.httpPostPublic(
            "/users/start_day",
            "POST",
            requestBody
          );
          results.push({ status: "fulfilled", user: u });
          window.location.href = `/${slug}/users/lists`;
        } catch (error) {
          results.push({ status: "rejected", user: u, error });
        }
      }

      toast.dismiss(loadingToastId);

      if (results.some((result) => result.status === "rejected")) {
        toast.error("Ocurrió un error al procesar algunos check-ins.");
      } else {
        toast.success("Todos los check-ins completados.");
      }

      return results;
    } catch (error) {
      toast.error("Ocurrió un error al procesar los check-ins.");
      throw error;
    }
  };

  const handleReset = () => {
    // Devolvemos todos los seleccionados al array de disponibles
    setAvailableUsers((prev) => [...prev, ...selectedUsers]);
    setSelectedUsers([]);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col min-h-screen w-full p-6">
      <h1 className="text-2xl font-bold mb-6 sm:mb-8 text-left drop-shadow-md">
        🪪 Check-in de Usuarios
      </h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 flex-1">
          {/* Lista Seleccionados */}
          <section className="flex flex-col w-full md:w-1/2 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-green-700 dark:text-green-400">
              Orden de llegada
            </h2>
            <Droppable droppableId="selected">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="text-white space-y-3 min-h-[560px] max-h-full overflow-y-auto rounded border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-3 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 dark:scrollbar-thumb-green-600 dark:scrollbar-track-green-800"
                >
                  {selectedUsers.length === 0 && (
                    <li className="text-center text-green-500 italic">
                      No hay usuarios seleccionados
                    </li>
                  )}
                  {selectedUsers.map((user, index) => (
                    <Draggable
                      key={user.id}
                      draggableId={`selected-${user.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 rounded-xl shadow-md cursor-grab select-none transition
                          ${
                            snapshot.isDragging
                              ? "bg-green-300 dark:bg-green-700 shadow-lg scale-105"
                              : "bg-green-100 dark:bg-green-800"
                          }`}
                        >
                          {user.name}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>

            <div className="mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              {selectedUsers.length > 0 &&
                isWorkingTodayEmpty &&
                isBeforeTwoPM() && (
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Resetear lista
                  </button>
                )}
              {selectedUsers.filter((u) => !originalSelectedUserIds.has(u.id))
                .length > 0 && (
                <button
                  onClick={handleSend}
                  className="w-full sm:w-auto px-7 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Guardar orden
                </button>
              )}
            </div>
          </section>

          {/* Lista Disponibles */}
          <section className="flex flex-col w-full md:w-1/2 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-700">
              Usuarios Disponibles
            </h2>
            <Droppable droppableId="available">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="text-white space-y-3 min-h-[560px] max-h-full overflow-y-auto rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/40 p-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800"
                >
                  {availableUsers.length === 0 && (
                    <li className="text-center italic text-gray-500 dark:text-gray-400">
                      No hay usuarios disponibles
                    </li>
                  )}
                  {availableUsers.map((user, index) => (
                    <Draggable
                      key={user.id}
                      draggableId={`available-${user.id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 rounded-xl shadow cursor-grab select-none transition
                          ${
                            snapshot.isDragging
                              ? "bg-blue-300 dark:bg-blue-700 shadow-lg scale-105"
                              : "bg-blue-100 dark:bg-blue-900"
                          }`}
                        >
                          {user.name}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </section>
        </div>
      </DragDropContext>
    </div>
  );
};

export default CheckinPage;
