"use client";

import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { ExpenseResponse, Expenses } from "@/types/expenses";
import { User } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTheme } from "../ThemeProvider";

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
  const { theme } = useTheme();
  const { data } = useOrganization();
  const { userData } = useUser();
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
    if (!description || !amount || !quantity) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedUser = users.find((user) => user.id === userId);

      const payload = {
        id: isEditMode && expense ? expense.id : undefined,
        type: !isEditMode ? "user" : undefined,
        description,
        amount,
        quantity,
        organization_id: selectedUser?.organization_id || data?.id,
        user_id: userId || null,
        branch_id: selectedUser?.branch_id || userData?.branch_id,
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
    data,
    userData,
    onExpenseUpdated,
    onExpenseAdded,
    onClose,
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div
        className={`${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        } rounded-xl p-6 w-full max-w-2xl shadow-lg relative`}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        {/* Título */}
        <h2 className="text-xl font-bold mb-4 text-blue-500">
          {isCreateMode
            ? "➕ Nuevo Gasto"
            : isEditMode
            ? "✏️ Editar Gasto"
            : "📄 Detalle del Gasto"}
        </h2>

        {/* Formulario */}
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
              className={`w-full rounded-md px-3 py-2 border ${
                isViewMode
                  ? `${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`
                  : `${theme === "dark" ? "bg-gray-900" : "bg-white"}`
              } ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } focus:outline-none`}
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
                className={`w-full rounded-md px-3 py-2 border ${
                  isViewMode
                    ? `${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`
                    : `${theme === "dark" ? "bg-gray-900" : "bg-white"}`
                } ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                } focus:outline-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cantidad</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={isViewMode}
                min={1}
                className={`w-full rounded-md px-3 py-2 border ${
                  isViewMode
                    ? `${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`
                    : `${theme === "dark" ? "bg-gray-900" : "bg-white"}`
                } ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                } focus:outline-none`}
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
              className={`w-full rounded-md px-3 py-2 border ${
                isViewMode
                  ? `${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`
                  : `${theme === "dark" ? "bg-gray-900" : "bg-white"}`
              } ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              } ocus:outline-none`}
            >
              <option value="">Seleccione un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className={`mr-2 ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              } px-4 py-2 rounded-md text-sm`}
            >
              Cerrar
            </button>

            {(isCreateMode || isEditMode) && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md shadow-md disabled:opacity-70`}
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
