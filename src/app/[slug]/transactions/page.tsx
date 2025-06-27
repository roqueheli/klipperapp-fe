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
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (data?.id !== undefined) {
        params.set("organization_id", String(data.id));
      }
      if (userData?.id !== undefined && userData?.role.name !== "admin") {
        params.set("branch_id", String(userData?.branch_id));
      }
      if (userData?.role.name === "agent") {
        params.set("attended_by", String(userData?.id));
      }

      const response = (await httpInternalApi.httpGetPublic(
        "/attendances/today",
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
      services: attendance?.services,
      userId: attendance?.attended_by,
      profile: attendance?.profile,
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

  const pendingGroup = useMemo(() => {
    if (!Array.isArray(attendances)) return [];

    return attendances
      .filter((a) => ["pending", "processing", "completed"].includes(a.status))
      .sort((a, b) => {
        const statusOrder = ["pending", "processing", "completed"];
        const statusComparison =
          statusOrder.indexOf(b.status) - statusOrder.indexOf(a.status);
        if (statusComparison !== 0) return statusComparison;
        return a.id - b.id;
      });
  }, [attendances]);

  const finishedGroup = useMemo(() => {
    if (!Array.isArray(attendances)) return [];
    return attendances
      .filter((a) => a.status === "finished")
      .sort((a, b) => {
        const dateA = new Date(a.created_at ?? 0).getTime();
        const dateB = new Date(b.created_at ?? 0).getTime();
        return dateB - dateA;
      });
  }, [attendances]);

  const canceledGroup = useMemo(() => {
    if (!Array.isArray(attendances)) return [];

    return attendances
      .filter((a) => ["canceled", "declined"].includes(a.status))
      .sort((a, b) => {
        const dateA = new Date(a.created_at ?? 0).getTime();
        const dateB = new Date(b.created_at ?? 0).getTime();
        return dateB - dateA;
      });
  }, [attendances]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full min-h-screen p-6">
      <h1 className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-black-600 text-white via-blue-500 to-indigo-500 drop-shadow-lg mb-6">
        📅 Atenciones del día
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
        attendances={pendingGroup || []}
        title="🕐 En Proceso"
        onEdit={handleEditAttendance}
        onPay={handlePayAttendance}
        onDetail={handleViewAttendance}
      />

      <AttendanceTable
        attendances={finishedGroup || []}
        title="✅ Finalizados"
        onEdit={handleEditAttendance}
        onPay={handlePayAttendance}
        onDetail={handleViewAttendance}
      />

      <AttendanceTable
        attendances={canceledGroup || []}
        title="❌ Cancelados / Rechazados"
        onEdit={handleEditAttendance}
        onPay={handlePayAttendance}
        onDetail={handleViewAttendance}
      />
    </div>
  );
};

export default TransactionsPage;
