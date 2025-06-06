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
      className="bg-[var(--cyber-gray)] text-[var(--soft-white)] border border-[var(--electric-blue)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
      {...props}
    >
      {children}
    </select>
  );
}
