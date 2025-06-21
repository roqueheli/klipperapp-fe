"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import BranchItem from "@/components/settings/BranchItem";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch } from "@/types/branch";
import { useState } from "react";

interface BranchesProps {
  initialBranches: Branch[];
  organization_id: number;
}

let tempId = -1;

export default function BranchSettingsList({ initialBranches, organization_id }: BranchesProps) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [modifiedBranchIds, setModifiedBranchIds] = useState<Set<number>>(
    new Set()
  );
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const handleUpdate = (id: number, changes: Partial<Branch>) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...changes } : b))
    );
    setModifiedBranchIds((prev) => new Set(prev).add(id));
  };

  const handleToggle = (id: number, active: boolean) => {
    handleUpdate(id, { active });
  };

  const handleDelete = (id: number) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
    setModifiedBranchIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleConfirmDelete = () => {
    if (confirmingId !== null) {
      handleDelete(confirmingId);
      setConfirmingId(null);
    }
  };

  const handleAddBranch = () => {
    const newBranch: Branch = {
      id: tempId--,
      organization_id: organization_id,
      name: "",
      email: "",
      phone_number: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      active: true,
      photo_url: "",
    };
    setBranches((prev) => [...prev, newBranch]);
    setModifiedBranchIds((prev) => new Set(prev).add(newBranch.id));
  };

  const handleSubmit = async () => {
    const updatedBranches = branches.filter((b) => modifiedBranchIds.has(b.id));

    try {
      for (const branch of updatedBranches) {
        const payload = {
          name: branch.name,
          email: branch.email,
          phone_number: branch.phone_number,
          address_line1: branch.address_line1,
          address_line2: branch.address_line2,
          city: branch.city,
          state: branch.state,
          zip_code: branch.zip_code,
          country: branch.country,
          active: branch.active,
          photo_url: branch.photo_url,
        };

        if (branch.id < 0) {
          await httpInternalApi.httpPost(`/branches`, "POST", payload);
        } else {
          await httpInternalApi.httpPost(`/branches/${branch.id}`, "PUT", payload);
        }
      }

      console.log("Sucursales actualizadas:", updatedBranches);
      setModifiedBranchIds(new Set());
    } catch (err) {
      console.error("Error al actualizar sucursales:", err);
    }
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

      <div className="flex items-center justify-end mt-6">
        <button
          onClick={handleAddBranch}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl shadow transition-all mr-2"
        >
          + Nueva Sucursal
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
        message="¿Estás seguro que deseas eliminar esta sucursal? Esta acción no se puede deshacer."
        onCancel={() => setConfirmingId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
