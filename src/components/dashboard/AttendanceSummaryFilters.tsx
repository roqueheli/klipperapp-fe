"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select } from "@/components/ui/Select";
import { Branch } from "@/types/branch";
import { useState } from "react";

export interface FilterValues {
  from: string | null;
  to: string | null;
  status: string;
}

interface Props {
  initialFilters: FilterValues;
  branches: Branch[];
  onSearch: (filters: FilterValues) => void;
}

export function AttendanceSummaryFilters({
  initialFilters,
  branches,
  onSearch,
}: Props) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const { theme } = useTheme();

  const handleDateChange = (range: {
    from: string | null;
    to: string | null;
  }) => {
    setFilters((prev) => ({ ...prev, ...range }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const labelColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const containerBg = theme === "dark" ? "bg-gray-800" : "bg-white";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-wrap gap-4 items-end ${containerBg} p-4 rounded-md shadow-md`}
    >
      <div className="flex flex-col">
        <label className={`text-sm mb-1 ${labelColor}`}>Sucursal</label>
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <option value="all">Todas</option>
          {branches &&
            branches.length > 0 &&
            branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
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
        <Select value={filters.status} onValueChange={handleStatusChange}>
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
