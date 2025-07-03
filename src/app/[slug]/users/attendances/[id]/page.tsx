"use client";

import AvatarCard from "@/components/attendances/detail/AvatarCard";
import DetailSection from "@/components/attendances/detail/DetailSection";
import { useTheme } from "@/components/ThemeProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { Service } from "@/types/service";
import { translateStatus } from "@/utils/organization.utils";
import { CalendarClock, ChevronLeft, UserCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AttendanceDetailPage = () => {
  const { theme } = useTheme();
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

  const {
    profile,
    attended_by_user,
    services,
    created_at,
    status,
    total_amount,
    child_attendances,
  } = attendance;

  // Calcular total incluyendo turnos hijos
  const totalAmountWithChildren =
    Number(total_amount || 0) +
    (child_attendances?.reduce(
      (acc, child) => acc + Number(child.total_amount || 0),
      0
    ) || 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-8">
        🧾 Detalle del Turno
      </h1>

      <DetailSection
        icon={<CalendarClock className="text-green-400" />}
        title="Información"
      >
        <div className="flex items-center justify-between">
          <p>
            <span className="font-semibold">Estado:</span>{" "}
            <span className="capitalize">{translateStatus(status)}</span>
          </p>
          <p>
            <span className="font-semibold">Fecha de atención:</span>{" "}
            {new Date(created_at).toLocaleString()}
          </p>
        </div>
      </DetailSection>

      <DetailSection
        icon={<UserCircle2 className="text-[--electric-blue]" />}
        title="Cliente y Profesional"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <p className="text-sm font-semibold mb-2">Cliente</p>
            <AvatarCard
              name={profile?.name}
              email={profile?.email}
              phone={profile?.phone_number}
            />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold mb-2">Atendido por</p>
            <AvatarCard
              name={attended_by_user?.name}
              email={attended_by_user?.email}
              photo_url={attended_by_user?.photo_url}
            />
          </div>
        </div>
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
                className={`${
                  theme === "dark" ? "bg-[#1b273a]" : "bg-[#ededed]"
                } p-4 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm ring-1 ring-[--electric-blue]/10`}
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

      {attendance.child_attendances &&
        attendance.child_attendances.length > 0 && (
          <DetailSection
            icon={<UserCircle2 className="text-teal-400" />}
            title="Turnos asociados"
          >
            <ul className="space-y-4">
              {attendance.child_attendances.map((child) => (
                <li
                  key={child.id}
                  className={`${
                    theme === "dark"
                      ? "bg-[#1a263a] text-white/90"
                      : "text-black shadow-md bg-[#ededed]"
                  } p-4 rounded-xl text-sm ring-1 ring-[--electric-blue]/10 flex flex-col sm:flex-row sm:justify-between sm:items-center`}
                >
                  <div>
                    <p className="font-semibold text-[--electric-blue]">
                      Código Turno: {child.id}
                    </p>
                    <p>
                      Estado:{" "}
                      <span className="capitalize">
                        {translateStatus(child.status)}
                      </span>
                    </p>
                    {child.attended_by && (
                      <p>
                        Atendido por Id:{" "}
                        <span className="text-[--accent-pink]">
                          {child.attended_by}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <p className="text-[--accent-pink]">
                      Precio:{" "}
                      {Number(child.total_amount).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

      {status === "finished" && (
        <DetailSection
          icon={<span className="text-green-500 text-xl font-bold">$</span>}
          title="Resumen de Pago"
        >
          <div
            className={`flex items-center justify-between gap-2 text-sm ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-semibold">Propina:</span>{" "}
                {Number(0).toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </p>
              <p>
                <span className="font-semibold">Descuento aplicado:</span>{" "}
                {Number(attendance.discount).toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-semibold">Tipo de pago:</span>{" "}
                {attendance.payment_method || "No especificado"}
              </p>
              <p>
                <span className="font-semibold">Total pagado:</span>{" "}
                {totalAmountWithChildren.toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </p>
            </div>
          </div>
        </DetailSection>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            theme === "dark"
              ? "bg-[#131b2c] hover:bg-[#ededed] hover:text-gray-700"
              : "bg-[#ededed] hover:text-white hover:bg-[#1a2236]"
          } transition ring-1 ring-white/10`}
        >
          <ChevronLeft size={18} />
          Volver
        </button>
      </div>
    </div>
  );
};

export default AttendanceDetailPage;
