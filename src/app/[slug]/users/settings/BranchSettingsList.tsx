"use client";

import ConfirmModal from "@/components/modal/ConfirmModal";
import BranchItem from "@/components/settings/BranchItem";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch } from "@/types/branch";
import { useState } from "react";
import toast from "react-hot-toast";

interface BranchesProps {
  initialBranches: Branch[];
  organization_id: number;
}

let tempId = -1;

export default function BranchSettingsList({
  initialBranches,
  organization_id,
}: BranchesProps) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [modifiedBranchIds, setModifiedBranchIds] = useState<Set<number>>(
    new Set()
  );
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [expandedBranchIds, setExpandedBranchIds] = useState<Set<number>>(
    new Set()
  );

  const isBranchValid = (branch: Branch) => {
    return (
      branch.name?.trim() !== "" &&
      branch.email?.trim() !== "" &&
      branch.phone_number?.trim() !== "" &&
      branch.address_line1?.trim() !== "" &&
      branch.city?.trim() !== "" &&
      branch.state?.trim() !== "" &&
      branch.zip_code?.trim() !== "" &&
      branch.country?.trim() !== ""
    );
  };

  const handleUpdate = (id: number, changes: Partial<Branch>) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...changes } : b))
    );
    setModifiedBranchIds((prev) => new Set(prev).add(id));
  };

  const handleToggle = (id: number, active: boolean) => {
    handleUpdate(id, { active });
  };

  const handleDelete = async (id: number) => {
    const payload = {
      id,
    };
    try {
      toast.promise(
        httpInternalApi.httpPostPublic(`/branches/${id}`, "DELETE", payload),
        {
          loading: "Eliminando sucursal...",
          success: "Sucursal eliminada exitosamente.",
          error: "Error al eliminar la atención.",
        }
      );
      setBranches((prev) => prev.filter((b) => b.id !== id));
      setModifiedBranchIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error("Error al eliminar una sucursal:", error);
    }
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
    setExpandedBranchIds((prev) => new Set(prev).add(newBranch.id));
  };

  const handleSubmit = async () => {
    const updatedBranches = branches.filter((b) => modifiedBranchIds.has(b.id));

    const invalidBranches = updatedBranches.filter((b) => !isBranchValid(b));
    if (invalidBranches.length > 0) {
      toast.error("Completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      for (const branch of updatedBranches) {
        const payload = {
          id: branch.id < 0 ? undefined : branch.id,
          organization_id: branch.organization_id,
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

        const promise =
          branch.id < 0
            ? httpInternalApi.httpPostPublic(`/branches`, "POST", payload)
            : httpInternalApi.httpPostPublic(
                `/branches/${branch.id}`,
                "PUT",
                payload
              );
        toast.promise(promise, {
          loading: branch.id < 0 ? "Creando sucursal" : "Actualizando sucursal",
          success:
            branch.id < 0
              ? `Sucursal ${branch.name} creada`
              : `Sucursal ${branch.name} actualizada`,
          error:
            branch.id < 0
              ? `Error al crear sucursal ${branch.name}`
              : `Error al actualizar sucursal ${branch.name}`,
        });
      }

      setModifiedBranchIds(new Set());
    } catch (err) {
      console.error("Error al actualizar sucursales:", err);
    }
  };

  const hasInvalidBranch = Array.from(modifiedBranchIds).some((id) => {
    const branch = branches.find((b) => b.id === id);
    return branch && !isBranchValid(branch);
  });

  const isSaveDisabled = modifiedBranchIds.size === 0 || hasInvalidBranch;

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
          expanded={expandedBranchIds.has(branch.id)}
          setExpanded={(open) =>
            setExpandedBranchIds((prev) => {
              const next = new Set(prev);
              if (open) next.add(branch.id);
              else next.delete(branch.id);
              return next;
            })
          }
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
          disabled={isSaveDisabled}
          className={`py-2 px-4 rounded-xl shadow-lg transition-all font-bold text-white ${
            isSaveDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
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
