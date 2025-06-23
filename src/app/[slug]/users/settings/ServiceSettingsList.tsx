"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import ServiceItem from "@/components/settings/ServiceItem";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Service } from "@/types/service";
import { useState } from "react";
import toast from "react-hot-toast";

interface ServicesProps {
  initialServices: Service[];
  organization_id: number;
}

let tempId = -1; // ID temporal para servicios nuevos

export default function ServiceSettingsList({
  initialServices,
  organization_id,
}: ServicesProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [modifiedServiceIds, setModifiedServiceIds] = useState<Set<number>>(
    new Set()
  );
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [expandedServiceIds, setExpandedServiceIds] = useState<Set<number>>(
    new Set()
  );

  const isServiceValid = (service: Service) => {
    return (
      service.name.trim() !== "" && service.price > 0 && service.duration > 0
    );
  };

  const handleUpdate = (id: number, changes: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...changes } : s))
    );
    setModifiedServiceIds((prev) => new Set(prev).add(id));
  };

  const handleToggle = (id: number, active: boolean) => {
    handleUpdate(id, { active });
  };

  const handleConfirmDelete = async () => {
    if (confirmingId !== null) {
      const payload = {
        id: confirmingId,
      };
      try {
        toast.promise(
          httpInternalApi.httpPostPublic(
            `/services/${confirmingId}`,
            "DELETE",
            payload
          ),
          {
            loading: "Eliminando servicio...",
            success: "Servicio eliminado exitosamente.",
            error: "Error al eliminar el servicio.",
          }
        );
        setServices((prev) => prev.filter((s) => s.id !== confirmingId));
        setModifiedServiceIds((prev) => {
          const next = new Set(prev);
          next.delete(confirmingId);
          return next;
        });
        setConfirmingId(null);
      } catch (error) {
        console.error("Error al eliminar una sucursal:", error);
      }
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
    setExpandedServiceIds((prev) => new Set(prev).add(newService.id));
  };

  const handleSubmit = async () => {
    const updatedServices = services.filter((s) =>
      modifiedServiceIds.has(s.id)
    );

    const invalidServices = updatedServices.filter((s) => !isServiceValid(s));
    if (invalidServices.length > 0) {
      toast.error("Completa todos los campos requeridos para cada servicio.");
      return;
    }

    try {
      for (const service of updatedServices) {
        const payload = {
          organization_id: service.organization_id,
          id: service.id < 0 ? undefined : service.id,
          name: service.name,
          branch_id: 1,
          description: service.description,
          price: service.price,
          duration: service.duration,
          active: service.active,
          photo_url: service.photo_url,
        };

        await toast.promise(
          service.id < 0
            ? httpInternalApi.httpPostPublic(`/services`, "POST", payload)
            : httpInternalApi.httpPostPublic(
                `/services/${service.id}`,
                "PUT",
                payload
              ),
          {
            loading:
              service.id < 0
                ? "Creando servicio..."
                : "Actualizando servicio...",
            success:
              service.id < 0
                ? "Servicio creado con éxito"
                : "Servicio actualizado con éxito",
            error:
              service.id < 0
                ? "Error al crear el servicio"
                : "Error al actualizar el servicio",
          }
        );
      }

      setModifiedServiceIds(new Set());
    } catch (err) {
      console.error("Error al actualizar servicios:", err);
    }
  };

  const hasInvalidService = Array.from(modifiedServiceIds).some((id) => {
    const service = services.find((s) => s.id === id);
    return service && !isServiceValid(service);
  });

  const hasChanges = modifiedServiceIds.size > 0 || hasInvalidService;

  return (
    <div className="p-4">
      {services.map((service) => (
        <ServiceItem
          key={service.id}
          service={service}
          onChange={handleUpdate}
          onToggleActive={handleToggle}
          onDelete={() => setConfirmingId(service.id)}
          expanded={expandedServiceIds.has(service.id)}
          setExpanded={(open) =>
            setExpandedServiceIds((prev) => {
              const next = new Set(prev);
              if (open) next.add(service.id);
              else next.delete(service.id);
              return next;
            })
          }
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
          disabled={!hasChanges}
          className={`py-2 px-4 rounded-xl shadow-lg transition-all font-bold text-white ${
            hasChanges
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
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
