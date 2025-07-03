"use client";

import { useTheme } from "../ThemeProvider";

interface ConfirmModalProps {
  title?: string;
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title = "Confirmar acción",
  message,
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { theme } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className={`${theme === 'dark' ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg w-full max-w-md p-6`}>
        <h2 className="text-xl font-semibold mb-2 text-[--electric-blue]">
          {title}
        </h2>
        <p className={`${theme === 'dark' ? "text-gray-200" : 'text-gray-700'} mb-6`}>{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-md border ${theme === 'dark' ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"}`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
