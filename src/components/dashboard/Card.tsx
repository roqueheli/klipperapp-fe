import { CardInterface } from "@/types/dashboard";

export const Card = ({
  title,
  value,
  color,
  cardBg,
  titleColor,
}: CardInterface) => (
  <div className={`p-4 rounded-2xl shadow-xl ${cardBg}`}>
    <h2 className={`text-lg font-semibold ${titleColor}`}>{title}</h2>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);
