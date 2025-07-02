import { useTheme } from "@/components/ThemeProvider";
import { SummaryItem } from "@/types/dashboard";
import {
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface AttendanceLineChartProps {
  data: SummaryItem[];
}

const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export const AttendanceLineChart = ({ data }: AttendanceLineChartProps) => {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#ccc" : "#333";
  const bgColor = theme === "dark" ? "#1f2937" : "#fff";

  const formatShortNumber = (value: number): string => {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(0) + "k";
    return value.toString();
  };

  return (
    <div
      className={`p-4 rounded-2xl shadow-xl h-[400px] ${
        theme === "dark" ? "bg-gray-800 mb-8" : "bg-white"
      }`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${
          theme === "dark" ? "text-gray-200" : "text-gray-700"
        }`}
      >
        📆 Línea de tiempo de atenciones
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            stroke={textColor}
            tickFormatter={(date: string) => {
              const d = new Date(date);
              return d.getDate().toString();
            }}
          />
          <YAxis
            stroke={textColor}
            tickFormatter={(value) => formatShortNumber(value)}
          />
          <Tooltip
            contentStyle={{ backgroundColor: bgColor }}
            formatter={(value: any) =>
              typeof value === "number" ? currencyCLP.format(value) : value
            }
            labelFormatter={(label: string) => {
              const date = new Date(label);
              return date.toLocaleDateString("es-CL", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_attendances"
            stroke="#3b82f6"
            name="Total Atenciones"
          />
          <Line
            type="monotone"
            dataKey="organization_amount"
            stroke="#8b5cf6"
            name="Org. Ganancias"
          />
          <Line
            type="monotone"
            dataKey="user_amount"
            stroke="#10b981"
            name="Usuarios Ganancias"
          />
          <Line
            type="monotone"
            dataKey="total_amount"
            stroke="#f59e0b"
            name="Monto Total"
          />
          <Line
            type="monotone"
            dataKey="discount"
            stroke="#ef4444"
            name="Descuentos"
          />
          <Line
            type="monotone"
            dataKey="extra_discount"
            stroke="#ec4899"
            name="Alicuota"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
