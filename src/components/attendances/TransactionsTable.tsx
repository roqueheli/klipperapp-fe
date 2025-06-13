import { Attendance } from "@/types/attendance";

export const TransactionsTable = ({
  data,
  onRowClick,
}: {
  data: Attendance[];
  onRowClick: (attendance: Attendance) => void;
}) => (
  <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <table className="w-full text-sm text-left table-auto">
      <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
        <tr>
          <th className="px-4 py-3">👤 Cliente</th>
          <th className="px-4 py-3">🛠️ Servicio</th>
          <th className="px-4 py-3">💼 Profesional</th>
          <th className="px-4 py-3">📋 Estado</th>
          <th className="px-4 py-3">📆 Fecha</th>
          <th className="px-4 py-3">💰 Precio</th>
        </tr>
      </thead>
      <tbody>
        {data.map((attendance) => (
          <tr
            key={attendance.id}
            className="border-t hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition"
            onClick={() => onRowClick(attendance)}
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
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

