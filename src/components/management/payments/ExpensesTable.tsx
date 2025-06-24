"use client";

import { Expenses } from "@/types/expenses";
import { Eye } from "lucide-react";

interface ExpensesTableProps {
  expenses: Expenses[];
  title?: string;
  allowActions?: boolean;
  onView?: (expense: Expenses) => void;
}

const ExpensesTable = ({
  expenses,
  title,
  allowActions = false,
  onView,
}: ExpensesTableProps) => {
  if (expenses.length === 0) {
    return (
      <div className="p-4 text-gray-500 italic border rounded-md">
        No hay gastos registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow rounded-md border mt-6">
      {title && (
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-100 px-4 py-2">
          {title}
        </h3>
      )}
      <table className="min-w-full table-auto border-collapse text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
          <tr>
            <th className="px-4 py-2 text-center">#</th>
            <th className="px-4 py-2 text-center">Fecha</th>
            <th className="px-4 py-2 text-center">Descripción</th>
            <th className="px-4 py-2 text-center">Cantidad</th>
            <th className="px-4 py-2 text-center">Monto</th>
            {allowActions && (
              <th className="px-4 py-2 text-center">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border-t dark:border-gray-700">
              <td className="px-4 py-2 text-center">{e.id}</td>
              <td className="px-4 py-2 text-center">
                {new Date(e.created_at).toLocaleDateString("es-CL")}
              </td>
              <td className="px-4 py-2 text-center">{e.description}</td>
              <td className="px-4 py-2 text-center">{e.quantity}</td>
              <td className="px-4 py-2 text-center">
                $ {Math.trunc(e.amount).toLocaleString("es-CL")}
              </td>
              {allowActions && (
                <td className="px-4 py-2 text-center">
                  {onView && (
                    <button
                      onClick={() => onView(e)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
