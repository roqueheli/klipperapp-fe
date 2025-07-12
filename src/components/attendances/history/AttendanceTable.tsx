"use client";

import PaginationControls from "@/components/ui/PaginationControls";
import { useOrganization } from "@/contexts/OrganizationContext";
import { usePersistedState } from "@/hooks/usePersistedState";
import { Attendance } from "@/types/attendance";
import { Branch } from "@/types/branch";
import { getStatusStyle, translateStatus } from "@/utils/organization.utils";
import { Eye, Search } from "lucide-react";
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

  return (
    <div className="w-full mx-auto px-4 space-y-6">
      {/* Buscador */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2"
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
          className={`w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-[var(--color-background)] dark:text-[var(--foreground)] text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[--electric-blue]`}
        />
      </div>

      {/* Tabla */}
      {filteredAttendances.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          No se encontraron registros.
        </p>
      ) : (
        <>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="table-fixed divide-y divide-gray-200 dark:divide-gray-700 w-full">
              <thead className="rounded-t-xl bg-[var(--color-background)]">
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
                    <th key={index} className="px-4 py-3 text-xs text-center">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-[var(--color-background)] divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.map((attendance) => (
                  <tr key={attendance.id} className="text-xs text-center h-14">
                    <td>{attendance.nid}</td>
                    <td>
                      {attendance.created_at
                        ? new Date(attendance.created_at).toLocaleString(
                            "es-CL"
                          )
                        : "-"}
                    </td>
                    <td>{getBranchName(attendance.branch_id)}</td>
                    <td className="capitalize truncate">{attendance.profile.name}</td>
                    <td className="capitalize truncate">{attendance.attended_by_user?.name ?? "-"}</td>
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
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AttendancesTable;
