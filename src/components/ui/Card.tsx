import clsx from "clsx";
import React from "react";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "bg-[var(--cyber-gray)] rounded-2xl shadow-md p-4 border border-[var(--electric-blue)]",
        "transition-transform hover:scale-[1.01]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="overflow-auto h-full flex flex-col text-[var(--soft-white)]">{children}</div>;
}
