import { Attendance } from "@/types/attendance";
import { Service } from "@/types/service";
import { useState } from "react";
import AddServiceSection from "./AddServiceSection";
import ServiceList from "./ServiceList";

interface UnifiedAttendancesListProps {
  attendances: Attendance[];
  onRemove: (id: number) => void; // elimina asistencia
  onUpdateAttendance: (updatedAttendance: Attendance) => void; // actualiza asistencia con servicios modificados
  availableServices: Service[];
  onAddService: (attendanceId: number, service: Service) => void;
}

const UnifiedAttendancesList = ({
  attendances,
  onRemove,
  onUpdateAttendance,
  availableServices,
  onAddService,
}: UnifiedAttendancesListProps) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (attendances.length === 0) return null;

  const filteredServices = availableServices.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-6">
      <h5 className="text-lg font-medium mb-4">Asistencias unificadas:</h5>
      <ul className="space-y-4">
        {attendances.map((attendance) => {
          const isExpanded = expandedIds.includes(attendance.id);
          return (
            <li
              key={attendance.id}
              className="p-3 rounded bg-gray-100 dark:bg-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-[40%]">
                  <p className="font-medium">{attendance.profile.name}</p>
                  <p className="text-sm">
                    {new Date(attendance.created_at).toLocaleString("es-CL")}
                  </p>
                  <p className="text-sm">
                    Atendido por: {attendance.attended_by_user.name}
                  </p>
                </div>
                <p className="w-[30%] font-medium">Código: {attendance.id}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleExpand(attendance.id)}
                    className="text-blue-600 hover:underline"
                  >
                    {isExpanded ? "Ocultar" : "Ver detalles"}
                  </button>
                  <button
                    onClick={() => onRemove(attendance.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4">
                  <div className="mb-6">
                    <h5 className="text-lg font-medium mb-4">Servicios:</h5>
                    <ServiceList
                      services={attendance.services || []}
                      onRemove={(serviceId) =>
                        onUpdateAttendance({
                          ...attendance,
                          services: (attendance.services || []).filter(
                            (s) => s.id !== serviceId
                          ),
                        })
                      }
                    />
                  </div>
                  <AddServiceSection
                    services={filteredServices}
                    search={search}
                    onSearchChange={setSearch}
                    onAddService={(service) =>
                      onAddService(attendance.id, service)
                    }
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UnifiedAttendancesList;
