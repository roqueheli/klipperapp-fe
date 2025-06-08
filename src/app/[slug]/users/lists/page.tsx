"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { UserResponse } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mockAttendances = [
  {
    id: 1,
    phone: "+34123456789",
    userId: 1,
    user: { name: "Ana López" },
    service: { name: "Corte de cabello" },
  },
  {
    id: 2,
    phone: "+34111222333",
    userId: 2,
    user: { name: "Juan Pérez" },
    service: { name: "Coloración" },
  },
  {
    id: 3,
    phone: "+34999999999",
    userId: 1,
    user: { name: "Ana López" },
    service: { name: "Coloración" },
  },
];

export default function AttendanceListsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState("name");
  const { data } = useOrganization();
  const { userData } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const usersParams = new URLSearchParams();
      if (data?.id !== undefined) {
        usersParams.set("organization_id", String(data.id));
        usersParams.set("role_id", String("3"));
      }

      if (userData?.branch_id !== undefined) {
        usersParams.set("branch_id", String(userData.branch_id));
      } else {
        usersParams.set("branch_id", String("1"));
      }

      try {
        const usersRes = (await httpInternalApi.httpGetPublic(
          "/users/working_today",
          usersParams
        )) as UserResponse;
        setUsers(usersRes.users);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setAttendances(mockAttendances);
  }, []);

  const getSortedUsers = () => {
    const usersWithCount = users.map((user) => ({
      ...user,
      queueCount: attendances.filter((a) => a.userId === user.id).length,
    }));

    if (sortOption === "name") {
      return [...usersWithCount].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return [...usersWithCount].sort((a, b) => b.queueCount - a.queueCount);
    }
  };

  const sortedUsers = getSortedUsers();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[--electric-blue] tracking-wide">
          🧠 Listas de Atención
        </h1>
        <button
          onClick={() => router.back()}
          className="bg-[--cyber-gray] text-[--electric-blue] border border-[--electric-blue] px-4 py-2 rounded-lg hover:bg-[--menu-hover-bg] transition-all"
        >
          ⬅ Volver
        </button>
      </div>

      {/* Filtro de orden */}
      <div className="mb-8 flex items-center gap-4">
        <label className="text-[--soft-white] font-medium text-sm">
          Ordenar usuarios por:
        </label>
        <select
          className="bg-transparent border border-[--electric-blue] text-[--electric-blue] px-3 py-1 rounded-lg outline-none text-sm"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name">Nombre (A-Z)</option>
          <option value="quantity">Cantidad de turnos</option>
        </select>
      </div>

      {/* Grid de listas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna izquierda: Usuarios */}
        <div className="border border-[--electric-blue] col-span-1 bg-[--cyber-gray] rounded-xl p-5 shadow-md shadow-[--electric-blue]/20">
          <h2 className="text-lg font-semibold text-[--electric-blue] mb-4">
            👩‍💻 Orden Profesionales
          </h2>
          <ul className="space-y-4">
            {sortedUsers.map((user) => (
              <li
                key={user.id}
                className="shadow-md bg-[--background] text-[--foreground] p-3 rounded-md hover:bg-[--menu-hover-bg] transition-all text-sm"
              >
                {user.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Columna derecha: Turnos por usuario */}
        <div className="col-span-3 space-y-6">
          <h2 className="text-lg font-semibold text-[--accent-pink]">
            📦 Turnos por Profesional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUsers.map((user) => {
              const queue = attendances.filter((a) => a.userId === user.id);
              return (
                <div
                  key={user.id}
                  className="bg-[--cyber-gray] border border-[--electric-blue] rounded-xl p-5 shadow-md shadow-[--electric-blue]/20"
                >
                  <h3 className="text-md font-bold text-[--electric-blue] mb-3">
                    {user.name}{" "}
                    <span className="text-sm text-[--soft-white]">
                      ({queue.length})
                    </span>
                  </h3>
                  {queue.length === 0 ? (
                    <p className="text-sm text-[--soft-white]/60 italic">
                      Sin clientes en espera
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {queue.map((att) => (
                        <li
                          key={att.id}
                          className="cursor-pointer bg-[--background] text-[--foreground] p-3 rounded-md text-xs shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="font-medium">👨🏻 {att.user.name}</div>
                          <div className="text-[--accent-pink]">
                            {att.service.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
