"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select } from "@/components/ui/Select";
import { Branch } from "@/types/branch";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export interface FilterValues {
  from: string | null;
  to: string | null;
  status: string;
  branchId: string;
  userId: string;
}

interface Props {
  initialFilters: FilterValues;
  branches: Branch[];
  users: User[];
  onSearch: (filters: FilterValues) => void;
}

export function AttendanceSummaryFilters({
  initialFilters,
  branches,
  users,
  onSearch,
}: Props) {
  const [filters, setFilters] = useState<FilterValues>({
    ...initialFilters,
    branchId: initialFilters.branchId ?? "all",
    userId: initialFilters.userId ?? "all",
  });

  const { theme } = useTheme();

  // Auto-seleccionar branch y user si hay solo uno
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      branchId: branches.length === 1 ? String(branches[0].id) : prev.branchId,
    }));
  }, [branches]);

  useEffect(() => {
    // solo filtra si ya hay un branch seleccionado (distinto de "all")
    const filtered =
      filters.branchId === "all"
        ? users
        : users.filter((u) => String(u.branch_id) === filters.branchId);

    if (filtered.length === 1) {
      setFilters((prev) => ({
        ...prev,
        userId: String(filtered[0].id),
      }));
    }
  }, [users, filters.branchId]);

  const handleDateChange = (range: {
    from: string | null;
    to: string | null;
  }) => {
    setFilters((prev) => ({ ...prev, ...range }));
  };

  const handleChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || "all",
      ...(field === "branchId" ? { userId: "all" } : {}), // reset userId si cambia la branch
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const labelColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const containerBg = theme === "dark" ? "bg-gray-800" : "bg-white";

  // Filtrar usuarios según la sucursal seleccionada
  const filteredUsers =
    filters.branchId === "all"
      ? users
      : users.filter((u) => String(u.branch_id) === filters.branchId);

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap gap-4 items-end ${containerBg} p-4 rounded-md shadow-md`}
    >
      <div className="flex flex-col">
        <label className={`text-sm mb-1 ${labelColor}`}>Sucursal</label>
        <Select
          value={filters.branchId}
          onValueChange={(val) => handleChange("branchId", val)}
        >
          {branches.length > 1 && <option value="all">Todas</option>}
          {branches.map((branch) => (
            <option key={branch.id} value={String(branch.id)}>
              {branch.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col">
        <label className={`text-sm mb-1 ${labelColor}`}>Usuario</label>
        <Select
          value={filters.userId}
          onValueChange={(val) => handleChange("userId", val)}
        >
          {filteredUsers.length > 1 && <option value="all">Todos</option>}
          {filteredUsers.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col">
        <label className={`text-sm mb-1 ${labelColor}`}>Rango</label>
        <DatePicker
          from={filters.from}
          to={filters.to}
          onChange={handleDateChange}
        />
      </div>

      <div className="flex flex-col">
        <label className={`text-sm mb-1 ${labelColor}`}>Estado</label>
        <Select
          value={filters.status}
          onValueChange={(val) => handleChange("status", val)}
        >
          <option value="all">Todos</option>
          <option value="finished">Finalizadas</option>
          <option value="pending">Pendientes</option>
          <option value="processing">En proceso</option>
          <option value="completed">Completadas</option>
        </Select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition"
      >
        Buscar
      </button>
    </form>
  );
}
