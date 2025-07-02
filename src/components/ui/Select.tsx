import React from "react";

export function Select({
  value,
  onValueChange,
  children,
  ...props
}: {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border border-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
      {...props}
    >
      {children}
    </select>
  );
}
