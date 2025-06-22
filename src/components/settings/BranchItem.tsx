"use client";

import InputField from "@/components/settings/InputField";
import { Branch } from "@/types/branch";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface BranchItemProps {
  branch: Branch;
  onChange: (id: number, updated: Partial<Branch>) => void;
  onToggleActive: (id: number, active: boolean) => void;
  onDelete: (id: number) => void;
  totalBranches: number;
  expanded: boolean;
  setExpanded: (open: boolean) => void;
}

export default function BranchItem({
  branch,
  onChange,
  onToggleActive,
  onDelete,
  totalBranches,
  expanded,
  setExpanded,
}: BranchItemProps) {
  return (
    <div className="border border-[--electric-blue] rounded-xl mb-3 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[--cyber-gray] hover:bg-[--menu-hover-bg] transition">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={branch.active ?? false}
            onChange={(e) => onToggleActive(branch.id, e.target.checked)}
          />
          <span className="text-[--electric-blue] font-semibold">
            {branch.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(branch.id)}
            className={`text-red-500 hover:text-red-600 transition ${
              totalBranches <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={totalBranches <= 1}
            title={
              totalBranches <= 1
                ? "No se puede eliminar la única sucursal"
                : "Eliminar sucursal"
            }
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
            value={branch.name}
            onChange={(val) => onChange(branch.id, { name: String(val) })}
          />
          <InputField
            label="Email"
            value={branch.email ?? ""}
            onChange={(val) => onChange(branch.id, { email: String(val) })}
          />
          <InputField
            label="Teléfono"
            value={branch.phone_number ?? ""}
            onChange={(val) =>
              onChange(branch.id, { phone_number: String(val) })
            }
          />
          <InputField
            label="Dirección Línea 1"
            value={branch.address_line1 ?? ""}
            onChange={(val) =>
              onChange(branch.id, { address_line1: String(val) })
            }
          />
          <InputField
            label="Dirección Línea 2"
            value={branch.address_line2 ?? ""}
            onChange={(val) =>
              onChange(branch.id, { address_line2: String(val) })
            }
          />
          <InputField
            label="Ciudad"
            value={branch.city ?? ""}
            onChange={(val) => onChange(branch.id, { city: String(val) })}
          />
          <InputField
            label="Región / Estado"
            value={branch.state ?? ""}
            onChange={(val) => onChange(branch.id, { state: String(val) })}
          />
          <InputField
            label="Código Postal"
            value={branch.zip_code ?? ""}
            onChange={(val) => onChange(branch.id, { zip_code: String(val) })}
          />
          <InputField
            label="País"
            value={branch.country ?? ""}
            onChange={(val) => onChange(branch.id, { country: String(val) })}
          />
          <ImageUploader
            label="Foto Sucursal"
            initialUrl={branch.photo_url ?? ""}
            onUpload={(url) => onChange(branch.id, { photo_url: url })}
          />
        </div>
      )}
    </div>
  );
}
