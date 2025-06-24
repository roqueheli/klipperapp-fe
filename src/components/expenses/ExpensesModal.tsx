"use client";

import httpInternalApi from "@/lib/common/http.internal.service";
import { ExpenseResponse, Expenses } from "@/types/expenses";
import { User } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type ExpenseModalMode = "create" | "edit" | "view";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  mode: ExpenseModalMode;
  expense?: Expenses;
  onExpenseAdded?: (expense: Expenses) => void;
  onExpenseUpdated?: (expense: Expenses) => void;
}

const ExpenseModal = ({
  isOpen,
  onClose,
  users,
  mode,
  expense,
  onExpenseAdded,
  onExpenseUpdated,
}: ExpenseModalProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const resetForm = useCallback(() => {
    setDescription("");
    setAmount(0);
    setQuantity(1);
    setUserId(null);
  }, []);

  // Setea campos cuando cambia el modo o el gasto seleccionado
  useEffect(() => {
    if (expense && (isEditMode || isViewMode)) {
      setDescription(expense.description);
      setAmount(expense.amount);
      setQuantity(expense.quantity);
      setUserId(expense.user_id);
    } else if (isCreateMode) {
      resetForm();
    }
  }, [expense, isEditMode, isViewMode, isCreateMode, resetForm]);

  const handleSubmit = useCallback(async () => {
    if (!description || !amount || !userId) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedUser = users.find((user) => user.id === userId);
      if (!selectedUser) {
        toast.error("Usuario no válido");
        return;
      }

      const payload = {
        id: isEditMode && expense ? expense.id : undefined,
        description,
        amount,
        quantity,
        organization_id: selectedUser.organization_id,
        user_id: userId,
        branch_id: selectedUser.branch_id,
      };

      const action = isEditMode && expense ? "PUT" : "POST";
      const endpoint = `/expenses${
        isEditMode && expense ? `/${expense.id}` : ""
      }`;

      const result = (await httpInternalApi.httpPostPublic(
        endpoint,
        action,
        payload
      )) as ExpenseResponse;

      if (isEditMode) {
        onExpenseUpdated?.(result.expenses);
        toast.success("Gasto actualizado correctamente");
      } else {
        onExpenseAdded?.(result.expenses);
        toast.success("Gasto agregado exitosamente");
      }

      onClose();
    } catch (error) {
      console.error("Error al crear/editar gasto:", error);
      toast.error("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    description,
    amount,
    userId,
    users,
    isEditMode,
    expense,
    quantity,
    onExpenseUpdated,
    onExpenseAdded,
    onClose,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#121212] rounded-xl p-6 w-full max-w-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4 text-[--electric-blue]">
          {isCreateMode
            ? "➕ Nuevo Gasto"
            : isEditMode
            ? "✏️ Editar Gasto"
            : "📄 Detalle del Gasto"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isViewMode}
              className={`w-full rounded-md px-3 py-2 border dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:outline-none ${
                isViewMode && "bg-gray-100 dark:bg-gray-800"
              }`}
              placeholder="Ej: Compra de materiales"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monto</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                disabled={isViewMode}
                className={`w-full rounded-md px-3 py-2 border dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:outline-none ${
                  isViewMode && "bg-gray-100 dark:bg-gray-800"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cantidad</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={isViewMode}
                className={`w-full rounded-md px-3 py-2 border dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:outline-none ${
                  isViewMode && "bg-gray-100 dark:bg-gray-800"
                }`}
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Usuario asignado
            </label>
            <select
              value={userId ?? ""}
              onChange={(e) => setUserId(Number(e.target.value))}
              disabled={isViewMode}
              className={`w-full rounded-md px-3 py-2 border dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:outline-none ${
                isViewMode && "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <option value="">Seleccione un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="mr-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md text-sm text-gray-800 dark:text-gray-200"
            >
              Cerrar
            </button>

            {(isCreateMode || isEditMode) && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md shadow-md disabled:opacity-70"
              >
                {isSubmitting
                  ? "Procesando..."
                  : isEditMode
                  ? "Guardar cambios"
                  : "Agregar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
