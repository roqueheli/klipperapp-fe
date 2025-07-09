import { useTheme } from "@/components/ThemeProvider";
import { useUser } from "@/contexts/UserContext";
import { Card } from "./Card";

interface SummaryCardsProps {
  metrics: {
    total: number;
    active: number;
    finished: number;
    revenue: number;
    totalDiscount: number;
    totalExtraDiscount: number;
    totalTips: number;
    organizationRevenue: number;
    userRevenue: number;
  };
}

export const SummaryCards = ({ metrics }: SummaryCardsProps) => {
  const { userData } = useUser();
  const { theme } = useTheme();
  const cardBg =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
  const titleColor = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {userData?.role.name === "admin" && (
        <>
          <Card
            title="Total Reservas"
            value={metrics.total}
            color="text-sky-500"
            cardBg={cardBg}
            titleColor={titleColor}
          />
          <Card
            title="Reservas Activas"
            value={metrics.active}
            color="text-yellow-500"
            cardBg={cardBg}
            titleColor={titleColor}
          />
        </>
      )}
      <Card
        title="Reservas Finalizadas"
        value={metrics.finished}
        color="text-green-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      {userData?.role.name === "admin" && (
        <Card
          title="Ingresos Totales"
          value={`$${metrics?.revenue?.toLocaleString() || 0}`}
          color="text-green-600"
          cardBg={cardBg}
          titleColor={titleColor}
        />
      )}
      <Card
        title="Descuentos"
        value={`$${metrics?.totalDiscount?.toLocaleString() || 0}`}
        color="text-red-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      {userData?.role.name === "admin" && (
        <Card
          title="Alicuota"
          value={`$${metrics?.totalExtraDiscount?.toLocaleString() || 0}`}
          color="text-orange-400"
          cardBg={cardBg}
          titleColor={titleColor}
        />
      )}
      <Card
        title="Propinas"
        value={`$${metrics?.totalTips?.toLocaleString() || 0}`}
        color="text-blue-400"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      {userData?.role.name === "admin" && (
        <Card
          title="Ingresos Organización"
          value={`$${metrics?.organizationRevenue?.toLocaleString() || 0}`}
          color="text-indigo-500"
          cardBg={cardBg}
          titleColor={titleColor}
        />
      )}
      <Card
        title={`Ingresos ${userData?.role.name === "admin" ? "Usuarios" : ""}`}
        value={`$${metrics?.userRevenue?.toLocaleString() || 0}`}
        color="text-teal-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
    </div>
  );
};
