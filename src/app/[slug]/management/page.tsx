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
import { Payment } from "@/types/payments";
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
  const [searchFilters, setSearchFilters] = useState<FilterValues>();
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
    setSearchFilters(filters);
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

    try {
      const payments: CalculatePaymentResponse[] =
        await httpInternalApi.httpGetPublic("/management", params);
      setPayments(payments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments data:", error);
    }
  };

  const handleSend = async (data: {
    payment_id?: number;
    organization_id: number;
    branch_id: number;
    user_id: number;
    from?: string;
    to?: string;
    amount: number;
  }) => {
    const method = data.payment_id !== undefined ? "PATCH" : "POST";
    const requestBody = {
      id: data.payment_id ?? undefined,
      amount: data.amount > 0 ? data.amount : 0,
      organization_id: data.organization_id ?? 0,
      branch_id: data.branch_id ?? 0,
      user_id: data.user_id ?? 0,
      starts_at: data.from ?? "",
      ends_at: data.to ?? "",
    } as Payment;

    try {
      await toast.promise(
        httpInternalApi.httpPostPublic(
          `/management/payments${method === "POST" ? "" : `/resend`}`,
          method,
          requestBody
        ),
        {
          loading: `Sending payment ${method === "POST" ? "request" : "update"}`,
          success: `Payment successfully ${method === "POST" ? "created" : "updated"}.`,
          error: `Error ${method === "POST" ? "creating" : "updating"} payment.`,
        }
      );

      if (searchFilters) {
        await handleSearch(searchFilters);
      }
    } catch (error) {
      console.error("Error in start process:", error);
    }
  };

  const handleApprove = async (data: { id: number }) => {
    try {
      await toast.promise(
        httpInternalApi.httpPostPublic("/management/payments/approve", "PATCH", {
          id: data.id,
        }),
        {
          loading: "Approving payment...",
          success: "Payment successfully approved.",
          error: "Error approving payment.",
        }
      );

      if (searchFilters) {
        await handleSearch(searchFilters);
      }
    } catch (error) {
      console.error("Error in approve process:", error);
    }
  };

  const handleReject = async (data: { id: number }) => {
    try {
      await toast.promise(
        httpInternalApi.httpPostPublic("/management/payments/reject", "PATCH", {
          id: data.id,
        }),
        {
          loading: "Rejecting payment...",
          success: "Payment successfully rejected.",
          error: "Error rejecting payment.",
        }
      );

      if (searchFilters) {
        await handleSearch(searchFilters);
      }
    } catch (error) {
      console.error("Error in reject process:", error);
    }
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
        <div className="w-full">
          {paginatedPayments.map((p) => (
            <PaymentCard
              key={p.user.id}
              user={p.user}
              finishedAttendances={p.finished_attendances}
              otherAttendances={p.other_attendances}
              expenses={p.expenses ?? []}
              payments={p.payments ?? []}
              earnings={p.earnings ?? 0}
              expensesTotal={p.total_expenses ?? 0}
              amountToPay={p.amount_to_pay ?? 0}
              onSend={handleSend}
              onApprove={handleApprove}
              onReject={handleReject}
              canView={canView}
              period={{
                from: searchFilters?.fromDate,
                to: searchFilters?.toDate,
              }}
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
