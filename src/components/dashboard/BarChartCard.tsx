import { CardInterface } from "@/types/dashboard";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const BarChartCard = ({
  data,
  title,
  barColor,
  cardBg,
  titleColor,
}: CardInterface) => (
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
