"use client";

import AttendanceTable from "@/components/attendances/AttendanceTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const TransactionsPage = () => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (data?.id !== undefined) {
        params.set("organization_id", String(data.id));
      }
      if (userData?.id !== undefined && userData?.role_id !== 1) {
        params.set("branch_id", String(userData?.branch_id));
      }
      if (userData?.role_id === 3) {
        params.set("attended_by", String(userData?.id));
      }

      const response = (await httpInternalApi.httpGetPublic(
        "/attendances",
        params
      )) as Attendances;
      setAttendances(response.attendances);
      setLoading(false);
    };

    fetchData();
  }, [data?.id, userData]);

  // Función simulada para editar attendance (deberías implementarla)
  const handleEditAttendance = (attendance: Attendance) => {
    const dataToStore = {
      attendanceId: attendance?.id,
      serviceId: attendance?.service_id,
      userId: attendance?.profile_id,
      phoneNumber: attendance.profile?.phone_number,
    };

    localStorage.setItem("attendanceInfo", JSON.stringify(dataToStore));
    router.push(`/${slug}/users/attendances`);
  };

  // Función simulada para pagar attendance (deberías implementar la lógica real)
  const handlePayAttendance = (attendance: Attendance) => {
    router.push(`/${slug}/payments/${attendance.id}`);
  };

  const handleViewAttendance = (attendance: Attendance) => {
    router.push(`/${slug}/users/attendances/${attendance.id}`);
  };

  const pendingGroup = useMemo(
    () =>
      attendances
        .filter((a) =>
          ["pending", "processing", "completed"].includes(a.status)
        )
        .sort((a, b) => {
          const dateA = new Date(a.created_at ?? 0).getTime();
          const dateB = new Date(b.created_at ?? 0).getTime();
          return dateB - dateA;
        }),
    [attendances]
  );

  const finishedGroup = useMemo(
    () =>
      attendances
        .filter((a) => a.status === "finished")
        .sort((a, b) => {
          const dateA = new Date(a.created_at ?? 0).getTime();
          const dateB = new Date(b.created_at ?? 0).getTime();
          return dateB - dateA;
        }),
    [attendances]
  );

  const canceledGroup = useMemo(
    () =>
      attendances
        .filter((a) => ["canceled", "declined"].includes(a.status))
        .sort((a, b) => {
          const dateA = new Date(a.created_at ?? 0).getTime();
          const dateB = new Date(b.created_at ?? 0).getTime();
          return dateB - dateA;
        }),
    [attendances]
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="mt-15 text-4xl font-bold bg-clip-text bg-gradient-to-r from-blue-600 text-blue-600 via-blue-500 to-indigo-500 drop-shadow-lg mb-6">
        💻 Transacciones
      </h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 w-full flex-wrap">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, servicio o profesional"
          className="w-full md:w-1/2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <label className="text-gray-600 dark:text-gray-300 font-medium">
            Ordenar por:
          </label>
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Fecha</option>
            <option value="status">Estado</option>
          </select>
          <button
            className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "Ascendente" : "Descendente"}
          </button>
        </div>
      </div>

      <AttendanceTable
        attendances={pendingGroup}
        title="🕐 En Proceso"
        onEdit={handleEditAttendance}
        onPay={handlePayAttendance}
        onDetail={handleViewAttendance}
      />

      <AttendanceTable
        attendances={finishedGroup}
        title="✅ Finalizados"
        onEdit={handleEditAttendance}
        onPay={handlePayAttendance}
        onDetail={handleViewAttendance}
      />

      <AttendanceTable
        attendances={canceledGroup}
        title="❌ Cancelados / Rechazados"
        onEdit={handleEditAttendance}
        onPay={handlePayAttendance}
        onDetail={handleViewAttendance}
      />

      <div className="flex justify-center mt-6">
        <button
          onClick={() => router.push(`/${slug}/users`)}
          className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-md transition-all"
        >
          ⬅ Volver
        </button>
      </div>
      {isDialogOpen && selectedAttendance && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
            <h2 className="text-2xl font-bold mb-4">
              💳 Detalle de la Transacción
            </h2>
            <p>
              <strong>Cliente:</strong> {selectedAttendance.profile?.name}
            </p>
            <p>
              <strong>Servicio:</strong> {selectedAttendance.service?.name}
            </p>
            <p>
              <strong>Profesional:</strong>{" "}
              {selectedAttendance.attended_by_user?.name || "No asignado"}
            </p>
            <p>
              <strong>Estado:</strong> {selectedAttendance.status}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(selectedAttendance.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Precio:</strong> $
              {parseInt(
                selectedAttendance.service?.price || "0"
              ).toLocaleString()}
            </p>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => alert("Implementar lógica de pago")}
                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
              >
                Pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
