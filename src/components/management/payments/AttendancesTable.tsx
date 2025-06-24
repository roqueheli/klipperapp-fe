"use client";

import { Attendance } from "@/types/attendance";
import { Eye } from "lucide-react";

interface AttendancesTableProps {
  attendances: Attendance[];
  onView?: (attendance: Attendance) => void;
}

const AttendancesTable = ({ attendances, onView }: AttendancesTableProps) => {
  if (attendances.length === 0) {
    return (
      <div className="p-4 text-gray-500 italic border rounded-md">
        No hay atenciones finalizadas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow rounded-md border">
      <table className="min-w-full table-auto border-collapse text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
          <tr>
            <th className="px-4 py-2 text-center">#</th>
            <th className="px-4 py-2 text-center">Fecha</th>
            <th className="px-4 py-2 text-center">Servicio</th>
            <th className="px-4 py-2 text-center">Monto</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((a) => (
            <tr key={a.id} className="border-t dark:border-gray-700">
              <td className="px-4 py-2 text-center">{a.id}</td>
              <td className="px-4 py-2 text-center">
                {new Date(a.created_at).toLocaleDateString("es-CL")}
              </td>
              <td className="px-4 py-2 text-center">
                {a.services.map((s) => s.name).join(", ")}
              </td>
              <td className="px-4 py-2 text-center">
                $ {Math.trunc(a.user_amount || 0).toLocaleString("es-CL")}
              </td>
              <td className="px-4 py-2 text-center">
                {onView && (
                  <button
                    onClick={() => onView(a)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancesTable;
