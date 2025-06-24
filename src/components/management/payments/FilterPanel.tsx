"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { Branch } from "@/types/branch";
import { User } from "@/types/user";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // core styles
import "react-date-range/dist/theme/default.css"; // theme styles

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
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [branchId, setBranchId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredUsers = useMemo(() => {
    return branchId ? users.filter((u) => u.branch_id === branchId) : users;
  }, [users, branchId]);

  const handleSubmit = () => {
    const { startDate, endDate } = dateRange[0];

    onFilter({
      fromDate: startDate?.toISOString().split("T")[0] ?? "",
      toDate: endDate?.toISOString().split("T")[0] ?? "",
      branchId,
      userId,
    });
  };

  const handleReset = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setBranchId(null);
    setUserId(null);
    onReset();
  };

  return (
    <div className="w-[85%] p-4 mb-6 bg-white dark:bg-gray-900 shadow rounded-lg space-y-4">
      <h2 className="text-lg font-semibold text-[--electric-blue]">
        📋 Filtros
      </h2>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Rango de Fechas
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-sm font-medium text-[--electric-blue]"
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: "23%",
                  left: "32%",
                  transform: "translateX(-50%)",
                }}
              >
                <DateRange
                  ranges={dateRange}
                  onChange={({ selection: { startDate, endDate } }) =>
                    setDateRange([
                      {
                        startDate: startDate!,
                        endDate: endDate!,
                        key: "selection",
                      },
                    ])
                  }
                  moveRangeOnFirstSelection={false}
                  locale={es}
                  rangeColors={["#3DD9EB"]}
                  showDateDisplay={false}
                  months={1}
                  direction="horizontal"
                  calendarFocus="backwards"
                  preventSnapRefocus={true}
                  color="#f9f9f9"
                  className="bg-white dark:bg-gray-700"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Sucursal</label>
            <select
              className="w-full rounded border border-gray-600 px-3 py-2"
              value={branchId ?? ""}
              onChange={(e) =>
                setBranchId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Todas</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Usuario</label>
            <select
              className="w-full rounded border border-gray-600 px-3 py-2"
              value={userId ?? ""}
              onChange={(e) =>
                setUserId(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Todos</option>
              {filteredUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 px-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Limpiar filtros
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
