"use client";

import { Expenses } from "@/types/expenses";
import clsx from "clsx";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ExpensesTableProps {
  expenses: Expenses[];
  title: string;
  itemsPerPage?: number;
  allowActions?: boolean;
  onEdit?: (expense: Expenses) => void;
  onView?: (expense: Expenses) => void;
  onDelete?: (expense: Expenses) => void;
}

const ExpensesTable = ({
  expenses,
  title,
  itemsPerPage = 10,
  allowActions = false,
  onEdit,
  onView,
  onDelete,
}: ExpensesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [expenses]);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [expenses]);

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedExpenses.slice(start, start + itemsPerPage);
  }, [sortedExpenses, currentPage, itemsPerPage]);

  const handleEdit = useCallback(
    (expense: Expenses) => {
      onEdit?.(expense);
    },
    [onEdit]
  );

  const handleView = useCallback(
    (expense: Expenses) => {
      onView?.(expense);
    },
    [onView]
  );

  const handleDelete = useCallback(
    (expense: Expenses) => {
      onDelete?.(expense);
    },
    [onDelete]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[--electric-blue]">{title}</h2>

      {currentItems.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          Sin gastos registrados.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="w-15 px-4 py-3 text-left">Cód</th>
                <th className="w-50 px-4 py-3 text-left">Fecha</th>
                <th className="w-50 px-4 py-3 text-left">Usuario</th>
                <th className="w-50 px-4 py-3 text-left">Descripción</th>
                <th className="w-30 px-4 py-3 text-left">Cantidad</th>
                <th className="w-40 px-4 py-3 text-left">Monto</th>
                <th className="w-40 px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((exp, i) => (
                <tr
                  key={exp.id}
                  className={clsx(
                    "border-t dark:border-gray-700",
                    i % 2 === 0
                      ? "bg-white dark:bg-[#1a1a1a]"
                      : "bg-gray-50 dark:bg-[#222]"
                  )}
                >
                  <td className="text-left px-4 py-3 font-medium">
                    {exp.id}
                  </td>
                  <td className="text-left px-4 py-3">
                    {new Date(exp.created_at).toLocaleString("es-CL", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="text-left px-4 py-3">{exp.user_id}</td>
                  <td className="text-left px-4 py-3 text-wrap break-words max-w-xs">
                    {exp.description}
                  </td>
                  <td className="text-left px-4 py-3">{exp.quantity}</td>
                  <td className="text-left px-4 py-3 font-semibold text-red-600 dark:text-red-400">
                    $ -{Math.trunc(exp.amount).toLocaleString("es-CL")}
                  </td>
                  <td className="text-left px-4 py-3">
                    <div className="flex justify-start items-center gap-2">
                      <button
                        onClick={() => handleView(exp)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        title="Ver"
                      >
                        <Eye size={18} />
                      </button>
                      {allowActions && (
                        <>
                          <button
                            onClick={() => handleEdit(exp)}
                            className="p-1 text-yellow-500 hover:text-yellow-600"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(exp)}
                            className="p-1 text-red-500 hover:text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 text-sm mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpensesTable;
