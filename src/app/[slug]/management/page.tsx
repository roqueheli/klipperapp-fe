"use client";

import FilterPanel, {
  FilterValues,
} from "@/components/management/payments/FilterPanel";
import PaymentCard from "@/components/management/payments/PaymentCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PaginationControls from "@/components/ui/PaginationControls";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch, BranchResponse } from "@/types/branch";
import { CalculatePaymentResponse } from "@/types/calculate";
import { User, UserResponse } from "@/types/user";
import { getRoleByName } from "@/utils/roleUtils";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const PaymentsManagementPage = () => {
  const { data } = useOrganization();
  const { userData } = useUser();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<CalculatePaymentResponse[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [canView, setCanView] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const init = async () => {
      try {
        if (!data?.id || !userData?.role?.id) return;

        // Obtener rol para verificar si puede ver
        const role = await getRoleByName("admin");
        setCanView(role.id === userData.role.id);

        // Cargar datos iniciales
        const branchesParams = new URLSearchParams({
          organization_id: String(data.id),
        });

        const usersParams = new URLSearchParams({
          organization_id: String(data.id),
        });

        if (role.id !== userData.role.id) {
          branchesParams.set("branch_id", String(userData.branch_id));
          usersParams.set("id", String(userData.id));
        }

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
        console.error("Error inicializando datos:", error);
      }
    };

    init();
  }, [data?.id, userData]);

  const handleSearch = async (filters: FilterValues) => {
    setPayments([]);
    setLoading(true);
    const params = new URLSearchParams();
    params.set("organization_id", String(data?.id));
    params.set("role_name", "agent");

    if (filters.branchId) {
      params.set("branch_id", String(filters.branchId));
    }
    if (filters.userId) {
      params.set("user_id", String(filters.userId));
    }
    if (filters.fromDate) {
      params.set("start_date", filters.fromDate);
    }
    if (filters.toDate) {
      params.set("end_date", filters.toDate);
    }

    console.log("filters", filters, params);

    try {
      const payments: CalculatePaymentResponse[] =
        await httpInternalApi.httpGetPublic("/management", params);
      setPayments(payments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments data:", error);
    }
  };

  const handleSend = (user: User) => {
    toast.success(`Resumen enviado para ${user.name}`);
    // o lógica de email / API POST
  };

  const handleReset = () => {
    setPayments([]);
  };

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return payments.slice(start, start + itemsPerPage);
  }, [payments, currentPage]);

  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Resetear a primera página cuando cambian los resultados
  useEffect(() => {
    setCurrentPage(1);
  }, [payments]);

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

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-[85%]">
          {paginatedPayments.map((p) => (
            <PaymentCard
              key={p.user.id}
              user={p.user}
              finishedAttendances={p.finished_attendances}
              otherAttendances={p.other_attendances}
              expenses={p.expenses ?? []}
              earnings={p.earnings ?? 0}
              expensesTotal={p.total_expenses ?? 0}
              amountToPay={p.amount_to_pay ?? 0}
              onSend={handleSend}
              canView={canView}
              // period={{ from: filters.fromDate, to: filters.toDate }}
            />
          ))}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentsManagementPage;
