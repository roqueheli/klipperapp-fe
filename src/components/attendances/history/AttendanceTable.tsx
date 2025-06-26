"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { usePersistedState } from "@/hooks/usePersistedState";
import { Attendance } from "@/types/attendance";
import { Branch } from "@/types/branch";
import { getStatusStyle, translateStatus } from "@/utils/organization.utils";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = usePersistedState<number>(
    "attendancesPage",
    1
  );

  const filteredAttendances = useMemo(() => {
    if (!attendances) return [];
    return attendances.filter((att) =>
      att.profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attendances, searchTerm]);

  const totalPages = Math.ceil(filteredAttendances.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAttendances.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAttendances, currentPage, itemsPerPage]);

  const getBranchName = (branchId: number) => {
    return branches?.find((branch) => branch.id === branchId)?.name ?? "-";
  };

  const handleViewDetail = (attendanceId: number) => {
    if (pathname?.includes("/attendances/history")) {
      sessionStorage.setItem("attendancesPage", String(currentPage));
    }
    router.push(`/${slug}/users/attendances/${attendanceId}`);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="w-full mx-auto px-4 space-y-6">
      {/* Tabla */}
      {filteredAttendances.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          No se encontraron registros.
        </p>
      ) : (
        <>
          {/* Buscador */}
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reinicia a la primera página al buscar
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[--electric-blue]"
            />
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="table-fixed divide-y divide-gray-200 dark:divide-gray-700 w-full">
              <thead className="rounded-t-xl bg-gray-100 dark:bg-gray-800">
                <tr>
                  {[
                    "Cód",
                    "Fecha",
                    "Sucursal",
                    "Cliente",
                    "Atendido por",
                    "Estado",
                    "Tipo de pago",
                    "Monto",
                    "Acciones",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-sm text-center dark:text-white text-gray-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.map((attendance) => (
                  <tr key={attendance.id} className="text-xs text-center h-14">
                    <td>{attendance.id}</td>
                    <td>
                      {attendance.created_at
                        ? new Date(attendance.created_at).toLocaleString(
                            "es-CL"
                          )
                        : "-"}
                    </td>
                    <td>{getBranchName(attendance.branch_id)}</td>
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
        </>
      )}

      {/* Paginación */}
      {filteredAttendances.length > 0 && (
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
      )}
    </div>
  );
};

export default AttendancesTable;
