import { useTheme } from "@/components/ThemeProvider";
import { Card } from "./Card";

interface StatisticsProps {
  statistics: {
    total_profiles: number;
    total_new_profiles: number;
    total_concurrent_profiles: number;
    most_services: string;
    total_attendances: number;
  };
}

export const StatisticsCards = ({ statistics }: StatisticsProps) => {
  const { theme } = useTheme();
  const cardBg =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
  const titleColor = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        title="Total de Atenciones"
        value={statistics?.total_attendances || 0}
        color="text-orange-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      <Card
        title="Clientes Totales"
        value={statistics?.total_profiles || 0}
        color="text-blue-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      <Card
        title="Clientes Nuevos"
        value={statistics?.total_new_profiles || 0}
        color="text-green-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
      <Card
        title="Servicio más solicitado"
        value={statistics?.most_services || "-"}
        color="text-pink-500"
        cardBg={cardBg}
        titleColor={titleColor}
      />
    </div>
  );
};
