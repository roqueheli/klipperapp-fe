"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import ServiceItem from "@/components/settings/ServiceItem";
import { Service } from "@/types/service";
import { useState } from "react";

interface Props {
  initialServices: Service[];
}

export default function ServiceSettingsList({ initialServices }: Props) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const handleUpdate = (id: number, changes: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...changes } : s))
    );
  };

  const handleToggle = (id: number, active: boolean) => {
    handleUpdate(id, { active });
  };

  const handleConfirmDelete = () => {
    if (confirmingId !== null) {
      setServices((prev) => prev.filter((b) => b.id !== confirmingId));
      setConfirmingId(null);
    }
  };

  const handleSubmit = () => {
    console.log("Servicios actualizados:", services);
    // Aquí podrías hacer un PUT al backend por cada servicio
  };

  return (
    <div className="p-4">
      {services.map((service) => (
        <ServiceItem
          key={service.id}
          service={service}
          onChange={handleUpdate}
          onToggleActive={handleToggle}
          onDelete={() => setConfirmingId(service.id)}
        />
      ))}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
        >
          Guardar cambios
        </button>
      </div>
      <ConfirmModal
        isOpen={confirmingId !== null}
        message="¿Estás seguro que deseas eliminar este servicio? Esta acción no se puede deshacer."
        onCancel={() => setConfirmingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
