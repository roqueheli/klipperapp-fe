"use client";

import { useUser } from "@/contexts/UserContext";
import { Attendance } from "@/types/attendance";
import { translateStatus } from "@/utils/organization.utils";
import { useMemo, useState } from "react";
import { useTheme } from "../ThemeProvider";
import PaginationControls from "../ui/PaginationControls";

const ITEMS_PER_PAGE = 7;

const getStatusStyle = (status: string) => {
  const base =
    "w-[40%] sm:w-[60%] xs:w-[70%] text-center px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block";

  switch (status) {
    case "pending":
      return `${base} bg-yellow-200 text-yellow-800 animate-pulse`;
    case "processing":
      return `${base} bg-orange-200 text-orange-500 animate-pulse`;
    case "completed":
      return `${base} bg-green-100 text-green-800`;
    case "finished":
      return `${base} bg-teal-500 text-teal-100`;
    case "canceled":
    case "declined":
      return `${base} bg-red-100 text-red-800`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
  }
};

interface Props {
  attendances: Attendance[];
  title: string;
  onEdit: (a: Attendance) => void;
  onPay: (a: Attendance) => void;
  onDetail: (a: Attendance) => void;
}

const AttendanceTable = ({
  attendances,
  title,
  onEdit,
  onPay,
  onDetail,
}: Props) => {
  const { theme } = useTheme();
  const { userData } = useUser();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(attendances.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return attendances.slice(start, start + ITEMS_PER_PAGE);
  }, [attendances, currentPage]);

  return (
    <div className="my-10 mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto shadow-md border rounded-lg dark:border-gray-700">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th className="px-4 py-3 w-20">Código</th>
              <th className="px-4 py-3 w-60">Cliente</th>
              <th className="px-4 py-3 w-50">Profesional</th>
              <th className="px-4 py-3 w-50">Estado</th>
              <th className="px-4 py-3 w-55">Fecha</th>
              <th className="px-4 py-3 w-60 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((a) => (
              <tr
                key={a.id}
                className={`border-t ${
                  theme === "dark" ? "hover:bg-gray-500" : "hover:bg-gray-300"
                } transition`}
              >
                <td className="px-4 py-3">{a.id || "0"}</td>
                <td className="px-4 py-3">{a.profile?.name || "-"}</td>
                <td className="px-4 py-3">
                  {a.attended_by_user?.name || "No asignado"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[75%] w-full truncate ${getStatusStyle(
                      a.status
                    )}`}
                  >
                    {translateStatus(a.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(a.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onDetail(a)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ver detalle
                    </button>
                    {userData?.role.name === "admin" && (
                      <>
                        {a.status === "pending" && (
                          <button
                            onClick={() => onEdit(a)}
                            className="text-sm bg-yellow-600 text-white px-3 py-1 rounded"
                          >
                            Editar
                          </button>
                        )}
                        {a.status === "completed" && (
                          <button
                            onClick={() => onPay(a)}
                            className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Pagar
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación usando el componente */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default AttendanceTable;
