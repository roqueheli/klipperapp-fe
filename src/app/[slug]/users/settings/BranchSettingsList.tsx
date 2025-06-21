"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import BranchItem from "@/components/settings/BranchItem";
import { Branch } from "@/types/branch";
import { useState } from "react";

interface Props {
  initialBranches: Branch[];
}

export default function BranchSettingsList({ initialBranches }: Props) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const handleUpdate = (id: number, changes: Partial<Branch>) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...changes } : b))
    );
  };

  const handleToggle = (id: number, active: boolean) => {
    handleUpdate(id, { active });
  };

  const handleDelete = (id: number) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const handleConfirmDelete = () => {
    if (confirmingId !== null) {
      setBranches((prev) => prev.filter((b) => b.id !== confirmingId));
      setConfirmingId(null);
    }
  };

  const handleSubmit = () => {
    console.log("Branches actualizadas:", branches);
    // Aquí podrías hacer PUT o POST al backend por cada branch
  };

  return (
    <div className="p-4">
      {branches.map((branch) => (
        <BranchItem
          key={branch.id}
          branch={branch}
          onChange={handleUpdate}
          onToggleActive={handleToggle}
          onDelete={() => setConfirmingId(branch.id)}
          totalBranches={branches.length}
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
        message="¿Estás seguro que deseas eliminar esta sucursal? Esta acción no se puede deshacer."
        onCancel={() => setConfirmingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
