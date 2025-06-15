"use client";

import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  att: {
    id: number;
    name: string;
    status: "pending" | "processing" | "finished";
  } | null;
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
  const { userData } = useUser();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  if (!isOpen) return null;

  // Colores para status
  const statusColors = {
    pending:
      "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
    processing:
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    finished: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        className="w-full max-w-md p-7 rounded-xl
        bg-white dark:bg-[#121212]
        text-gray-900 dark:text-white
        shadow-[0_2px_8px_rgba(61,217,235,0.3)]
        hover:shadow-[0_2px_12px_rgba(61,217,235,0.5)]
        dark:shadow-[0_2px_8px_rgba(61,217,235,0.3)]
        dark:hover:shadow-[0_2px_12px_rgba(61,217,235,0.5)]
        relative
        transition-shadow duration-300"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors"
        >
          ×
        </button>

        <h2
          id="modal-title"
          className="text-2xl font-extrabold mb-6 flex items-center space-x-2"
        >
          <span>📝</span>
          <span>Atención</span>
        </h2>

        <div className="mb-5 space-y-3">
          <p className="text-sm">
            <span className="font-semibold text-[--electric-blue]">
              Profesional:
            </span>{" "}
            <span className="italic">{userName}</span>
          </p>
          <p className="text-sm">
            <span className="font-semibold text-[--accent-pink]">Cliente:</span>{" "}
            <span className="italic">{att?.name}</span>
          </p>
          <p
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold select-none ${
              statusColors[att?.status || "pending"]
            }`}
          >
            Estado: {att?.status.charAt(0).toUpperCase() + (att?.status.slice(1) || "pending")}
          </p>
        </div>

        {att?.status === "pending" && (
          <div className="flex justify-end space-x-3">
            {userData?.role_id !== 3 && (
              <>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-md font-semibold bg-red-100 text-red-700 dark:bg-red-800 dark:text-white hover:bg-red-200 dark:hover:bg-red-700 transition"
                >
                  Declinar
                </button>
                <button
                  onClick={onPostpone}
                  className="px-5 py-2 rounded-md font-semibold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Posponer
                </button>
              </>
            )}
            <button
              onClick={onStart}
              className="px-5 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Iniciar
            </button>
          </div>
        )}

        {att?.status === "processing" && (
          <div className="flex justify-end">
            <button
              onClick={onFinish}
              className="px-6 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition"
            >
              Finalizar
            </button>
          </div>
        )}

        {att?.status === "finished" && (
          <p className="text-center text-sm italic text-gray-500 dark:text-gray-400 mt-4">
            Esta atención ya ha sido finalizada.
          </p>
        )}
      </div>
    </div>
  );
}
