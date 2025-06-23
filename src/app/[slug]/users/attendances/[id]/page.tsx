"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Attendance, Attendances } from "@/types/attendance";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import httpInternalApi from "../../../../../lib/common/http.internal.service";
import { Service } from "@/types/service";

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

  const { profile, attended_by_user, services, created_at, status } = attendance;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="mt-10 mb-4 text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-600">
        🧾 Detalle del Turno
      </h1>

      <DetailSection title="Teléfono del cliente">
        <AvatarCard
          name={profile?.name}
          email={profile?.email}
          phone={profile?.phone_number}
        />
      </DetailSection>

      <DetailSection title="Profesional asignado">
        <AvatarCard
          name={attended_by_user?.name}
          email={attended_by_user?.email}
        />
      </DetailSection>

      <DetailSection title="Servicios">
        {services === undefined || services?.length === 0 ? (
          <p className="text-gray-500">Sin servicios asignados.</p>
        ) : (
          <ul className="pl-5 space-y-2">
            {services.map((service: Service, index) => (
              <li className="p-4 w-full flex justify-between items-center" key={`${service.id}-${index}`}>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Precio: {Number(service.price).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Duración: {service?.duration} minutos
                </p>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection title="Información adicional">
        <p>
          <span className="font-semibold">Estado:</span>{" "}
          <span className="capitalize">{status}</span>
        </p>
        <p>
          <span className="font-semibold">Creado el:</span>{" "}
          {new Date(created_at).toLocaleString()}
        </p>
      </DetailSection>

      <div className="flex justify-end mb-3">
        <BackButton onClick={() => router.back()} />
      </div>
    </div>
  );
};

// --- Componentes reutilizables ---

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
      {title}
    </h2>
    {children}
  </section>
);

const AvatarCard = ({
  name,
  email,
  phone,
}: {
  name?: string;
  email?: string;
  phone?: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-full text-gray-400 text-xl">
      {name?.charAt(0) || "?"}
    </div>
    <div>
      <p className="font-medium text-gray-800 dark:text-gray-100">
        {name || "Sin nombre"}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {email || "Sin email"}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {phone || "Sin teléfono"}
      </p>
    </div>
  </div>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
  >
    Volver
  </button>
);

export default AttendanceDetailPage;
