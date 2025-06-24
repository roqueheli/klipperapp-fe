"use client";

import AttendancesTable from "@/components/management/payments/AttendancesTable";
import ExpensesTable from "@/components/management/payments/ExpensesTable";
import FilterPanel from "@/components/management/payments/FilterPanel";
import { useOrganization } from "@/contexts/OrganizationContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance } from "@/types/attendance";
import { Branch, BranchResponse } from "@/types/branch";
import { User, UserResponse } from "@/types/user";
import { useEffect, useState } from "react";

const PaymentsManagementPage = () => {
  const { data } = useOrganization();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    userEarnings: 0,
    userExpenses: 0,
    amountToPay: 0,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (!data?.id) return;

        const branchesParams = new URLSearchParams({
          organization_id: String(data.id),
        });
        const usersParams = new URLSearchParams({
          organization_id: String(data.id),
        });

        const [branchesRes, usersRes] = await Promise.all([
          httpInternalApi.httpGetPublic(
            "/branches",
            branchesParams
          ) as Promise<BranchResponse>,
          httpInternalApi.httpGetPublic(
            "/users",
            usersParams
          ) as Promise<UserResponse>,
        ]);

        setBranches(branchesRes.branches);
        setUsers(usersRes.users);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [data?.id]);

  const handleSearch = async (filters: any) => {
    try {
      await httpInternalApi.httpPost(
        "/payments/search",
        filters
      );
      setAttendances([]);
      setExpenses([]);
      setTotals({
        userEarnings: 0,
        userExpenses: 0,
        amountToPay: 0,
      });
    } catch (error) {
      console.error("Error fetching payments data:", error);
    }
  };

  const handleReset = () => {
    setAttendances([]);
    setExpenses([]);
    setTotals({
      userEarnings: 0,
      userExpenses: 0,
      amountToPay: 0,
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 mx-auto">
      <h1 className="w-full text-left text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Gestión de pagos
      </h1>
      <FilterPanel
        branches={branches}
        users={users}
        onFilter={handleSearch}
        onReset={handleReset}
      />

      {attendances.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-100 mb-2">
            Turnos Finalizados
          </h3>
          <AttendancesTable attendances={attendances} />
        </div>
      )}

      {expenses.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-100 mb-2">
            Gastos
          </h3>
          <ExpensesTable
            expenses={expenses}
            title="Gastos"
            allowActions={false}
          />
        </div>
      )}

      {(attendances.length > 0 || expenses.length > 0) && (
        <div className="border-t pt-4 flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-100">
          <p>
            <strong>Total Ganancias:</strong> ${" "}
            {totals.userEarnings.toLocaleString("es-CL")}
          </p>
          <p>
            <strong>Total Gastos:</strong> ${" "}
            {totals.userExpenses.toLocaleString("es-CL")}
          </p>
          <p>
            <strong>Total a Pagar:</strong> ${" "}
            {totals.amountToPay.toLocaleString("es-CL")}
          </p>
          <button className="self-end mt-2 px-4 py-2 bg-[--electric-blue] text-white rounded hover:opacity-90">
            Enviar
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagementPage;
