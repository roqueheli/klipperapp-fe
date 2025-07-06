"use client";

import AddServiceSection from "@/components/attendances/payment/AddServiceSection";
import ClientInfo from "@/components/attendances/payment/ClientInfo";
import ServiceList from "@/components/attendances/payment/ServiceList";
import TransactionActionButtons from "@/components/attendances/payment/TransactionActionButtons";
import TransactionSummary from "@/components/attendances/payment/TransactionSummary";
import UnifiedAttendancesList from "@/components/attendances/payment/UnifiedAttendancesList";
import UnifyPaymentsModal from "@/components/modal/UnifyPaymentsModal";
import { useTheme } from "@/components/ThemeProvider";
import { Attendance } from "@/types/attendance";
import { Organization } from "@/types/organization";
import { Service } from "@/types/service";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  organization: Organization;
  userData: User;
  attendance: Attendance;
  services: Service[];
  total: number;
  finalTotal: number;
  amountPaid: number;
  discount: number;
  paymentType: string;
  availableServices: Service[];
  search: string;
  isModalOpen: boolean;
  selectedAttendances: Attendance[];
  setSelectedAttendances: React.Dispatch<React.SetStateAction<Attendance[]>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleAddService: (service: Service) => void;
  handleAddServiceToAttendance: (
    attendanceId: number,
    service: Service
  ) => void;
  handleExecuteTransaction: () => void;
  setSelectedServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setDiscount: React.Dispatch<React.SetStateAction<number>>;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateAttendance: (updatedAttendance: Attendance) => void;
  isSubmitting: boolean;
}

const PaymentsContainer = ({
  organization,
  userData,
  attendance,
  services,
  total,
  finalTotal,
  amountPaid,
  discount,
  paymentType,
  availableServices,
  search,
  isModalOpen,
  selectedAttendances,
  setSelectedAttendances,
  setIsModalOpen,
  setSearch,
  handleAddService,
  handleAddServiceToAttendance,
  handleExecuteTransaction,
  setSelectedServices,
  setPaymentType,
  setDiscount,
  handleUpdateAttendance,
  isSubmitting,
}: Props) => {
  const { theme } = useTheme();
  const [filteredServices, setFilteredServices] = useState(availableServices);

  useEffect(() => {
    setFilteredServices(
      availableServices.filter((service) =>
        service.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, availableServices]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleAddAttendances = (attendances: Attendance[]) => {
    setSelectedAttendances(attendances);

    // Extraer servicios únicos de las asistencias
    const unifiedServices = attendances
      .flatMap((a) => a.services || [])
      .filter(
        (s, index, self) => self.findIndex((x) => x.id === s.id) === index
      );

    // Agregar los servicios a selectedServices si no están ya presentes
    setSelectedServices((prev) => {
      const existingIds = new Set(prev.map((s) => s.id));
      const newServices = unifiedServices.filter((s) => !existingIds.has(s.id));
      
      // Mostrar un toast por cada servicio agregado
      newServices.forEach((service) => {
        toast.success(`Servicio "${service.name}" agregado`, {
          duration: 3000,
          style: {
            animation: "fade-out-slow 3s forwards",
            width: "600px",
          },
        });
      });

      return [...prev, ...newServices];
    });
  };

  return (
    <div className="w-full mx-auto p-4">
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 text-gray-100"
            : "bg-white text-gray-900 border border-gray-300"
        } shadow-lg rounded-md p-6`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{`Detalle de la transacción: `}{attendance.id}</h2>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            Unificar Pagos
          </button>
          <UnifyPaymentsModal
            attendanceId={attendance.id}
            organization={organization}
            userData={userData}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddAttendances={handleAddAttendances}
          />
        </div>

        <ClientInfo attendance={attendance} />

        <hr
          className={`${
            theme === "dark" ? "border-gray-600" : "border-gray-300"
          } mb-2`}
        />

        <UnifiedAttendancesList
          attendances={selectedAttendances}
          onRemove={(id) => {
            setSelectedAttendances((prev) => prev.filter((a) => a.id !== id));
            toast.success("Asistencia eliminada exitosamente", {
              duration: 3000,
              style: {
                animation: "fade-out-slow 3s forwards",
                width: "305px",
              },
            });
          }}
          onUpdateAttendance={handleUpdateAttendance}
          availableServices={availableServices}
          onAddService={handleAddServiceToAttendance}
        />

        <div className="mb-6">
          <h5 className="text-lg font-medium mb-4">Servicios:</h5>
          <ServiceList
            services={services}
            onRemove={(id) => {
              setSelectedServices((prev) => prev.filter((s) => s.id !== id));
              toast.success("Servicio eliminado exitosamente", {
                duration: 3000,
                style: {
                  animation: "fade-out-slow 3s forwards",
                  width: "305px",
                },
              });
            }}
          />
        </div>

        <AddServiceSection
          services={filteredServices}
          search={search}
          onSearchChange={setSearch}
          onAddService={handleAddService}
        />

        <TransactionSummary
          discount={discount}
          total={total}
          finalTotal={finalTotal}
          amountPaid={amountPaid}
          paymentType={paymentType}
          onDiscountChange={setDiscount}
          onPaymentTypeChange={setPaymentType}
          date={new Date(attendance.created_at).toLocaleString("es-CL")}
        />

        <TransactionActionButtons
          amountPaid={amountPaid}
          finalTotal={finalTotal}
          servicesCount={services.length}
          unifiedAttendances={selectedAttendances}
          onExecute={handleExecuteTransaction}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default PaymentsContainer;
