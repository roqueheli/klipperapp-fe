"use client";

import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  att: {
    id: number;
    name: string;
    status: "pending" | "processing" | "finished" | "postponed" | "canceled" | "declined";
  } | null;
  userName: string;
  onStart: () => void;
  onPostpone: () => void;
  onFinish: () => void;
  onDecline: () => void;
  onResume: () => void;
  onAddService: () => void;
  hasProcessing: boolean;
}

export default function AttendanceModal({
  isOpen,
  onClose,
  att,
  userName,
  onStart,
  onPostpone,
  onFinish,
  onDecline,
  onResume,
  onAddService,
  hasProcessing,
}: AttendanceModalProps) {
  const { userData } = useUser();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  if (!isOpen) return null;

  const statusColors = {
    pending: "bg-orange-200/10 text-orange-400 ring-1 ring-orange-400/40",
    processing: "bg-green-200/10 text-green-400 ring-1 ring-green-400/40",
    finished: "bg-gray-300/10 text-gray-300 ring-1 ring-gray-400/40",
    postponed: "bg-gray-100/10 text-gray-300 ring-1 ring-gray-300/40",
    canceled: "bg-red-100/10 text-red-400 ring-1 ring-red-400/40",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gradient-to-br from-black/60 via-[#0a0f1c]/70 to-black/80 backdrop-blur"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md relative p-6 rounded-2xl bg-gradient-to-br from-[#131b2c] via-[#1b2436] to-[#1e2b40] text-white shadow-[0_10px_30px_rgba(61,217,235,0.3)] transition-all duration-300">
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[--electric-blue]">
          📝 Atención
        </h2>

        <div className="space-y-4 text-sm">
          <p>
            <span className="font-semibold text-[--electric-blue]">
              Profesional:
            </span>{" "}
            <span className="italic text-white/80">{userName}</span>
          </p>
          <p>
            <span className="font-semibold text-[--accent-pink]">Cliente:</span>{" "}
            <span className="italic text-white/80">{att?.name}</span>
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold select-none ${
              statusColors[(att?.status && att.status !== "declined") ? att.status : "pending"]
            }`}
          >
            Estado:{" "}
            {att
              ? att.status.charAt(0).toUpperCase() + att.status.slice(1)
              : ""}
          </span>
        </div>

        <div className="mt-6 flex justify-end flex-wrap gap-3">
          {att?.status === "pending" && (
            <>
              {userData?.role.name !== "agent" && (
                <>
                  <button
                    onClick={onDecline}
                    className="px-4 py-2 rounded-md font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                  >
                    Declinar
                  </button>
                  <button
                    onClick={onPostpone}
                    className="px-4 py-2 rounded-md font-semibold bg-gray-500/10 text-gray-300 hover:bg-gray-600/20 transition"
                  >
                    Posponer
                  </button>
                </>
              )}
              <button
                onClick={onStart}
                className="px-4 py-2 rounded-md font-semibold bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 transition"
              >
                Iniciar
              </button>
            </>
          )}

          {att?.status === "processing" && (
            <>
              <button
                onClick={onAddService}
                className="px-4 py-2 rounded-md font-semibold bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40 transition"
              >
                Agregar Servicio
              </button>
              <button
                onClick={onFinish}
                className="px-4 py-2 rounded-md font-semibold bg-green-500/20 text-green-300 hover:bg-green-500/40 transition"
              >
                Finalizar
              </button>
            </>
          )}

          {att?.status === "postponed" && (
            <>
              {userData?.role.name !== "agent" && (
                <>
                  <button
                    onClick={onDecline}
                    className="px-4 py-2 rounded-md font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                  >
                    Declinar
                  </button>
                  {hasProcessing && (
                    <button
                      onClick={onResume}
                      className="px-4 py-2 rounded-md font-semibold bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 transition"
                    >
                      Reanudar
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {att?.status === "finished" && (
            <p className="w-full text-center text-sm italic text-gray-400 mt-2">
              Esta atención ya ha sido finalizada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
