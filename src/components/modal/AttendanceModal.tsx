"use client";

import { useUser } from "@/contexts/UserContext";
import { translateStatus } from "@/utils/organization.utils";
import { useEffect } from "react";
import { useTheme } from "../ThemeProvider";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  att: {
    id: number;
    name: string;
    status:
      | "pending"
      | "processing"
      | "finished"
      | "postponed"
      | "canceled"
      | "declined";
  } | null;
  userName: string;
  onStart: () => void;
  onPostpone: () => void;
  onFinish: () => void;
  onDecline: () => void;
  onResume: () => void;
  onAddService: () => void;
  hasProcessing: boolean;
  hasPostponed: boolean;
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
  hasPostponed,
}: AttendanceModalProps) {
  const { theme } = useTheme();
  const { userData } = useUser();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  if (!isOpen) return null;

  const statusColors = {
    pending:
      theme === "dark"
        ? "bg-orange-200/10 text-orange-400 ring-1 ring-orange-400/40"
        : "bg-orange-400 text-white ring-1 ring-orange-400/40",
    processing:
      theme === "dark"
        ? "bg-green-200/10 text-green-400 ring-1 ring-green-400/40"
        : "bg-green-400 text-white ring-1 ring-green-400/40",
    finished:
      theme === "dark"
        ? "bg-gray-300/10 text-gray-300 ring-1 ring-gray-400/40"
        : "bg-gray-400 text-white ring-1 ring-gray-400/40",
    postponed:
      theme === "dark"
        ? "bg-gray-100/10 text-gray-300 ring-1 ring-gray-300/40"
        : "bg-gray-300 text-white ring-1 ring-gray-300/40",
    canceled:
      theme === "dark"
        ? "bg-red-100/10 text-red-400 ring-1 ring-red-400/40"
        : "bg-red-400 text-white ring-1 ring-red-400/40",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${
        theme === "dark"
          ? "g-gradient-to-br from-black/60 via-[#0a0f1c]/70 to-black/80"
          : "bg-gray-100/30"
      } backdrop-blur`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-md relative p-6 rounded-2xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#131b2c] via-[#1b2436] to-[#1e2b40]"
            : "bg-gray-300"
        } shadow-[0_10px_30px_rgba(61,217,235,0.3)] transition-all duration-300`}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[--electric-blue]">
          📝 Atención
        </h2>

        <div className="space-y-4 text-sm">
          <p>
            <span className="font-semibold">Profesional:</span>{" "}
            <span className="italic">{userName}</span>
          </p>
          <p>
            <span className="font-semibold text-[--accent-pink]">Cliente:</span>{" "}
            <span className="italic">{att?.name}</span>
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold select-none ${
              statusColors[
                att?.status && att.status !== "declined"
                  ? att.status
                  : "pending"
              ]
            }`}
          >
            Estado:{" "}
            {att
              ? translateStatus(att.status).charAt(0).toUpperCase() +
                translateStatus(att.status).slice(1)
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
                    className={`px-4 py-2 rounded-md font-semibold ${
                      theme === "dark"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-red-400 text-white"
                    } hover:bg-red-500/20 transition`}
                  >
                    Declinar
                  </button>
                  {(hasPostponed) && (
                    <button
                      onClick={onPostpone}
                      className={`px-4 py-2 rounded-md font-semibold ${
                        theme === "dark"
                          ? "bg-gray-500/10 text-gray-300"
                          : "bg-gray-300 border border-gray-400 text-gray-700"
                      } hover:bg-gray-600/20 transition`}
                    >
                      Posponer
                    </button>
                  )}
                </>
              )}
              <button
                onClick={onStart}
                className={`px-4 py-2 rounded-md font-semibold ${
                  theme === "dark"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-blue-300 text-white"
                } hover:bg-blue-500/40 transition`}
              >
                Iniciar
              </button>
            </>
          )}

          {att?.status === "processing" && (
            <>
              <button
                onClick={onAddService}
                className={`px-4 py-2 rounded-md font-semibold ${
                  theme === "dark"
                    ? "bg-yellow-500/10 text-yellow-300"
                    : "bg-yellow-300 text-white"
                } hover:bg-yellow-500/40 transition`}
              >
                Agregar Servicio
              </button>
              <button
                onClick={onFinish}
                className={`px-4 py-2 rounded-md font-semibold ${
                  theme === "dark"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-green-300 text-white"
                }  hover:bg-green-500/40 transition`}
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
