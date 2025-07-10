import { useTheme } from "@/components/ThemeProvider";
import clsx from "clsx";
import { ReactNode } from "react";

interface InputCardProps {
  label: string;
  icon?: string;
  children: ReactNode;
}

export default function InputCard({ label, icon, children }: InputCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={clsx(
        "p-4 rounded border shadow-md flex justify-between items-center",
        isDark ? "border-gray-700" : "border-gray-300"
      )}
    >
      <label className="text-sm font-medium">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
