"use client";

import InputField from "@/components/settings/InputField";
import { Service } from "@/types/service";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface Props {
  service: Service;
  onChange: (id: number, updated: Partial<Service>) => void;
  onToggleActive: (id: number, active: boolean) => void;
  onDelete: (id: number) => void;
  expanded: boolean;
  setExpanded: (open: boolean) => void;
}

export default function ServiceItem({
  service,
  onChange,
  onToggleActive,
  onDelete,
  expanded,
  setExpanded,
}: Props) {

  return (
    <div className="border border-[--electric-blue] rounded-xl mb-3 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[--cyber-gray] hover:bg-[--menu-hover-bg] transition">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={!!service.active} // esto fuerza un booleano
            onChange={(e) => onToggleActive(service.id, e.target.checked)}
          />
          <span className="text-[--electric-blue] font-semibold">
            {service.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(service.id)}
            className="text-red-500 hover:text-red-600 transition"
            title="Eliminar servicio"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[--electric-blue]"
            title="Editar"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="bg-[--background] px-4 py-4 space-y-4">
          <InputField
            label="Nombre"
            value={service.name}
            onChange={(val) => onChange(service.id, { name: String(val) })}
          />
          <InputField
            label="Descripción"
            value={service.description ?? ""}
            onChange={(val) =>
              onChange(service.id, { description: String(val) })
            }
            textarea
          />
          <InputField
            label="Precio"
            type="number"
            value={Number(service.price)}
            onChange={(val) => onChange(service.id, { price: Number(val) })}
          />
          <InputField
            label="Duración (min)"
            type="number"
            value={service.duration ?? 0}
            onChange={(val) => onChange(service.id, { duration: Number(val) })}
          />
          <ImageUploader
            label="Foto Servicio"
            initialUrl={service.photo_url ?? ""}
            onUpload={(url) => onChange(service.id, { photo_url: url })}
          />
        </div>
      )}
    </div>
  );
}
