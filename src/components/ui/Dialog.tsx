import React from "react";

interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  if (!open) return null; // no renderiza si no está abierto

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)} // ejemplo para cerrar al hacer click en fondo
    >
      {children}
    </div>
  );
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--cyber-gray)] text-[var(--soft-white)] rounded-2xl shadow-xl max-w-lg w-full p-6 border border-[var(--electric-blue)]">
      {children}
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-[var(--electric-blue)]">
      {children}
    </h2>
  );
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex justify-end gap-2">{children}</div>;
}
