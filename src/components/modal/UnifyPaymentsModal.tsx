import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { Organization } from "@/types/organization";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

interface Props {
  organization: Organization;
  userData: User;
  isOpen: boolean;
  attendanceId: number;
  onClose: () => void;
  onAddAttendances: (attendances: Attendance[]) => void;
}

const UnifyPaymentsModal = ({
  organization,
  userData,
  isOpen,
  attendanceId,
  onClose,
  onAddAttendances,
}: Props) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>(
    []
  );
  const [selectedAttendances, setSelectedAttendances] = useState<Attendance[]>(
    []
  );
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (organization?.id !== undefined) {
        params.set("organization_id", String(organization.id));
      }
      if (userData?.id !== undefined && userData?.role.name !== "admin") {
        params.set("branch_id", String(userData?.branch_id));
      }

      params.set("status", "completed");

      const response = (await httpInternalApi.httpGetPublic(
        "/attendances/today",
        params
      )) as Attendances;
      setAttendances(response.attendances.filter((a) => a.id !== attendanceId));
      setLoading(false);
    };

    fetchData();
  }, [organization?.id, userData, attendanceId]);
  
  useEffect(() => {
    setFilteredAttendances(
      attendances.filter((attendance) =>
        attendance.profile.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [attendances, search]);

  const handleSelectAttendance = (attendance: Attendance) => {
    if (selectedAttendances.includes(attendance)) {
      setSelectedAttendances((prev) =>
        prev.filter((a) => a.id !== attendance.id)
      );
    } else {
      setSelectedAttendances((prev) => [...prev, attendance]);
    }
  };

  const handleAddAttendances = () => {
    onAddAttendances(selectedAttendances);
    onClose();
  };

  if (isLoading) return <LoadingSpinner />;
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 w-full max-w-2xl p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-6 h-[650px] overflow-hidden">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          🔗 Unificar Pagos
        </h2>

        <div className="flex items-center gap-3">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Buscar:
          </label>
          <input
            type="search"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-300 p-2 w-full"
            placeholder="Buscar por nombre"
          />
        </div>

        {filteredAttendances.length === 0 ? (
          <p className="flex justify-center items-center text-center text-red-500 dark:text-red-400 h-[400px]">
            ¡No hay transacciones para unificar!
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto h-[400px]">
            {filteredAttendances.map((attendance) => (
              <li
                key={attendance.id}
                className="flex justify-between items-center py-3"
              >
                <div className="w-[40%]">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {attendance.profile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(attendance.created_at).toLocaleString("es-CL")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Atendido por: {attendance.attended_by_user.name}
                  </p>
                </div>
                <p className="w-[50%] font-medium text-gray-900 dark:text-gray-100">
                  Código: {attendance.id}
                </p>
                <input
                  type="checkbox"
                  checked={selectedAttendances.includes(attendance)}
                  onChange={() => handleSelectAttendance(attendance)}
                  className="w-[10%] cursor-pointer h-5 w-5 text-cyan-500 rounded border-gray-300 focus:ring-cyan-400 mr-6"
                />
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddAttendances}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-400 hover:from-cyan-500 hover:to-pink-500 text-white font-semibold transition"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnifyPaymentsModal;

