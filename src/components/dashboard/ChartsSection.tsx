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
  const titleColor = theme === "dark" ? "text-white" : "text-gray-700";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BarChartCard
        data={perService}
        title="Por Servicio"
        barColor={theme === "dark" ? "#f47145" : "#E53E3E"}
        cardBg={theme === "dark" ? "bg-gray-900" : "bg-gray-100"}
        titleColor={titleColor}
      />
      <BarChartCard
        data={perUser}
        title="Por Usuario"
        barColor={theme === "dark" ? "#63b3ed" : "#3498db"}
        cardBg={theme === "dark" ? "bg-gray-900" : "bg-gray-100"}
        titleColor={titleColor}
      />
      <BarChartCard
        data={perClient}
        title="Por Cliente"
        barColor={theme === "dark" ? "#55d6be" : "#1abc9c"}
        cardBg={theme === "dark" ? "bg-gray-900" : "bg-gray-100"}
        titleColor={titleColor}
      />
    </div>
  );
};
