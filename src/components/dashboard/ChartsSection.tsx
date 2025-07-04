import { BarChartCard } from "./BarChartCard";

interface ChartsSectionProps {
  perService: { name: string; count: number }[];
  perUser: { name: string; count: number }[];
  perClient: { name: string; count: number }[];
  theme: "light" | "dark";
}

export const ChartsSection = ({
  perService,
  perUser,
  perClient,
  theme,
}: ChartsSectionProps) => {
  const cardBg =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
  const titleColor = theme === "dark" ? "text-white" : "text-gray-700";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};
