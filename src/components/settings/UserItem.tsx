"use client";

import InputField from "@/components/settings/InputField";
import { Branch } from "@/types/branch";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  user: User;
  branches: Branch[];
  roles: Role[];
  onChange: (id: number, updated: Partial<User>) => void;
  onToggleActive: (id: number, active: boolean) => void;
  onDelete: (id: number) => void;
}

export default function UserItem({
  user,
  branches,
  roles,
  onChange,
  onToggleActive,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);

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
            onClick={() => setOpen((prev) => !prev)}
            className="text-[--electric-blue]"
            title="Editar"
          >
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {open && (
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
          <InputField
            label="Teléfono"
            value={user.phone_number ?? ""}
            onChange={(val) => onChange(user.id, { phone_number: String(val) })}
          />
          <InputField
            label="Dirección"
            value={user.address_line1 ?? ""}
            onChange={(val) =>
              onChange(user.id, { address_line1: String(val) })
            }
          />

          {/* Role Select (placeholder) */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Rol</label>
            <select
              value={user.role_id ?? ""}
              onChange={(e) =>
                onChange(user.id, { role_id: Number(e.target.value) })
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
        </div>
      )}
    </div>
  );
}
