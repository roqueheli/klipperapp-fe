"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const { data } = useOrganization();
  const { userData } = useUser();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  // const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (data?.id !== undefined) {
        params.set("organization_id", String(data.id));
      }
      if (userData?.id !== undefined && userData?.role.name !== "admin") {
        params.set("branch_id", String(userData?.branch_id));
      }
      if (userData?.role.name === "agent") {
        params.set("attended_by", String(userData?.id));
      }

      const [attendancesRes] = await Promise.all([
        httpInternalApi.httpGetPublic(
          "/attendances/today",
          params
        ) as Promise<Attendances>,
        // httpInternalApi.httpGetPublic(
        //   "/profiles",
        //   params
        // ) as Promise<ProfileDashboardResponse>,
      ]);

      setAttendances(attendancesRes.attendances);
      // setProfiles(profilesRes.profiles);
      setLoading(false);
    };

    fetchData();
  }, [data?.id, userData]);

  const finishedAttendances = useMemo(
    () => (attendances ?? []).filter((a) => a.status === "finished"),
    [attendances]
  );

  const activeAttendances = useMemo(
    () =>
      (attendances ?? []).filter((a) =>
        ["pending", "processing", "completed"].includes(a.status)
      ),
    [attendances]
  );

  const revenue = useMemo(
    () =>
      (finishedAttendances ?? []).reduce(
        (sum, a) => sum + (a.total_amount ?? 0),
        0
      ),
    [finishedAttendances]
  );

  const organizationRevenue = useMemo(
    () =>
      (finishedAttendances ?? []).reduce(
        (sum, a) => sum + (a.organization_amount ?? 0),
        0
      ),
    [finishedAttendances]
  );

  const userRevenue = useMemo(
    () =>
      (finishedAttendances ?? []).reduce(
        (sum, a) => sum + (a.user_amount ?? 0),
        0
      ),
    [finishedAttendances]
  );

  const totalDiscount = useMemo(
    () =>
      (finishedAttendances ?? []).reduce(
        (sum, a) => sum + (a.discount ?? 0),
        0
      ),
    [finishedAttendances]
  );

  const totalExtraDiscount = useMemo(
    () =>
      (finishedAttendances ?? []).reduce(
        (sum, a) => sum + (a.extra_discount ?? 0),
        0
      ),
    [finishedAttendances]
  );

  const perService = useMemo(() => {
    const map: Record<string, number> = {};

    (attendances ?? []).forEach((a) => {
      const services = a.services ?? [];

      if (services.length === 0) {
        map["Sin servicio"] = (map["Sin servicio"] || 0) + 1;
      } else {
        services.forEach((s) => {
          map[s.name] = (map[s.name] || 0) + 1;
        });
      }
    });

    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [attendances]);

  const perUser = useMemo(() => {
    const map: Record<string, number> = {};
    (attendances ?? []).forEach((a) => {
      const name = a.attended_by_user?.name || "Sin asignar";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [attendances]);

  const perClient = useMemo(() => {
    const map: Record<string, number> = {};
    (attendances ?? []).forEach((a) => {
      const name = a.profile?.name || "Desconocido";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [attendances]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full flex flex-col justify-center space-y-6 p-6 mx-auto text-white">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Dashboard del día
      </h1>

      {/* Resumen de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Reservas
          </h2>
          <p className="text-2xl font-bold text-blue-500">
            {attendances?.length || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Reservas Activas
          </h2>
          <p className="text-2xl font-bold text-yellow-500">
            {activeAttendances?.length || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Reservas Finalizadas
          </h2>
          <p className="text-2xl font-bold text-green-500">
            {finishedAttendances?.length || 0}
          </p>
        </div>
      </div>

      {/* Montos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Ingresos Totales
          </h2>
          <p className="text-2xl font-bold text-green-600">
            ${revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Monto Descuentos
          </h2>
          <p className="text-2xl font-bold text-red-500">
            ${totalDiscount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Monto Extra Descuentos
          </h2>
          <p className="text-2xl font-bold text-pink-500">
            ${totalExtraDiscount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Ingresos Organización
          </h2>
          <p className="text-2xl font-bold text-blue-600">
            ${organizationRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Ingresos Usuarios
          </h2>
          <p className="text-2xl font-bold text-cyan-600">
            ${userRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-black">
        {/* Por tipo de servicio */}
        <div className="bg-white p-4 rounded-2xl shadow-xl h-[350px]">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Por Servicio</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perService}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#F55376" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Por usuario */}
        <div className="bg-white p-4 rounded-2xl shadow-xl h-[350px]">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Por Usuario</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perUser}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3DD9EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Por cliente */}
        <div className="bg-white mb-10 p-4 rounded-2xl shadow-xl h-[350px]">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Por Cliente</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perClient}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
