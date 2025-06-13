import clsx from "clsx";
import React from "react";

export function Table({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "w-full overflow-x-auto rounded-2xl border border-[var(--electric-blue)]",
        className
      )}
    >
      <table className="min-w-full divide-y divide-[var(--electric-blue)] text-[var(--soft-white)]">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-[var(--cyber-gray)] text-left text-sm uppercase font-medium text-[var(--electric-blue)]">
      {children}
    </thead>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="w-full hover:bg-[var(--accent-pink)/10] transition">{children}</tr>
  );
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="flex-grow overflow-auto divide-y divide-gray-700">{children}</tbody>;
}

export function TableHeadCell({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={clsx("w-full px-4 py-3 font-medium", className)} {...props}>
      {children}
    </th>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}
