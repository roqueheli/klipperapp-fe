"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import UserItem from "@/components/settings/UserItem";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch } from "@/types/branch";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface UserSettingsListProps {
  initialUsers: User[];
  branches: Branch[];
  roles: Role[];
  organization_id: number;
  isAdmin?: boolean;
}

let tempId = -1; // ID temporal para usuarios nuevos

export default function UserSettingsList({
  initialUsers,
  branches,
  roles,
  organization_id,
  isAdmin,
}: UserSettingsListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [modifiedUserIds, setModifiedUserIds] = useState<Set<number>>(
    new Set()
  );
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [expandedUserIds, setExpandedUserIds] = useState<Set<number>>(
    new Set()
  );
  const [showTooltip, setShowTooltip] = useState(false);

  const isUserValid = (user: User) => {
    return (
      user.name.trim() !== "" &&
      user.email.trim() !== "" &&
      user.phone_number?.trim() !== "" &&
      user.role.id !== null &&
      user.branch_id !== null
    );
  };

  const handleUpdate = (id: number, changes: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...changes } : u))
    );
    setModifiedUserIds((prev) => new Set(prev).add(id));
  };

  const handleToggle = (id: number, active: boolean) => {
    handleUpdate(id, { active });
  };

  const handleConfirmDelete = async () => {
    if (confirmingId !== null) {
      const payload = { id: confirmingId };
      try {
        toast.promise(
          httpInternalApi.httpPostPublic(
            `/users/${confirmingId}`,
            "DELETE",
            payload
          ),
          {
            loading: "Eliminando usuario...",
            success: "Usuario eliminado exitosamente.",
            error: "Error al eliminar el usuario.",
          }
        );
        setUsers((prev) => prev.filter((b) => b.id !== confirmingId));
        setModifiedUserIds((prev) => {
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

  const handleAddUser = () => {
    if (branches.length > 1 && branchFilter === "all") {
      setShowTooltip(true);
      return;
    }

    setShowTooltip(false);

    const newUser: User = {
      id: tempId--,
      name: "",
      email: "",
      phone_number: "",
      active: true,
      photo_url: "",
      branch_id: Number(branchFilter) ?? null,
      role: {
        id: roles[0]?.id ?? null,
      },
      organization_id,
    };
    setUsers((prev) => [...prev, newUser]);
    setModifiedUserIds((prev) => new Set(prev).add(newUser.id));
    setExpandedUserIds((prev) => new Set(prev).add(newUser.id));
  };

  const handleSubmit = async () => {
    const updatedUsers = users.filter((u) => modifiedUserIds.has(u.id));

    const invalidUsers = updatedUsers.filter((u) => !isUserValid(u));
    if (invalidUsers.length > 0) {
      toast.error("Completa todos los campos requeridos para cada usuario.");
      return;
    }

    try {
      for (const user of updatedUsers) {
        const payload = {
          user: {
            id: user.id < 0 ? undefined : user.id,
            name: user.name,
            email: user.email,
            active: user.id < 0 ? undefined : user.active,
            password: user.password || undefined,
            role_id: user.role.id,
            branch_id: user.branch_id,
            phone_number: user.phone_number,
            photo_url: user.photo_url,
            organization_id: user.organization_id,
          },
        };

        await toast.promise(
          user.id < 0
            ? httpInternalApi.httpPostPublic(`/users`, "POST", payload)
            : httpInternalApi.httpPostPublic(
                `/users/${user.id}`,
                "PUT",
                payload.user
              ),
          {
            loading:
              user.id < 0 ? "Creando usuario..." : "Actualizando usuario...",
            success:
              user.id < 0
                ? "Usuario creado con éxito"
                : "Usuario actualizado con éxito",
            error:
              user.id < 0
                ? "Error al crear el usuario"
                : "Error al actualizar el usuario",
          }
        );
      }

      setModifiedUserIds(new Set());
    } catch (err) {
      console.error("Error al actualizar usuarios:", err);
    }
  };

  const filteredUsers = useMemo(() => {
    if (branchFilter === "all") return users;
    return users.filter((u) => u.branch_id === Number(branchFilter));
  }, [users, branchFilter]);

  const hasInvalidUser = Array.from(modifiedUserIds).some((id) => {
    const user = users.find((u) => u.id === id);
    return user && !isUserValid(user);
  });

  const hasChanges = modifiedUserIds.size > 0 || hasInvalidUser;

  return (
    <div className="p-4">
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-[--electric-blue]">
          Filtrar por sucursal
        </label>
        <select
          value={branchFilter}
          onChange={(e) => {
            setBranchFilter(e.target.value);
            setShowTooltip(false);
          }}
          className="w-full border rounded px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] dark:bg-[var(--dark-background)] dark:text-[var(--dark-foreground)] dark:border-[var(--dark-border)]"
        >
          {isAdmin && <option value="all">Todas las sucursales</option>}
          {/* Mostrar solo la branch del usuario si no es admin */}
          {(isAdmin
            ? branches
            : branches.filter((b) => b.id === initialUsers[0]?.branch_id)
          ).map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {filteredUsers.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onChange={handleUpdate}
          onToggleActive={handleToggle}
          onDelete={() => setConfirmingId(user.id)}
          branches={branches}
          roles={roles}
          expanded={expandedUserIds.has(user.id)}
          setExpanded={(open) => {
            setExpandedUserIds((prev) => {
              const next = new Set(prev);
              if (open) next.add(user.id);
              else next.delete(user.id);
              return next;
            });
          }}
          isAdmin={isAdmin}
        />
      ))}

      <div className="flex flex-col sm:flex-row items-center justify-end mt-6 gap-3 sm:gap-0">
        <div className="relative">
          {isAdmin && (
            <button
              onClick={handleAddUser}
              onMouseEnter={() => {
                if (branches.length > 1 && branchFilter === "all") {
                  setShowTooltip(true);
                }
              }}
              onMouseLeave={() => setShowTooltip(false)}
              onTouchStart={() => {
                if (branches.length > 1 && branchFilter === "all") {
                  setShowTooltip(true);
                }
              }}
              className={`py-2 px-4 rounded-xl font-semibold shadow transition-all ${
                branches.length > 1 && branchFilter === "all"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
              disabled={branches.length > 1 && branchFilter === "all"}
            >
              + Nuevo Usuario
            </button>
          )}

          {showTooltip && branches.length > 1 && branchFilter === "all" && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max z-10">
              <div className="text-red-300 text-xs px-3 py-1 rounded shadow">
                Selecciona una sucursal antes de agregar un nuevo usuario.
              </div>
              <div className="w-3 h-3 bg-red-500 rotate-45 absolute left-1/2 -translate-x-1/2 top-full"></div>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!hasChanges}
          className={`ml-4 py-2 px-4 rounded-xl shadow-lg transition-all font-bold text-white ${
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
        message="¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer."
        onCancel={() => setConfirmingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
