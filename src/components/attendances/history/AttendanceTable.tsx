"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { usePersistedState } from "@/hooks/usePersistedState";
import { Attendance } from "@/types/attendance";
import { Branch } from "@/types/branch";
import { getStatusStyle, translateStatus } from "@/utils/organization.utils";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

interface AttendancesTableProps {
  attendances: Attendance[];
  itemsPerPage?: number;
  branches?: Branch[];
}

const AttendancesTable = ({
  attendances,
  itemsPerPage = 11,
  branches,
}: AttendancesTableProps) => {
  const { slug } = useOrganization();
  const pathname = usePathname();
  const router = useRouter();
  const [currentPage, setCurrentPage] = usePersistedState<number>(
    "attendancesPage",
    1
  );

  const totalPages = Math.ceil(attendances.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return attendances.slice(startIndex, startIndex + itemsPerPage);
  }, [attendances, currentPage, itemsPerPage]);

  const getBrachName = (branchId: number) => {
    const branch = branches?.find((branch) => branch.id === branchId);
    return branch?.name;
  };

  const handleViewDetail = (attendanceId: number) => {
    if (pathname?.includes("/attendances/history")) {
      sessionStorage.setItem("attendancesPage", String(currentPage));
    }
    router.push(`/${slug}/users/attendances/${attendanceId}`);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (attendances.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No se encontraron registros.
      </p>
    );
  }

  return (
    <div className="w-full mx-auto px-4 space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="table-fixed divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="rounded-t-xl bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="w-10 px-4 py-3 text-sm text-center dark:text-white text-gray-600">
                Cód
              </th>
              <th className="w-35 px-4 py-3 text-sm text-center dark:text-white text-gray-600">
                Fecha
              </th>
              <th className="w-30 px-4 py-3 text-sm text-center dark:text-white text-gray-600">
                Sucursal
              </th>
              <th className="w-40 px-4 py-3 text-sm text-center dark:text-white text-gray-600">
                Cliente
              </th>
              <th className="w-40 px-4 py-3 text-sm text-center dark:text-white text-gray-600">
                Atendido por
              </th>
              <th className="w-30 px-4 py-3 text-sm text-center dark:text-white text-gray-600">
                Estado
              </th>
              <th className="w-40 px-4 py-3 text-sm text-center dark:text-white text-gray-600">
                Tipo de pago
              </th>
              <th className="w-30 px-4 py-3 text-sm text-center dark:text-white text-gray-600">
                Monto
              </th>
              <th className="w-20 px-4 py-3 text-sm text-center dark:text-white text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((attendance) => (
              <tr key={attendance.id} className="text-xs text-center h-14">
                <td>{attendance.id}</td>
                <td>
                  {attendance.created_at
                    ? new Date(attendance.created_at).toLocaleString()
                    : "-"}
                </td>
                <td>{getBrachName(attendance.branch_id)}</td>
                <td>{attendance.profile.name}</td>
                <td>{attendance.attended_by_user?.name ?? "-"}</td>
                <td>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                      attendance.status
                    )}`}
                  >
                    {translateStatus(attendance.status)}
                  </span>
                </td>
                <td>{attendance.payment_method ?? "-"}</td>
                <td>
                  {attendance.total_amount !== null
                    ? `$ ${attendance.total_amount.toLocaleString("es-CL")}`
                    : "-"}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleViewDetail(attendance.id)}
                    className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-blue-600 dark:text-blue-400"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
        <p>
          Página {currentPage} de {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancesTable;
