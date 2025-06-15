import { Attendance } from "@/types/attendance";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 7;

const getStatusStyle = (status: string) => {
  const base = "w-[40%] sm:w-[55%] xs:w-[70%] text-center px-3 py-1 rounded-full text-xs font-semibold capitalize inline-block";

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
  const [currentPage, setCurrentPage] = useState(1);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return attendances.slice(start, start + ITEMS_PER_PAGE);
  }, [attendances, currentPage]);

  const totalPages = Math.ceil(attendances.length / ITEMS_PER_PAGE);

  return (
    <div className="my-10 mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto shadow-md border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3 w-70">Cliente</th>
              <th className="px-4 py-3 w-100">Servicio</th>
              <th className="px-4 py-3 w-60">Profesional</th>
              <th className="px-4 py-3 w-60">Estado</th>
              <th className="px-4 py-3 w-70">Fecha</th>
              <th className="px-4 py-3 w-50">Precio</th>
              <th className="px-4 py-3 w-80 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((a) => (
              <tr
                key={a.id}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3">{a.profile?.name || "-"}</td>
                <td className="px-4 py-3">{a.service?.name || "-"}</td>
                <td className="px-4 py-3">
                  {a.attended_by_user?.name || "No asignado"}
                </td>
                <td className="px-4 py-3">
                  <span className={getStatusStyle(a.status)}>{a.status}</span>
                </td>
                <td className="px-4 py-3">
                  {new Date(a.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  ${parseInt(a.service?.price || "0").toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onDetail(a)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ver detalle
                    </button>
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            ⬅ Anterior
          </button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            Siguiente ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;
