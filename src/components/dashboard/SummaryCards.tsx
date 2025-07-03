import { useTheme } from "@/components/ThemeProvider";
import { Card } from "./Card";

interface SummaryCardsProps {
  metrics: {
    total: number;
    active: number;
    finished: number;
    revenue: number;
    totalDiscount: number;
    totalExtraDiscount: number;
    organizationRevenue: number;
    userRevenue: number;
  };
}

export const SummaryCards = ({ metrics }: SummaryCardsProps) => {
  const { theme } = useTheme();
  const cardBg =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
  const titleColor = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <Card
        title="Reservas Finalizadas"
        value={metrics.finished}
        color="text-green-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      <Card
        title="Ingresos Totales"
        value={`$${metrics?.revenue?.toLocaleString() || 0}`}
        color="text-green-600"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      <Card
        title="Monto Descuentos"
        value={`$${metrics?.totalDiscount?.toLocaleString() || 0}`}
        color="text-red-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      <Card
        title="Extra Descuentos"
        value={`$${metrics?.totalExtraDiscount?.toLocaleString() || 0}`}
        color="text-orange-400"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      <Card
        title="Ingresos Organización"
        value={`$${metrics?.organizationRevenue?.toLocaleString() || 0}`}
        color="text-indigo-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      <Card
        title="Ingresos Usuarios"
        value={`$${metrics?.userRevenue?.toLocaleString() || 0}`}
        color="text-teal-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
    </div>
  );
};
