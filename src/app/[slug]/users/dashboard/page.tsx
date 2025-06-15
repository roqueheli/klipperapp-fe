"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending: "#3DD9EB",
  processing: "#007bff",
  finished: "#4CAF50",
  completed: "#A1E3A1",
  canceled: "#F55376",
};

export default function DashboardPage() {
  const { slug, data } = useOrganization();
  const { userData } = useUser();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (data?.id !== undefined) {
        params.set("organization_id", String(data.id));
      }
      if (userData?.id !== undefined && userData?.role_id !== 1) {
        params.set("branch_id", String(userData?.branch_id));
      }
      if (userData?.role_id === 3) {
        params.set("attended_by", String(userData?.id));
      }

      const response = (await httpInternalApi.httpGetPublic(
        "/attendances",
        params
      )) as Attendances;
      setAttendances(response.attendances);
      setLoading(false);
    };

    fetchData();
  }, [data?.id, userData]);

  const filteredAttendances = useMemo(() => {
    if (!filterStatus) return attendances;
    return attendances.filter((a) => a.status === filterStatus);
  }, [attendances, filterStatus]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    attendances.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_COLORS[status] || "#ccc",
    }));
  }, [attendances]);

  const revenue = useMemo(() => {
    return attendances.reduce(
      (sum, a) => sum + parseFloat(a.service?.price || "0"),
      0
    );
  }, [attendances]);

  const perBarber = useMemo(() => {
    const map: Record<string, number> = {};
    attendances.forEach((a) => {
      const name = a.attended_by_user?.name || "Sin asignar";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [attendances]);

  const perService = useMemo(() => {
    const map: Record<string, number> = {};
    attendances.forEach((a) => {
      const name = a.service?.name || "Sin servicio";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [attendances]);

  const perClient = useMemo(() => {
    const map: Record<string, number> = {};
    attendances.forEach((a) => {
      const name = a.profile?.name || "Desconocido";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [attendances]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full flex flex-col justify-center space-y-6 p-10 mx-auto text-white">
      <h1 className="mt-15 text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Dashboard de Atenciones
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Reservas
          </h2>
          <p className="text-2xl font-bold text-blue-500">
            {attendances.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Ingresos Totales
          </h2>
          <p className="text-2xl font-bold text-green-500">
            ${revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold text-gray-700">
            Filtrar por Estado
          </h2>
          <select
            value={filterStatus || ""}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          >
            <option value="">Todos</option>
            {Object.keys(STATUS_COLORS).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-xl h-[350px]">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Distribución por Estado
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusCounts}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {statusCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-xl h-[350px]">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Atenciones por Barbero
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perBarber}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3DD9EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Gráfico por tipo de servicio */}
        <div className="bg-white p-4 rounded-2xl shadow-xl h-[350px]">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Atenciones por Tipo de Servicio
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perService}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#F55376" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico por cliente */}
        <div className="bg-white p-4 rounded-2xl shadow-xl h-[350px]">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Atenciones por Cliente
          </h2>
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

      <div className="flex justify-center mt-6">
        <button
          onClick={() => router.push(`/${slug}/users`)}
          className="px-6 py-3 text-white rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-md transition-all"
        >
          ⬅ Volver
        </button>
      </div>
    </div>
  );
}
