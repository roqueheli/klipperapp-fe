"use client";

import { useTheme } from "@/components/ThemeProvider";
import clsx from "clsx";

interface SummaryCardProps {
  label: string;
  value: number | string;
  icon?: string;
  color?: string; // Ej: text-green-600
}

export default function SummaryCard({
  label,
  value,
  icon = "",
  color = "text-black",
}: SummaryCardProps) {
  const { theme } = useTheme();

  return (
    <div
      className={clsx(
        "rounded-lg shadow-md p-4 flex items-center justify-between",
        theme === "dark"
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
      )}
    >
      <span className={`${theme === 'dark' ? "text-gray-300" : "text-gray-500"}`}>
        {icon} {label}
      </span>
      <span className={clsx("font-bold", color)}>
        ${value.toLocaleString("es-CL")}
      </span>
    </div>
  );
}
