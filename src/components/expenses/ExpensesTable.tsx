import { useOrganization } from "@/contexts/OrganizationContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Expenses } from "@/types/expenses";
import { User, UserResponse } from "@/types/user";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PaginationControls from "../ui/PaginationControls";

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
  itemsPerPage = 8,
  allowActions = false,
  onEdit,
  onView,
  onDelete,
}: ExpensesTableProps) => {
  const { data } = useOrganization();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const params = new URLSearchParams({
        organization_id: data?.id?.toString() || "",
        role_name: "agent",
      });

      try {
        const { users } = await httpInternalApi.httpGetPublic<UserResponse>(
          "/users",
          params
        );

        setUsers(users);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    fetchUsers();
  }, [data?.id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [expenses, searchTerm]);

  const filteredExpenses = useMemo(() => {
    if (!searchTerm) return expenses;

    return expenses.filter((exp) => {
      const term = searchTerm.toLowerCase();
      return (
        exp.description?.toLowerCase().includes(term) ||
        exp.user_id?.toString().includes(term) ||
        exp.id?.toString().includes(term)
      );
    });
  }, [expenses, searchTerm]);

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [filteredExpenses]);

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
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-[--electric-blue]">{title}</h2>
      </div>

      {currentItems.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          Sin gastos registrados.
        </p>
      ) : (
        <div>
          <div className="w-full flex justify-end p-4 items-center">
            <input
              type="text"
              placeholder="Buscar por descripción, ID o usuario..."
              className="px-3 py-2 w-full md:w-72 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--color-background)] dark:text-[var(--foreground)] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[--electric-blue]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-[var(--color-background)] dark:text-[var(--foreground)]">
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
                    className="border-t border-gray-300 dark:border-gray-700"
                    style={{
                      background:
                        i % 2 === 0
                          ? "var(--table-background)"
                          : "var(--table-bg-2)",
                      color: "var(--foreground)",
                    }}
                  >
                    <td className="px-4 py-3 font-medium">{exp.id}</td>
                    <td className="px-4 py-3">
                      {new Date(exp.created_at).toLocaleString("es-CL", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {users.find((user) => user.id === exp.user_id)?.name ||
                        `${data?.name}`}
                    </td>
                    <td className="px-4 py-3 text-wrap break-words max-w-xs">
                      {exp.description}
                    </td>
                    <td className="px-4 py-3">{exp.quantity}</td>
                    <td className="px-4 py-3 font-semibold text-red-600 dark:text-red-400">
                      $ -{Math.trunc(exp.amount).toLocaleString("es-CL")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
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
        </div>
      )}

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ExpensesTable;
