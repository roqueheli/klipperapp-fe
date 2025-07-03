"use client";

import { AttendanceLineChart } from "@/components/dashboard/AttendanceLineChart";
import {
  AttendanceSummaryFilters,
  FilterValues,
} from "@/components/dashboard/AttendanceSummaryFilters";
import { useAttendanceSummary } from "@/hooks/useAttendanceSummary";
import { useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function AttendanceSummarySection() {
  const [filters, setFilters] = useState<FilterValues>({
    from: new Date().toISOString().slice(0, 7) + "-01", // primer día del mes actual
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10), // último día del mes actual
    status: "all",
    branchId: "all",
    userId: "all",
  });

  const formatDate = (date: string | null) =>
    date ? date.replace(/-/g, "") : "";

  const { summary, branches, users, isLoading } = useAttendanceSummary(
    formatDate(filters.from),
    formatDate(filters.to),
    filters.status,
    filters.branchId,
    filters.userId
  );

  const handleSearch = (newFilters: FilterValues) => {
    setFilters({
      ...newFilters,
      branchId: newFilters.branchId ?? "all",
      userId: newFilters.userId ?? "all",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <AttendanceSummaryFilters
        initialFilters={filters}
        branches={branches}
        users={users}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <div className="flex justify-center mt-8">
          <LoadingSpinner />
        </div>
      ) : summary?.length > 0 ? (
        <AttendanceLineChart data={summary} />
      ) : (
        <p className="text-center text-gray-500 mt-8">
          No hay datos para el rango de fechas seleccionado.
        </p>
      )}
    </div>
  );
}
