"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import ServiceItem from "@/components/settings/ServiceItem";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Service } from "@/types/service";
import { useState } from "react";

interface ServicesProps {
  initialServices: Service[];
  organization_id: number
}

let tempId = -1; // ID temporal para servicios nuevos

export default function ServiceSettingsList({ initialServices, organization_id }: ServicesProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [modifiedServiceIds, setModifiedServiceIds] = useState<Set<number>>(
    new Set()
  );
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const handleUpdate = (id: number, changes: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...changes } : s))
    );
    setModifiedServiceIds((prev) => new Set(prev).add(id));
  };

  const handleToggle = (id: number, active: boolean) => {
    handleUpdate(id, { active });
  };

  const handleConfirmDelete = () => {
    if (confirmingId !== null) {
      setServices((prev) => prev.filter((s) => s.id !== confirmingId));
      setModifiedServiceIds((prev) => {
        const next = new Set(prev);
        next.delete(confirmingId);
        return next;
      });
      setConfirmingId(null);
    }
  };

  const handleAddService = () => {
    const newService: Service = {
      id: tempId--,
      organization_id: organization_id,
      name: "",
      description: "",
      price: 0,
      duration: 0,
      active: true,
      photo_url: "",
    };
    setServices((prev) => [...prev, newService]);
    setModifiedServiceIds((prev) => new Set(prev).add(newService.id));
  };

  const handleSubmit = async () => {
    const updatedServices = services.filter((s) =>
      modifiedServiceIds.has(s.id)
    );

    try {
      for (const service of updatedServices) {
        const payload = {
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          active: service.active,
          photo_url: service.photo_url,
        };

        if (service.id < 0) {
          await httpInternalApi.httpPost(`/services`, "POST", payload);
        } else {
          await httpInternalApi.httpPost(`/services/${service.id}`, "PUT", payload);
        }
      }

      console.log("Servicios actualizados:", updatedServices);
      setModifiedServiceIds(new Set());
    } catch (err) {
      console.error("Error al actualizar servicios:", err);
    }
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

      <div className="flex items-center justify-end mt-6">
        <button
          onClick={handleAddService}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl shadow transition-all mr-2"
        >
          + Nuevo Servicio
        </button>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all"
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
