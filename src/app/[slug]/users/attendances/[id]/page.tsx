"use client";

import AvatarCard from "@/components/attendances/detail/AvatarCard";
import DetailSection from "@/components/attendances/detail/DetailSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { Service } from "@/types/service";
import { CalendarClock, ChevronLeft, UserCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AttendanceDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const attendanceParams = new URLSearchParams();
    attendanceParams.set("id", String(id));

    const fetchAttendance = async () => {
      try {
        const response = (await httpInternalApi.httpGetPublic(
          `/attendances`,
          attendanceParams
        )) as Attendances;

        setAttendance(response?.attendances[0]);
      } catch (error) {
        console.error("Error al cargar asistencia:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [id]);

  if (isLoading || !attendance) return <LoadingSpinner />;

  const { profile, attended_by_user, services, created_at, status } =
    attendance;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[--electric-blue] flex items-center gap-2 mb-8">
        🧾 Detalle del Turno
      </h1>

      <DetailSection
        icon={<UserCircle2 className="text-[--accent-pink]" />}
        title="Cliente"
      >
        <AvatarCard
          name={profile?.name}
          email={profile?.email}
          phone={profile?.phone_number}
        />
      </DetailSection>

      <DetailSection
        icon={<UserCircle2 className="text-[--electric-blue]" />}
        title="Profesional asignado"
      >
        <AvatarCard
          name={attended_by_user?.name}
          email={attended_by_user?.email}
        />
      </DetailSection>

      <DetailSection
        icon={<CalendarClock className="text-yellow-400" />}
        title="Servicios"
      >
        {services?.length ? (
          <ul className="space-y-4">
            {services.map((service: Service) => (
              <li
                key={service.id}
                className="bg-[#1b273a] p-4 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-white/90 ring-1 ring-[--electric-blue]/10"
              >
                <span className="font-medium">{service.name}</span>
                <div className="flex gap-4 mt-2 sm:mt-0 sm:text-right">
                  <span className="text-[--accent-pink]">
                    Precio:{" "}
                    {Number(service.price).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </span>
                  <span className="text-[--electric-blue]">
                    Duración: {service.duration} min
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-gray-400">Sin servicios asignados.</p>
        )}
      </DetailSection>

      <DetailSection
        icon={<CalendarClock className="text-green-400" />}
        title="Información adicional"
      >
        <p className="mb-2">
          <span className="font-semibold text-[--electric-blue]">Estado:</span>{" "}
          <span className="capitalize">{status}</span>
        </p>
        <p>
          <span className="font-semibold text-[--accent-pink]">Creado el:</span>{" "}
          {new Date(created_at).toLocaleString()}
        </p>
      </DetailSection>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#131b2c] text-white hover:bg-[#1a2236] transition ring-1 ring-white/10"
        >
          <ChevronLeft size={18} />
          Volver
        </button>
      </div>
    </div>
  );
};

export default AttendanceDetailPage;
