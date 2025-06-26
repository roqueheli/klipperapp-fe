"use client";

import ExpenseModal from "@/components/expenses/ExpensesModal";
import ExpensesTable from "@/components/expenses/ExpensesTable";
import ConfirmModal from "@/components/modal/ConfirmModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Expenses, ExpensesResponse } from "@/types/expenses";
import { User, UserResponse } from "@/types/user";
import { getRoleByName } from "@/utils/roleUtils";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

// Utilidad para comparar si dos fechas son del mismo día
function isSameDay(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

type ExpenseModalMode = "create" | "edit" | "view";

const ExpensesPage = () => {
  const { data } = useOrganization();
  const { userData } = useUser();

  const [users, setUsers] = useState<User[]>([]);
  // const [branches, setBranches] = useState<Branch[]>([]);
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ExpenseModalMode>("create");
  const [selectedExpense, setSelectedExpense] = useState<Expenses | undefined>(
    undefined
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expenses | null>(null);

  const today = useMemo(() => new Date(), []);

  const sortExpensesByDate = useCallback((expensesList: Expenses[]) => {
    return [...expensesList].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      const branchesParams = new URLSearchParams();
      const usersParams = new URLSearchParams();
      const expensesParams = new URLSearchParams();

      const agentRole = await getRoleByName("agent");

      if (data?.id) {
        branchesParams.set("organization_id", String(data.id));
        usersParams.set("organization_id", String(data.id));
        expensesParams.set("organization_id", String(data.id));
      }

      if (userData?.role.id === agentRole.id) {
        branchesParams.set("branch_id", String(userData?.branch_id));
        usersParams.set("id", String(userData?.id));
        usersParams.set("branch_id", String(userData?.branch_id));
      }

      expensesParams.set("type", "user");

      const [usersRes, expensesRes] = await Promise.all([
        // httpInternalApi.httpGetPublic(
        //   "/branches",
        //   branchesParams
        // ) as Promise<BranchResponse>,
        httpInternalApi.httpGetPublic(
          "/users",
          usersParams
        ) as Promise<UserResponse>,
        httpInternalApi.httpGetPublic(
          "/expenses",
          expensesParams
        ) as Promise<ExpensesResponse>,
      ]);

      // setBranches(branchesRes.branches);
      setUsers(usersRes.users);
      setExpenses(sortExpensesByDate(expensesRes.expenses));
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, [data?.id, userData, sortExpensesByDate]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const todayExpenses = useMemo(
    () => expenses.filter((e) => isSameDay(new Date(e.created_at), today)),
    [expenses, today]
  );

  const pastExpenses = useMemo(
    () => expenses.filter((e) => !isSameDay(new Date(e.created_at), today)),
    [expenses, today]
  );

  const handleAddExpense = useCallback(
    (newExpense: Expenses) => {
      setExpenses((prev) => sortExpensesByDate([newExpense, ...prev]));
      setIsModalOpen(false);
    },
    [sortExpensesByDate]
  );

  const handleUpdateExpense = useCallback(
    (updated: Expenses) => {
      setExpenses((prev) =>
        sortExpensesByDate(prev.map((e) => (e.id === updated.id ? updated : e)))
      );
      setIsModalOpen(false);
    },
    [sortExpensesByDate]
  );

  const handleDeleteExpense = useCallback(async () => {
    if (!expenseToDelete) return;

    try {
      await httpInternalApi.httpPostPublic(
        `/expenses/${expenseToDelete.id}`,
        "DELETE",
        expenseToDelete
      );
      setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete.id));
      toast.success("Gasto eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el gasto" + error);
    } finally {
      setExpenseToDelete(null);
      setIsConfirmOpen(false);
    }
  }, [expenseToDelete]);

  const openCreateModal = useCallback(() => {
    setModalMode("create");
    setSelectedExpense(undefined);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((expense: Expenses) => {
    setModalMode("edit");
    setSelectedExpense(expense);
    setIsModalOpen(true);
  }, []);

  const openViewModal = useCallback((expense: Expenses) => {
    setModalMode("view");
    setSelectedExpense(expense);
    setIsModalOpen(true);
  }, []);

  const openDeleteConfirm = useCallback((expense: Expenses) => {
    setExpenseToDelete(expense);
    setIsConfirmOpen(true);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen space-y-10 p-4">
      <h1 className="text-2xl font-bold text-[--electric-blue]">💸 Gastos</h1>

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold text-[--accent-pink]">
            Gastos del día
          </h2>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition"
          >
            + Agregar gasto
          </button>
        </div>
        <ExpensesTable
          expenses={todayExpenses}
          title="Gastos de hoy"
          allowActions
          onEdit={openEditModal}
          onView={openViewModal}
          onDelete={openDeleteConfirm}
        />
      </section>

      <section>
        <ExpensesTable
          expenses={pastExpenses}
          title="Gastos anteriores"
          allowActions={false}
          onView={openViewModal}
        />
      </section>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        mode={modalMode}
        expense={selectedExpense}
        onExpenseAdded={handleAddExpense}
        onExpenseUpdated={handleUpdateExpense}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Eliminar gasto"
        message="¿Estás seguro que deseas eliminar este gasto? Esta acción no se puede deshacer."
        onConfirm={handleDeleteExpense}
        onCancel={() => {
          setExpenseToDelete(null);
          setIsConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default ExpensesPage;
