"use client";

import AttendanceModal from "@/components/modal/AttendanceModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import { useIsWorkingTodayEmpty } from "@/hooks/useIsWorkingTodayEmpty";
import httpInternalApi from "@/lib/common/http.internal.service";
import { User, UserWithProfiles } from "@/types/user";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface AttendanceProfile {
  id: number;
  attendance_id?: number;
  name: string;
  status: "pending" | "processing" | "finished";
}

export default function AttendanceListsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserWithProfiles[]>([]);
  const [queue, setQueue] = useState<User[]>([]);
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    userId: number;
    userName: string;
  } | null>(null);
  const [selectedAtt, setSelectedAtt] = useState<AttendanceProfile>();
  const [isLoading, setIsLoading] = useState(true);
  const isWorkingTodayEmpty = useIsWorkingTodayEmpty();

const fetchData = useCallback(async () => {
  setIsLoading(true);
  const usersParams = new URLSearchParams();
  if (data?.id !== undefined) {
    usersParams.set("organization_id", String(data.id));
    usersParams.set("role_id", "3");
  }

  usersParams.set(
    "branch_id",
    userData?.branch_id !== undefined ? String(userData.branch_id) : "1"
  );

  try {
    const [queueRes, usersRes] = await Promise.all([
      httpInternalApi.httpGetPublic("/attendances/by_users_queue"),
      httpInternalApi.httpGetPublic(
        "/attendances/by_usersworking_today",
        usersParams
      ),
    ]);
    setQueue(queueRes as User[]);
    setUsers(usersRes as UserWithProfiles[]);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
  setIsLoading(false);
}, [data?.id, userData?.branch_id]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClick = (
    userId: number,
    userName: string,
    att: AttendanceProfile
  ) => {
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
    <div className="w-full mx-auto px-4 md:px-6 py-6 min-h-screen flex flex-col">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 drop-shadow-md">
          📢 Filas de Atención
        </h1>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-grow">
        {/* Usuarios sin perfiles */}
        <section className="col-span-1 bg-[--cyber-gray] border border-[--electric-blue] rounded-xl p-5 shadow-md shadow-[--electric-blue]/30 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold text-[--electric-blue] mb-4">
            👩‍💻 Orden Profesionales
          </h2>
          <ul className="space-y-3">
            {queue.length > 0 ? (
              queue.map((user) => (
                <li
                  key={user.id}
                  className="rounded-md bg-[--background] text-[--foreground] p-3 shadow hover:bg-[--menu-hover-bg] transition-colors text-sm"
                >
                  {user.name}
                </li>
              ))
            ) : (
              <li className="text-sm italic text-[--soft-white]/60">
                No hay profesionales sin clientes.
              </li>
            )}
          </ul>
        </section>

        {/* Turnos por usuario */}
        <section className="col-span-1 md:col-span-3 space-y-6">
          <h2 className="text-lg font-semibold text-[--accent-pink]">
            📦 Turnos por Profesional
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <article
                key={user.user.id}
                className="bg-[--cyber-gray] border border-[--electric-blue] rounded-xl p-5 shadow-md shadow-[--electric-blue]/30 flex flex-col"
              >
                <h3 className="text-md font-bold text-[--electric-blue] mb-3">
                  {user.user.name}{" "}
                  <span className="text-sm font-normal text-[--soft-white]">
                    ({user.profiles.length})
                  </span>
                </h3>

                <ul className="space-y-3 max-h-[300px] overflow-y-auto p-2">
                  {user.profiles.length > 0 ? (
                    user.profiles.map((att, index) => {
                      const isClickable = index === 0;
                      return (
                        <li
                          key={att.id}
                          onClick={() =>
                            isClickable &&
                            handleClick(user.user.id, user.user.name, {
                              id: att.id,
                              attendance_id: (att as AttendanceProfile)
                                .attendance_id,
                              name: att.name,
                              status: att.status as
                                | "pending"
                                | "processing"
                                | "finished",
                            })
                          }
                          className={`mb-5 flex items-center space-x-3 rounded-md p-3 text-xs text-[--foreground] shadow-[0_2px_8px_rgba(61,217,235,0.3)] transition-shadow select-none ${
                            isClickable
                              ? "cursor-pointer bg-[--background] hover:shadow-[0_2px_12px_rgba(61,217,235,0.5)]"
                              : "cursor-not-allowed bg-gray-800 opacity-50"
                          }`}
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
                      );
                    })
                  ) : (
                    <li className="text-sm text-[--soft-white]/60 italic">
                      Sin clientes en espera
                    </li>
                  )}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        {!isWorkingTodayEmpty && (
          <button
            onClick={() => router.push(`/${slug}/users/attendances`)}
            className="rounded-lg px-5 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 hover:shadow-xl transition"
          >
            📋 Tomar atención
          </button>
        )}
      </footer>

      <AttendanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        att={selectedAtt || null}
        userName={selectedUser?.userName || ""}
        onStart={handleStart}
        onPostpone={handlePostpone}
        onFinish={handleEnd}
      />
    </div>
  );
}
