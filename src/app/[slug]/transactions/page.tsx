"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 7;

const TransactionsPage = () => {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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

  const filteredAndSorted = useMemo(() => {
    let filtered = attendances.filter((item) => {
      const name = item.profile?.name?.toLowerCase() || "";
      const service = item.service?.name?.toLowerCase() || "";
      const professional = item.attended_by_user?.name?.toLowerCase() || "";

      return (
        name.includes(searchTerm.toLowerCase()) ||
        service.includes(searchTerm.toLowerCase()) ||
        professional.includes(searchTerm.toLowerCase())
      );
    });

    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof Attendance];
      const bVal = b[sortBy as keyof Attendance];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc" ? +aVal - +bVal : +bVal - +aVal;
    });

    return filtered;
  }, [attendances, searchTerm, sortBy, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  // Función simulada para editar attendance (deberías implementarla)
  const handleEditAttendance = (attendance: Attendance) => {
    alert(`Editar attendance con ID ${attendance.id}`);
  };

  // Función simulada para pagar attendance (deberías implementar la lógica real)
  const handlePayAttendance = (attendance: Attendance) => {
    router.push(`/${slug}/payments/${attendance.id}`);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-6 py-10">
      <h1 className="mt-15 text-4xl font-bold bg-clip-text bg-gradient-to-r from-blue-600 text-blue-600 via-blue-500 to-indigo-500 drop-shadow-lg mb-6">
        💻 Transacciones
      </h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, servicio o profesional"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-3">
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

      <div className="h-[44vh] overflow-x-auto shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3 w-60">👤 Cliente</th>
              <th className="px-4 py-3 w-60">🛠️ Servicio</th>
              <th className="px-4 py-3 w-60">💼 Profesional</th>
              <th className="px-4 py-3 w-40">📋 Estado</th>
              <th className="px-4 py-3 w-60">📆 Fecha creación</th>
              <th className="px-4 py-3 w-30">💰 Precio</th>
              <th className="px-4 py-3 w-45 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((attendance) => (
              <tr
                key={attendance.id}
                onClick={() => {
                  setSelectedAttendance(attendance);
                  setIsDialogOpen(true);
                }}
                className="h-12 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
              >
                <td className="px-4 py-3">{attendance.profile?.name || "-"}</td>
                <td className="px-4 py-3">{attendance.service?.name || "-"}</td>
                <td className="px-4 py-3">
                  {attendance.attended_by_user?.name || "No asignado"}
                </td>
                <td className="px-4 py-3 capitalize">{attendance.status}</td>
                <td className="px-4 py-3">
                  {new Date(attendance.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  ${parseInt(attendance.service?.price || "0").toLocaleString()}
                </td>
                <td className="px-4 py-3 flex gap-2 items-center">
                  <button
                    onClick={() => {
                      setSelectedAttendance(attendance);
                      setIsDialogOpen(true);
                    }}
                    className="rounded-sm px-3 py-1 text-sm bg-blue-600 hover:underline"
                    type="button"
                  >
                    Ver detalle
                  </button>

                  {attendance.status === "pending" && (
                    <button
                      onClick={() => handleEditAttendance(attendance)}
                      className="rounded-sm px-3 py-1 text-sm bg-yellow-600 hover:underline"
                      type="button"
                    >
                      Editar
                    </button>
                  )}

                  {attendance.status === "completed" && (
                    <button
                      onClick={() => handlePayAttendance(attendance)}
                      className="rounded-sm px-3 py-1 text-sm bg-green-600 hover:underline"
                      type="button"
                    >
                      Pagar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6 text-sm text-gray-700 dark:text-gray-200">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:brightness-110 transition disabled:opacity-50"
        >
          ⬅ Anterior
        </button>

        <span className="text-base font-medium">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:brightness-110 transition disabled:opacity-50"
        >
          Siguiente ➡
        </button>
      </div>

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
