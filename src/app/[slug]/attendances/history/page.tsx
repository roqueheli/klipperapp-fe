"use client";

import AttendancesTable from "@/components/attendances/history/AttendanceTable";
import FilterPanel from "@/components/attendances/history/FilterPanel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAttendances } from "@/contexts/AttendancesContext";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch, BranchResponse } from "@/types/branch";
import { User, UserResponse } from "@/types/user";
import { translateStatus } from "@/utils/organization.utils";
import { getRoleByName } from "@/utils/roleUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";

const AttendancesHistoryPage = () => {
  const { data } = useOrganization();
  const { userData } = useUser();
  const { attendances, isLoading, hasSearched } = useAttendances();
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  // Cargar datos iniciales (usuarios y sucursales)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const branchesParams = new URLSearchParams();
        const usersParams = new URLSearchParams();

        const agentRole = await getRoleByName("agent");

        if (data?.id) {
          branchesParams.set("organization_id", String(data.id));
          usersParams.set("organization_id", String(data.id));
        }

        if (userData?.role.id === agentRole.id) {
          branchesParams.set("branch_id", String(userData?.branch_id));
          usersParams.set("id", String(userData?.id));
          usersParams.set("branch_id", String(userData?.branch_id));
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
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [data?.id, userData]);

  const handleDownloadPdf = () => {
    if (attendances.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Historial de Atenciones", 14, 20);

    const tableData = attendances.map((att) => [
      att.id,
      att.date ?? "-",
      att.profile?.name ?? "N/A",
      att.services?.map((s) => s.name).join(", ") ?? "-",
      att.status ? translateStatus(att.status) : "-",
      att.total_amount ?? 0,
      att.payment_method ?? "-",
      att.attended_by_user?.name ?? "-",
    ]);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Id",
          "Fecha",
          "Cliente",
          "Servicios",
          "Estado",
          "Monto",
          "Pago",
          "Atendido por",
        ],
      ],
      body: tableData,
      styles: { fontSize: 10 },
    });

    doc.save("historial_atenciones.pdf");
  };

  return (
    <div className="flex items-center flex-col w-full min-h-screen p-6 max-w-7xl mx-auto">
      <h1 className="w-full text-left text-2xl font-bold mb-4">
        🗂️ Historial de Atenciones
      </h1>
      <FilterPanel
        onDownloadPdf={handleDownloadPdf}
        hasResults={
          (attendances !== undefined && attendances.length > 0) || false
        }
        users={users}
        branches={branches}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-4 flex justify-center items-center w-full">
          {!hasSearched ? (
            <p className="text-center text-gray-500 mt-8">
              {`Por favor, selecciona uno o más filtros y presiona "Buscar".`}
            </p>
          ) : attendances !== undefined && attendances.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">
              {"No se encontraron resultados con los filtros aplicados."}
            </p>
          ) : (
            <AttendancesTable attendances={attendances} branches={branches} />
          )}
        </div>
      )}
    </div>
  );
};

export default AttendancesHistoryPage;
