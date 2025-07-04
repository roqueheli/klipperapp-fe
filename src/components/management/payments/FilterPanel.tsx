"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useOrganization } from "@/contexts/OrganizationContext";
import { Branch } from "@/types/branch";
import { User } from "@/types/user";
import { getWeeksOfMonth, monthNames } from "@/utils/date.utils";
import { useEffect, useMemo, useState } from "react";

export interface FilterValues {
  fromDate: string;
  toDate: string;
  branchId: number | null;
  userId: number | null;
}

interface FilterPanelProps {
  branches: Branch[];
  users: User[];
  onFilter: (filters: FilterValues) => void;
  onReset: () => void;
}

const FilterPanel = ({
  branches,
  users,
  onFilter,
  onReset,
}: FilterPanelProps) => {
  const { data } = useOrganization();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState("");
  const [branchId, setBranchId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const { theme } = useTheme();

  const weeks = useMemo(
    () =>
      getWeeksOfMonth(
        year,
        month,
        data?.metadata?.payment_config?.week_start,
        data?.metadata?.payment_config?.week_end
      ),
    [year, month, data]
  );

  const filteredUsers = useMemo(() => {
    return branchId ? users.filter((u) => u.branch_id === branchId) : users;
  }, [users, branchId]);

  useEffect(() => {
    if (weeks.length > 0 && selectedWeek === "") {
      setSelectedWeek(`${weeks[0].from}_${weeks[0].to}`);
    }
  }, [weeks, selectedWeek]);

  const handleSubmit = () => {
    let fromDate: string;
    let toDate: string;

    if (selectedWeek === "") {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      fromDate = firstDay.toISOString().split("T")[0];
      toDate = lastDay.toISOString().split("T")[0];
    } else {
      [fromDate, toDate] = selectedWeek.split("_");
    }

    onFilter({
      fromDate,
      toDate,
      branchId: branchId ?? (branches.length === 1 ? branches[0].id : null),
      userId:
        userId ?? (filteredUsers.length === 1 ? filteredUsers[0].id : null),
    });
  };

  const handleReset = () => {
    setYear(currentYear);
    setMonth(new Date().getMonth());
    setSelectedWeek(weeks.length > 0 ? `${weeks[0].from}_${weeks[0].to}` : "");
    setBranchId(null);
    setUserId(null);
    onReset();
  };

  return (
    <div
      className={`p-4 mb-6 shadow rounded-lg space-y-4 transition-colors bg-[var(--color-background)] text-[var(--foreground)] border border-gray-300 ${
        theme === "dark" && "border-gray-600"
      }`}
    >
      <h2 className="text-lg font-semibold">📋 Filtros</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Año */}
        <div>
          <label className="block text-sm mb-1 font-medium">Año</label>
          <select
            className={`w-full rounded border px-3 py-2 bg-[var(--color-background)] text-[var(--foreground)] border-gray-300 ${
              theme === "dark" && "border-gray-600"
            }`}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Mes */}
        <div>
          <label className="block text-sm mb-1 font-medium">Mes</label>
          <select
            className={`w-full rounded border px-3 py-2 bg-[var(--color-background)] text-[var(--foreground)] border-gray-300 ${
              theme === "dark" && "border-gray-600"
            }`}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthNames.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Semana */}
        <div>
          <label className="block text-sm mb-1 font-medium">Semana</label>
          <select
            className={`w-full rounded border px-3 py-2 bg-[var(--color-background)] text-[var(--foreground)] border-gray-300 ${
              theme === "dark" && "border-gray-600"
            }`}
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
          >
            {weeks.map((w, i) => (
              <option key={i} value={`${w.from}_${w.to}`}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {/* Sucursal */}
        <div>
          <label className="block text-sm mb-1 font-medium">Sucursal</label>
          <select
            className={`w-full rounded border px-3 py-2 bg-[var(--color-background)] text-[var(--foreground)] border-gray-300 ${
              theme === "dark" && "border-gray-600"
            }`}
            value={branchId ?? ""}
            onChange={(e) =>
              setBranchId(e.target.value ? Number(e.target.value) : null)
            }
          >
            {branches.length > 1 && <option value="">Todas</option>}
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Usuario */}
        <div>
          <label className="block text-sm mb-1 font-medium">Usuario</label>
          <select
            className={`w-full rounded border px-3 py-2 bg-[var(--color-background)] text-[var(--foreground)] border-gray-300 ${
              theme === "dark" && "border-gray-600"
            }`}
            value={userId ?? ""}
            onChange={(e) =>
              setUserId(e.target.value ? Number(e.target.value) : null)
            }
            disabled={filteredUsers.length === 1}
          >
            {filteredUsers.length > 1 && <option value="">Todos</option>}
            {filteredUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 px-2">
        <button
          onClick={handleReset}
          className={`px-4 py-2 rounded-md border text-sm bg-[var(--color-background)] text-[var(--foreground)] ${
            theme === "dark"
              ? "border-gray-600 hover:bg-gray-500"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          Limpiar filtros
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:opacity-50"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
