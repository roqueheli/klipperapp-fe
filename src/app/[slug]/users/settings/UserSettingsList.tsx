"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import UserItem from "@/components/settings/UserItem";
import { User } from "@/types/user";
import { useState } from "react";

interface Props {
  initialUsers: User[];
}

export default function UserSettingsList({ initialUsers }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const handleUpdate = (id: number, changes: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...changes } : u))
    );
  };

  const handleToggle = (id: number, active: boolean) => {
    handleUpdate(id, { active });
  };

  const handleConfirmDelete = () => {
    if (confirmingId !== null) {
      setUsers((prev) => prev.filter((b) => b.id !== confirmingId));
      setConfirmingId(null);
    }
  };

  const handleSubmit = () => {
    console.log("Usuarios actualizados:", users);
    // Aquí podrías hacer PUT o POST a backend por cada usuario
  };

  return (
    <div className="p-4">
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onChange={handleUpdate}
          onToggleActive={handleToggle}
          onDelete={() => setConfirmingId(user.id)}
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
        message="¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer."
        onCancel={() => setConfirmingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
