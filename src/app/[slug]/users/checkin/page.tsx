"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { User, UserResponse } from "@/types/user";
import { isBeforeTwoPM } from "@/utils/date.utils";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CheckinQRPage = () => {
  const { data } = useOrganization();
  const { userData } = useUser();
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isWorkingTodayEmpty, setIsWorkingTodayEmpty] = useState(false);
  const router = useRouter();
  const [originalSelectedUserIds, setOriginalSelectedUserIds] = useState<
    Set<number>
  >(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const usersParams = new URLSearchParams();
      if (data?.id !== undefined) {
        usersParams.set("organization_id", String(data.id));
      }
      
      if (userData?.branch_id !== undefined) {
        usersParams.set("branch_id", String(userData.branch_id));
        usersParams.set("role_id", "3");
        usersParams.set("active", "true");
      }

      try {
        const [allRes, workingRes] = await Promise.all([
          httpInternalApi.httpGetPublic("/users", usersParams) as Promise<UserResponse>,
          httpInternalApi.httpGetPublic("/users/working_today", usersParams) as Promise<UserResponse>,
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
    };

    fetchData();
  }, []);

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
    }

    // Movimiento entre listas
    else {
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

    const requests = usersToSend.map((u) => {
      const uniqueToken = Date.now() + Math.floor(Math.random() * 1000);
      const start_working_date = new Date(uniqueToken).toISOString();

      const requestBody = {
        organization_id: data?.id,
        branch_id: userData?.branch_id,
        id: u.id,
        start_working_at: start_working_date,
      };

      return httpInternalApi
        .httpPostPublic("/users/start_day", "POST", requestBody)
        .then(() => ({ status: "fulfilled", user: u }))
        .catch((error) => ({ status: "rejected", user: u, error }));
    });

    toast.promise(Promise.all(requests), {
      loading: "Procesando check-ins...",
      success: () => "Todos los check-ins completados.",
      error: () => "Ocurrió un error al procesar algunos check-ins.",
    });
  };

  const handleReset = () => {
    // Devolvemos todos los seleccionados al array de disponibles
    setAvailableUsers((prev) => [...prev, ...selectedUsers]);
    setSelectedUsers([]);
  };

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-white dark:bg-black text-black dark:text-white">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Lista de usuarios orden de llegada */}
          <div className="w-full md:w-1/2 p-4 border-r overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Orden de llegada</h2>
            <Droppable droppableId="selected">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 min-h-[300px]"
                >
                  {selectedUsers.map((user, index) => (
                    <Draggable
                      key={user.id}
                      draggableId={`selected-${user.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 bg-green-100 dark:bg-green-800 rounded shadow"
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
            <div className="absolute bottom-30 left-4 flex space-x-2">
              {selectedUsers.length > 0 &&
                isWorkingTodayEmpty &&
                isBeforeTwoPM() && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
                  >
                    Resetear lista
                  </button>
                )}
              {selectedUsers.filter((u) => !originalSelectedUserIds.has(u.id))
                .length > 0 && (
                <button
                  onClick={handleSend}
                  className={`px-6 py-2 w-fit rounded transition bg-blue-600 hover:bg-blue-500 text-white`}
                >
                  Guardar orden
                </button>
              )}
            </div>
          </div>

          {/* Lista de usuarios disponibles */}
          <div className="w-full md:w-1/2 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Usuarios Disponibles</h2>
            <Droppable droppableId="available">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 min-h-[300px]"
                >
                  {availableUsers.map((user, index) => (
                    <Draggable
                      key={user.id}
                      draggableId={`available-${user.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 bg-gray-100 dark:bg-gray-800 rounded shadow"
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
          </div>
        </div>
      </DragDropContext>

      {/* Botón Volver */}
      <div className="p-6 flex justify-center border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-400 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default CheckinQRPage;
