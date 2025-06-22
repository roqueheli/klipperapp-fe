"use client";

import { useAttendances } from "@/contexts/AttendancesContext";
import { Branch } from "@/types/branch";
import { User } from "@/types/user";
import { availableStatuses, months } from "@/utils/organization.utils";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface FilterPanelProps {
  onDownloadPdf?: () => void;
  hasResults?: boolean;
  users: User[];
  branches: Branch[];
}

const FilterPanel = ({
  onDownloadPdf,
  hasResults,
  users,
  branches,
}: FilterPanelProps) => {
  const pathname = usePathname();
  const isAttendancesPage = pathname?.includes("/attendances/history");
  const [isOpen, setIsOpen] = useState(true);
  const { filters, fetchAttendances, resetAttendances } = useAttendances();

  const today = new Date();
  const currentYear = today.getFullYear();
  const years = [currentYear, currentYear - 1];
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  // Estado local sincronizado con los filtros del contexto
  const [localFilters, setLocalFilters] = useState({
    year: filters.year || "",
    month: filters.month || "",
    day: filters.day || "",
    branch_id: filters.branch_id || "",
    attended_by: filters.attended_by || "",
    status: filters.status || "",
    order_by: filters.order_by || "date",
    order_dir: filters.order_dir || "desc",
  });

  // Actualizar días disponibles cuando cambia mes/año
  useEffect(() => {
    if (localFilters.month && localFilters.year) {
      const daysInMonth = new Date(
        Number(localFilters.year),
        Number(localFilters.month),
        0
      ).getDate();
      setAvailableDays(
        Array.from({ length: daysInMonth }, (_, i) => String(i + 1))
      );
    } else {
      setAvailableDays([]);
    }
  }, [localFilters.month, localFilters.year]);

  // Sincronizar con cambios en el contexto
  useEffect(() => {
    setLocalFilters({
      year: filters.year || "",
      month: filters.month || "",
      day: filters.day || "",
      branch_id: filters.branch_id || "",
      attended_by: filters.attended_by || "",
      status: filters.status || "",
      order_by: filters.order_by || "date",
      order_dir: filters.order_dir || "desc",
    });
  }, [filters]);

  const handleReset = () => {
    resetAttendances();
    setLocalFilters({
      year: "",
      month: "",
      day: "",
      branch_id: "",
      attended_by: "",
      status: "",
      order_by: "date",
      order_dir: "desc",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Crear objeto de filtros limpio (sin propiedades vacías)
    const appliedFilters = {
      ...(localFilters.year && { year: localFilters.year }),
      ...(localFilters.month && { month: localFilters.month }),
      ...(localFilters.day && { day: localFilters.day }),
      ...(localFilters.branch_id && { branch_id: localFilters.branch_id }),
      ...(localFilters.status && { status: localFilters.status }),
      ...(localFilters.attended_by && {
        attended_by: localFilters.attended_by,
      }),
      order_by: localFilters.order_by as "date" | "total_amount",
      order_dir: localFilters.order_dir as "asc" | "desc",
    };

    if (isAttendancesPage) {
      fetchAttendances(appliedFilters);
    } else {
      // Manejo alternativo si no estamos en la página
      fetchAttendances(appliedFilters);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      // Resetear día si cambia mes o año
      if ((key === "month" || key === "year") && value) {
        newFilters.day = "";
      }

      // Resetear attended_by si cambia branch_id
      if (key === "branch_id") {
        newFilters.attended_by = "";
      }

      return newFilters;
    });
  };

  const filteredUsers = localFilters.branch_id
    ? users.filter((u) => u.branch_id?.toString() === localFilters.branch_id)
    : users;

  const inputStyle =
    "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="w-[98%] border border-gray-200 dark:border-gray-800 rounded-t-xl bg-gray-100 dark:bg-gray-900 shadow-md">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-200 dark:hover:bg-gray-800 transition rounded-t-xl"
      >
        <span className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-semibold">
          <Filter size={18} />
          Filtros
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen opacity-100 p-6" : "max-h-0 opacity-0"
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Filtros por fecha */}
          <div>
            <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-2">
              Filtrar por fecha
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={localFilters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className={inputStyle}
              >
                <option value="">Año</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                value={localFilters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                className={inputStyle}
              >
                <option value="">Mes</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>

              <select
                value={localFilters.day}
                onChange={(e) => handleFilterChange("day", e.target.value)}
                disabled={!availableDays.length}
                className={inputStyle}
              >
                <option value="">Día</option>
                {availableDays.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros por ubicación */}
          <div>
            <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-2">
              Filtrar por ubicación
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={localFilters.branch_id}
                onChange={(e) =>
                  handleFilterChange("branch_id", e.target.value)
                }
                className={inputStyle}
              >
                <option value="">Todas las sucursales</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              <select
                value={localFilters.attended_by}
                onChange={(e) =>
                  handleFilterChange("attended_by", e.target.value)
                }
                className={inputStyle}
              >
                <option value="">Todos los usuarios</option>
                {filteredUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              {/* Nueva Sección de Filtro por Status */}
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className={inputStyle}
              >
                <option value="">Todos los estados</option>
                {availableStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orden de resultados */}
          <div>
            <h3 className="text-gray-700 dark:text-gray-200 font-semibold mb-2">
              Ordenar resultados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={localFilters.order_by}
                onChange={(e) => handleFilterChange("order_by", e.target.value)}
                className={inputStyle}
              >
                <option value="date">Fecha</option>
                <option value="total_amount">Monto</option>
              </select>

              <select
                value={localFilters.order_dir}
                onChange={(e) =>
                  handleFilterChange("order_dir", e.target.value)
                }
                className={inputStyle}
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between flex-wrap gap-4 pt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition"
              >
                Limpiar filtros
              </button>

              {hasResults && onDownloadPdf && (
                <button
                  type="button"
                  onClick={onDownloadPdf}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                >
                  Descargar PDF
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 shadow"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterPanel;
