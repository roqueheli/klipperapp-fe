"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import UserItem from "@/components/settings/UserItem";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch } from "@/types/branch";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { useMemo, useState } from "react";

interface UserSettingsListProps {
  initialUsers: User[];
  branches: Branch[];
  roles: Role[];
  organization_id: number;
}

let tempId = -1; // ID temporal para usuarios nuevos

export default function UserSettingsList({
  initialUsers,
  branches,
  roles,
  organization_id,
}: UserSettingsListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [modifiedUserIds, setModifiedUserIds] = useState<Set<number>>(
    new Set()
  );
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const handleUpdate = (id: number, changes: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...changes } : u))
    );
    setModifiedUserIds((prev) => new Set(prev).add(id));
  };

  const handleToggle = (id: number, active: boolean) => {
    handleUpdate(id, { active });
  };

  const handleConfirmDelete = () => {
    if (confirmingId !== null) {
      setUsers((prev) => prev.filter((b) => b.id !== confirmingId));
      setModifiedUserIds((prev) => {
        const next = new Set(prev);
        next.delete(confirmingId);
        return next;
      });
      setConfirmingId(null);
    }
  };

  const handleAddUser = () => {
    const newUser: User = {
      id: tempId--,
      name: "",
      email: "",
      phone_number: "",
      active: true,
      photo_url: "",
      branch_id: branches[0]?.id ?? null,
      role_id: roles[0]?.id ?? null,
      organization_id,
    };
    setUsers((prev) => [...prev, newUser]);
    setModifiedUserIds((prev) => new Set(prev).add(newUser.id));
  };

  const handleSubmit = async () => {
    const updatedUsers = users.filter((u) => modifiedUserIds.has(u.id));

    try {
      for (const user of updatedUsers) {
        const payload = {
          name: user.name,
          email: user.email,
          active: user.active,
          role_id: user.role_id,
          branch_id: user.branch_id,
          phone_number: user.phone_number,
          photo_url: user.photo_url,
          organization_id: user.organization_id,
        };

        if (user.id < 0) {
          await httpInternalApi.httpPost(`/users`, "POST", payload);
        } else {
          await httpInternalApi.httpPost(`/users/${user.id}`, "PUT", payload);
        }
      }

      console.log("Usuarios actualizados:", updatedUsers);
      setModifiedUserIds(new Set());
    } catch (err) {
      console.error("Error al actualizar usuarios:", err);
    }
  };

  const filteredUsers = useMemo(() => {
    if (branchFilter === "all") return users;
    return users.filter((u) => u.branch_id === Number(branchFilter));
  }, [users, branchFilter]);

  return (
    <div className="p-4">
      {/* Filtro de sucursales */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-[--electric-blue]">
          Filtrar por sucursal
        </label>
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm
             bg-[var(--background)] text-[var(--foreground)]
             dark:bg-[var(--dark-background)] dark:text-[var(--dark-foreground)] dark:border-[var(--dark-border)]"
        >
          <option value="all">Todas las sucursales</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de usuarios */}
      {filteredUsers.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onChange={handleUpdate}
          onToggleActive={handleToggle}
          onDelete={() => setConfirmingId(user.id)}
          branches={branches}
          roles={roles}
        />
      ))}

      <div className="flex items-center justify-end mt-6">
        <button
          onClick={handleAddUser}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl shadow transition-all mr-2"
        >
          + Nuevo Usuario
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
        message="¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer."
        onCancel={() => setConfirmingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
