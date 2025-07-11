import clsx from "clsx";
import React from "react";
import { useTheme } from "../ThemeProvider";

export function Input({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const { theme } = useTheme();

  return (
    <input
      type={type}
      className={clsx(
        "w-full px-4 py-2 rounded-sm text-sm border",
        `${theme === 'dark' ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-400"}`,
        "focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent",
        type === "number" &&
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        className
      )}
      {...props}
    />
  );
}
