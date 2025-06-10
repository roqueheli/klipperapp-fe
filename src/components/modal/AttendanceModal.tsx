"use client";

import { useEffect } from "react";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  att: {
    id: number;
    name: string;
    status: "pending" | "processing" | "finished";
  };
  userName: string;
  onStart: () => void;
  onPostpone: () => void;
  onFinish: () => void;
}

export default function AttendanceModal({
  isOpen,
  onClose,
  att,
  userName,
  onStart,
  onPostpone,
  onFinish,
}: AttendanceModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-xl transition-shadow duration-300 relative 
          bg-white dark:bg-black 
          text-gray-900 dark:text-white 
          shadow-[0_2px_8px_rgba(61,217,235,0.3)] 
          hover:shadow-[0_2px_12px_rgba(61,217,235,0.5)] 
          dark:shadow-[0_2px_8px_rgba(245,83,118,0.3)] 
          dark:hover:shadow-[0_2px_12px_rgba(245,83,118,0.5)]"
        >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 dark:text-gray-400 hover:text-red-500 text-lg"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">📝 Atención</h2>
        <p className="mb-2">
          <strong>Profesional:</strong> {userName}
        </p>
        <p className="mb-4">
          <strong>Cliente:</strong> {att.name}
        </p>

        {att.status === "pending" && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-red-100 text-red-700 dark:bg-red-800 dark:text-white px-4 py-2 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
            >
              Cancelar
            </button>
            <button
              onClick={onPostpone}
              className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Posponer
            </button>
            <button
              onClick={onStart}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Iniciar
            </button>
          </div>
        )}

        {att.status === "processing" && (
          <div className="flex justify-end">
            <button
              onClick={onFinish}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
