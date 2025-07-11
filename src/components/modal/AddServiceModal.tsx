"use client";

import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, AttendanceProfile, Attendances } from "@/types/attendance";
import { Service } from "@/types/service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddServiceSection from "../attendances/payment/AddServiceSection";
import ClientInfo from "../attendances/payment/ClientInfo";
import ServiceList from "../attendances/payment/ServiceList";
import { useTheme } from "../ThemeProvider";
import { InputFieldSimple } from "../ui/InputFieldSimple";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceProfile: AttendanceProfile;
  selectedServices: Service[];
  filteredServices: Service[];
  search: string;
  setSelectedServices: (services: Service[]) => void;
  onSearchChange: (value: string) => void;
  onAddService: (service: Service) => void;
  onRemoveService: (id: number) => void;
  onFinish: (services: Service[], tip: number) => void;
}

export default function AddServiceModal({
  isOpen,
  onClose,
  attendanceProfile,
  selectedServices,
  setSelectedServices,
  filteredServices,
  search,
  onSearchChange,
  onAddService,
  onRemoveService,
  onFinish,
}: AddServiceModalProps) {
  const { theme } = useTheme();
  const [attendance, setAttendance] = useState<Attendance>();
  const [tip, setTip] = useState<number>(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const attendanceParams = new URLSearchParams();
    attendanceParams.set("id", String(attendanceProfile.attendance_id));
    const fetchAttendance = async () => {
      try {
        const response = (await httpInternalApi.httpGetPublic(
          `/attendances`,
          attendanceParams
        )) as Attendances;

        setAttendance(response?.attendances[0]);
        setSelectedServices(response?.attendances[0].services || []);
      } catch (error) {
        console.error("Error al cargar asistencia:", error);
      }
    };
    fetchAttendance();
  }, [attendanceProfile, setSelectedServices]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${
        theme === "dark" ? "bg-black/60" : "bg-black/30"
      } backdrop-blur`}
    >
      <div
        className={`w-full max-w-3xl relative p-6 rounded-2xl shadow-xl ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#131b2c] via-[#1b2436] to-[#1e2b40]"
            : "bg-gray-200"
        } max-h-[90vh] overflow-y-auto`}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[--electric-blue]">
          ➕ Agregar Servicios
        </h2>

        {attendance && <ClientInfo attendance={attendance} />}

        <div className="mb-6">
          <h5 className="text-lg font-medium mb-4">Servicios Seleccionados:</h5>
          <ServiceList services={selectedServices} onRemove={onRemoveService} />
        </div>

        <AddServiceSection
          services={filteredServices}
          search={search}
          onSearchChange={onSearchChange}
          onAddService={onAddService}
        />

        <div className="w-[15%]">
          <InputFieldSimple
            label="Propina"
            type="number"
            value={tip}
            onChange={(e) => setTip(Number(e.target.value))}
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md font-semibold bg-gray-500/20 hover:bg-gray-600/30 transition`}
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              try {
                if (selectedServices.length > 0) {
                  await onFinish(selectedServices, tip);
                  onClose();
                } else {
                  toast.error("Debes agregar al menos un servicio.");
                }
              } catch {
                toast.error("Error al finalizar la asistencia.");
              }
            }}
            className={`px-4 py-2 rounded-md font-semibold ${
              theme === "dark"
                ? "bg-green-700 text-white"
                : "bg-green-700 text-white"
            }  hover:bg-green-500 transition ${
              selectedServices.length === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}
