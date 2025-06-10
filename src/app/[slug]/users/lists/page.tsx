"use client";

import AttendanceModal from "@/components/modal/AttendanceModal";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { UserWithProfiles, UserWithProfilesResponse } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AttendanceListsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserWithProfiles[]>([]);
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedAtt, setSelectedAtt] = useState<any>(null);

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
          "/attendances/by_usersworking_today",
          usersParams
        )) as UserWithProfilesResponse;
        setUsers(usersRes.usersAttendances);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };

    fetchData();
  }, []);

  console.log("users", users);

  const handleClick = (userName: string, att: any) => {
    setSelectedUser(userName);
    setSelectedAtt(att);
    setModalOpen(true);
  };

  const handleStart = () => {
    console.log("Iniciar atención", selectedAtt);
    setModalOpen(false);
  };

  const handlePostpone = () => {
    console.log("Posponer atención", selectedAtt);
    setModalOpen(false);
  };

  const handleFinish = () => {
    console.log("Finalizar atención", selectedAtt);
    setModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[--electric-blue] tracking-wide">
          🧠 Listas de Atención
        </h1>
      </div>

      {/* Grid de listas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna izquierda: Usuarios */}
        <div className="border border-[--electric-blue] col-span-1 bg-[--cyber-gray] rounded-xl p-5 shadow-md shadow-[--electric-blue]/20">
          <h2 className="text-lg font-semibold text-[--electric-blue] mb-4">
            👩‍💻 Orden Profesionales
          </h2>
          <ul className="space-y-4">
            {users
              .filter((u) => u.profiles.length === 0)
              .map((user) => (
                <li
                  key={user.user.id}
                  className="shadow-md bg-[--background] text-[--foreground] p-3 rounded-md hover:bg-[--menu-hover-bg] transition-all text-sm"
                >
                  {user.user.name}
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
            {users.map((user) => {
              return (
                <div
                  key={user.user.id}
                  className="bg-[--cyber-gray] border border-[--electric-blue] rounded-xl p-5 shadow-md shadow-[--electric-blue]/20"
                >
                  <h3 className="text-md font-bold text-[--electric-blue] mb-3">
                    {user.user.name}{" "}
                    <span className="text-sm text-[--soft-white]">
                      ({user.profiles.length})
                    </span>
                  </h3>
                  {user.profiles.length === 0 ? (
                    <p className="text-sm text-[--soft-white]/60 italic">
                      Sin clientes en espera
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {user.profiles.map((att) => (
                        <li
                          key={att.id}
                          onClick={() => handleClick(user.user.name, att)}
                          className="cursor-pointer bg-[--background] text-[--foreground] p-3 rounded-md text-xs transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(61,217,235,0.3)] hover:shadow-[0_2px_12px_rgba(61,217,235,0.5)]"
                        >
                          <div className="font-medium">👨🏻 {att.name}</div>
                          <span className="relative flex h-3 w-3">
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full
                              ${
                                att.status === "processing"
                                  ? "bg-green-400"
                                  : att.status === "pending"
                                  ? "bg-orange-400"
                                  : "bg-gray-400"
                              }
                              opacity-75
                            `}
                            ></span>
                            <span
                              className={`relative inline-flex rounded-full h-3 w-3
                              ${
                                att.status === "processing"
                                  ? "bg-green-500"
                                  : att.status === "pending"
                                  ? "bg-orange-500"
                                  : "bg-gray-500"
                              }
                            `}
                            ></span>
                          </span>
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

      <div className="mt-15 flex justify-between mt-10">
        <button
          onClick={() => router.push(`/${slug}/users`)}
          className="bg-[--cyber-gray] text-[--electric-blue] border border-[--electric-blue] px-4 py-2 rounded-lg hover:bg-[--menu-hover-bg] transition-all"
        >
          ⬅ Volver
        </button>

        <button
          onClick={() => router.push(`/${slug}/users/attendances`)}
          className="bg-[--accent-pink] text-white border border-[--accent-pink] px-4 py-2 rounded-lg hover:brightness-110 transition-all"
        >
          📋 Tomar atención
        </button>
      </div>
      <AttendanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        att={selectedAtt}
        userName={selectedUser || ""}
        onStart={handleStart}
        onPostpone={handlePostpone}
        onFinish={handleFinish}
      />
    </div>
  );
}
