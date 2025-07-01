"use client";

import { useTheme } from "@/components/ThemeProvider";
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
  const { theme } = useTheme();
  const { data } = useOrganization();
  const { userData } = useUser();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
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
      ]);

      setAttendances(attendancesRes.attendances);
      setLoading(false);
    };

    fetchData();
  }, [data?.id, userData]);

  const finishedAttendances = useMemo(
    () => attendances.filter((a) => a.status === "finished"),
    [attendances]
  );

  const activeAttendances = useMemo(
    () =>
      attendances.filter((a) =>
        ["pending", "processing", "completed"].includes(a.status)
      ),
    [attendances]
  );

  const revenue = useMemo(
    () =>
      finishedAttendances.reduce((sum, a) => sum + (a.total_amount ?? 0), 0),
    [finishedAttendances]
  );

  const organizationRevenue = useMemo(
    () =>
      finishedAttendances.reduce(
        (sum, a) => sum + (a.organization_amount ?? 0),
        0
      ),
    [finishedAttendances]
  );

  const userRevenue = useMemo(
    () => finishedAttendances.reduce((sum, a) => sum + (a.user_amount ?? 0), 0),
    [finishedAttendances]
  );

  const totalDiscount = useMemo(
    () => finishedAttendances.reduce((sum, a) => sum + (a.discount ?? 0), 0),
    [finishedAttendances]
  );

  const totalExtraDiscount = useMemo(
    () =>
      finishedAttendances.reduce((sum, a) => sum + (a.extra_discount ?? 0), 0),
    [finishedAttendances]
  );

  const perService = useMemo(() => {
    const map: Record<string, number> = {};
    attendances.forEach((a) => {
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
    attendances.forEach((a) => {
      const name = a.attended_by_user?.name || "Sin asignar";
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

  const containerClass =
    theme === "dark" ? "text-white bg-gray-900" : "text-black bg-white";
  const cardBg =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
  const titleColor = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div
      className={`w-full flex flex-col justify-center space-y-6 p-6 mx-auto ${containerClass}`}
    >
      <h1 className="text-2xl font-bold">📊 Dashboard del día</h1>

      {/* Resumen Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Reservas"
          value={attendances.length}
          color="text-sky-500"
          cardBg={cardBg}
          titleColor={titleColor}
        />
        <Card
          title="Reservas Activas"
          value={activeAttendances.length}
          color="text-yellow-500"
          cardBg={cardBg}
          titleColor={titleColor}
        />
        <Card
          title="Reservas Finalizadas"
          value={finishedAttendances.length}
          color="text-green-500"
          cardBg={cardBg}
          titleColor={titleColor}
        />
      </div>

      {/* Totales monetarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Ingresos Totales"
          value={`$${revenue.toLocaleString()}`}
          color="text-green-600"
          cardBg={cardBg}
          titleColor={titleColor}
        />
        <Card
          title="Monto Descuentos"
          value={`$${totalDiscount.toLocaleString()}`}
          color="text-red-500"
          cardBg={cardBg}
          titleColor={titleColor}
        />
        <Card
          title="Extra Descuentos"
          value={`$${totalExtraDiscount.toLocaleString()}`}
          color="text-orange-400"
          cardBg={cardBg}
          titleColor={titleColor}
        />
        <Card
          title="Ingresos Organización"
          value={`$${organizationRevenue.toLocaleString()}`}
          color="text-indigo-500"
          cardBg={cardBg}
          titleColor={titleColor}
        />
        <Card
          title="Ingresos Usuarios"
          value={`$${userRevenue.toLocaleString()}`}
          color="text-teal-500"
          cardBg={cardBg}
          titleColor={titleColor}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BarChartCard
          data={perService}
          title="Por Servicio"
          barColor={theme === "dark" ? "#f87171" : "#F55376"}
          cardBg={cardBg}
          titleColor={titleColor}
        />
        <BarChartCard
          data={perUser}
          title="Por Usuario"
          barColor={theme === "dark" ? "#60a5fa" : "#3DD9EB"}
          cardBg={cardBg}
          titleColor={titleColor}
        />
        <BarChartCard
          data={perClient}
          title="Por Cliente"
          barColor={theme === "dark" ? "#818cf8" : "#007bff"}
          cardBg={cardBg}
          titleColor={titleColor}
        />
      </div>
    </div>
  );
}

interface CardInterface {
  data?: {
    name: string;
    count: number;
  }[];
  barColor?: string;
  title?: string;
  value?: string | number;
  color?: string;
  cardBg?: string;
  titleColor?: string;
}

const Card = ({ title, value, color, cardBg, titleColor }: CardInterface) => (
  <div className={`p-4 rounded-2xl shadow-xl ${cardBg}`}>
    <h2 className={`text-lg font-semibold ${titleColor}`}>{title}</h2>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const BarChartCard = ({ data, title, barColor, cardBg, titleColor }: CardInterface) => (
  <div className={`p-4 rounded-2xl shadow-xl h-[350px] ${cardBg}`}>
    <h2 className={`text-xl font-bold mb-4 ${titleColor}`}>{title}</h2>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke={titleColor === "text-white" ? "#ccc" : "#333"}
        />
        <YAxis stroke={titleColor === "text-white" ? "#ccc" : "#333"} />
        <Tooltip
          contentStyle={{
            backgroundColor: titleColor === "text-white" ? "#1f2937" : "#fff",
            borderColor: "#888",
            color: titleColor === "text-white" ? "#fff" : "#000",
          }}
        />
        <Bar dataKey="count" fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
