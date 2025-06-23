"use client";

import InputField from "@/components/settings/InputField";
import { Branch } from "@/types/branch";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface UserItemProps {
  user: User;
  onChange: (id: number, updated: Partial<User>) => void;
  onToggleActive: (id: number, active: boolean) => void;
  onDelete: (id: number) => void;
  branches: Branch[];
  roles: Role[];
  expanded: boolean;
  setExpanded: (open: boolean) => void;
}

export default function UserItem({
  user,
  branches,
  roles,
  onChange,
  onToggleActive,
  onDelete,
  expanded,
  setExpanded,
}: UserItemProps) {
  return (
    <div className="border border-[--electric-blue] rounded-xl mb-3 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[--cyber-gray] hover:bg-[--menu-hover-bg] transition">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={user.active}
            onChange={(e) => onToggleActive(user.id, e.target.checked)}
          />
          <span className="text-[--electric-blue] font-semibold">
            {user.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(user.id)}
            className="text-red-500 hover:text-red-600 transition"
            title="Eliminar usuario"
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
            value={user.name}
            onChange={(val) => onChange(user.id, { name: String(val) })}
          />
          <InputField
            label="Email"
            value={user.email}
            onChange={(val) => onChange(user.id, { email: String(val) })}
          />

          {user.id < 0 && (
            <InputField
              label="Provisional Password"
              value={user.password}
              type="password"
              onChange={(val) => onChange(user.id, { password: String(val) })}
            />
          )}

          <InputField
            label="Teléfono"
            value={user.phone_number ?? ""}
            onChange={(val) => onChange(user.id, { phone_number: String(val) })}
          />

          {/* Role Select (placeholder) */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Rol</label>
            <select
              value={user.role.id ?? ""}
              onChange={(e) =>
                onChange(user.id, { role: { id: Number(e.target.value) } })
              }
              className="w-full border rounded px-3 py-2 text-sm bg-white text-black"
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Select (placeholder) */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Sucursal</label>
            <select
              value={user.branch_id ?? ""}
              onChange={(e) =>
                onChange(user.id, { branch_id: Number(e.target.value) })
              }
              className="w-full border rounded px-3 py-2 text-sm bg-white text-black"
            >
              <option value="">Selecciona una sucursal</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <ImageUploader
            label="Foto"
            initialUrl={user.photo_url ?? ""}
            onUpload={(url) => onChange(user.id, { photo_url: url })}
          />
        </div>
      )}
    </div>
  );
}
