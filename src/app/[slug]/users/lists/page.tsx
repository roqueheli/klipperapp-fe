"use client";

import AttendanceModal from "@/components/modal/AttendanceModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import httpInternalApi from "@/lib/common/http.internal.service";
import { UserWithProfiles, UserWithProfilesResponse } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AttendanceListsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserWithProfiles[]>([]);
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    userId: number;
    userName: string;
  } | null>(null);
  const [selectedAtt, setSelectedAtt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

  const fetchData = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (userId: number, userName: string, att: any) => {
    setSelectedUser({ userId, userName });
    setSelectedAtt(att);
    setModalOpen(true);
  };

  const handleStart = async () => {
    if (!selectedAtt) return;

    const requestBody = {
      user_id: selectedUser?.userId, // o selectedAtt.user_id según tu modelo
      attendance_id: selectedAtt?.attendance_id,
    };

    try {
      await toast.promise(
        httpInternalApi.httpPostPublic(
          "/users/start_attendance",
          "POST",
          requestBody
        ),
        {
          loading: "Starting attendance...",
          success: "Attendance successfully starting.",
          error: "An error occurred while starting the attendance.",
        }
      );

      setModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Error in the creation of assistance:", error);
    }
  };

  const handlePostpone = () => {
    console.log("Posponer atención", selectedAtt);
    setModalOpen(false);
  };

  const handleEnd = async () => {
    if (!selectedAtt) return;

    const requestBody = {
      user_id: selectedUser?.userId, // o selectedAtt.user_id según tu modelo
      attendance_id: selectedAtt?.attendance_id,
    };

    try {
      await toast.promise(
        httpInternalApi.httpPostPublic(
          "/users/end_attendance",
          "POST",
          requestBody
        ),
        {
          loading: "Ending attendance...",
          success: "Attendance successfully ended.",
          error: "An error occurred while ending the attendance.",
        }
      );

      setModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Error in the ending proccess of assistance:", error);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full mx-auto p-6 flex flex-col justify-between h-[90vh]">
      {/* Header */}
      <header className="mt-20 mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 drop-shadow-md">
          📢 Listas de Atención
        </h1>
      </header>

      {/* Contenedor principal: Usuarios y Turnos */}
      <main className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-grow">
        {/* Lista de usuarios sin perfiles */}
        <section className="col-span-1 bg-[--cyber-gray] border border-[--electric-blue] rounded-xl p-5 shadow-md shadow-[--electric-blue]/20">
          <h2 className="text-lg font-semibold text-[--electric-blue] mb-5">
            👩‍💻 Orden Profesionales
          </h2>
          <ul className="space-y-3 max-h-[70vh] overflow-y-auto">
            {users
              .filter((u) => u.profiles.length === 0)
              .map((user) => (
                <li
                  key={user.user.id}
                  className="rounded-md bg-[--background] text-[--foreground] p-3 shadow-md hover:bg-[--menu-hover-bg] transition-colors cursor-default select-none text-sm"
                >
                  {user.user.name}
                </li>
              ))}
            {users.filter((u) => u.profiles.length === 0).length === 0 && (
              <li className="text-sm italic text-[--soft-white]/60">
                No hay profesionales sin clientes.
              </li>
            )}
          </ul>
        </section>

        {/* Turnos por usuario */}
        <section className="col-span-3 space-y-8">
          <h2 className="text-lg font-semibold text-[--accent-pink] mb-2">
            📦 Turnos por Profesional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <article
                key={user.user.id}
                className="bg-[--cyber-gray] border border-[--electric-blue] rounded-xl p-5 shadow-md shadow-[--electric-blue]/20 flex flex-col"
              >
                <h3 className="text-md font-bold text-[--electric-blue] mb-4 select-none">
                  {user.user.name}{" "}
                  <span className="text-sm text-[--soft-white] font-normal">
                    ({user.profiles.length})
                  </span>
                </h3>

                <ul className="overflow-auto p-1 space-y-3 overflow-y-auto max-h-[300px]">
                  {user.profiles.length === 0 ? (
                    <li className="text-sm text-[--soft-white]/60 italic">
                      Sin clientes en espera
                    </li>
                  ) : (
                    user.profiles.map((att) => (
                      <li
                        key={att.id}
                        onClick={() =>
                          handleClick(user.user.id, user.user.name, att)
                        }
                        className="mb-5 cursor-pointer flex items-center space-x-3 rounded-md bg-[--background] p-3 text-xs text-[--foreground] shadow-[0_2px_8px_rgba(61,217,235,0.3)] transition-shadow hover:shadow-[0_2px_12px_rgba(61,217,235,0.5)] select-none"
                        title={`Atención: ${att.name} - Estado: ${att.status}`}
                      >
                        <span className="font-medium flex-grow">
                          👨🏻 {att.name}
                        </span>
                        <span className="relative flex h-3 w-3 shrink-0">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                              att.status === "processing"
                                ? "bg-green-400"
                                : att.status === "pending"
                                ? "bg-orange-400"
                                : "bg-gray-400"
                            } opacity-75`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-3 w-3 ${
                              att.status === "processing"
                                ? "bg-green-500"
                                : att.status === "pending"
                                ? "bg-orange-500"
                                : "bg-gray-500"
                            }`}
                          />
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer con botones */}
      <footer className="mt-10 flex justify-between">
        <button
          onClick={() => router.push(`/${slug}/users`)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md shadow-sm transition"
          aria-label="Volver"
        >
          ⬅ Volver
        </button>

        {!isWorkingTodayEmpty && (
          <button
            onClick={() => router.push(`/${slug}/users/attendances`)}
            className="rounded-lg border px-5 py-2 text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[--accent-pink]  bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg hover:scale-105 hover:shadow-xl dark:from-blue-700 dark:to-blue-900 cursor-pointer"
          >
            📋 Tomar atención
          </button>
        )}
      </footer>

      {/* Modal */}
      <AttendanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        att={selectedAtt}
        userName={selectedUser?.userName || ""}
        onStart={handleStart}
        onPostpone={handlePostpone}
        onFinish={handleEnd}
      />
    </div>
  );
}
