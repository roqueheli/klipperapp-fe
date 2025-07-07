"use client";

import AttendanceSummarySection from "@/components/dashboard/AttendanceSummarySection";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { useTheme } from "@/components/ThemeProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useUser } from "@/contexts/UserContext";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const { theme } = useTheme();
  const { userData } = useUser();
  const {
    isLoading,
    revenue,
    organizationRevenue,
    userRevenue,
    totalDiscount,
    totalExtraDiscount,
    totalTips,
    attendances,
    activeAttendances,
    finishedAttendances,
    perService,
    perUser,
    perClient,
    statistics,
  } = useDashboardData();

  if (isLoading) return <LoadingSpinner />;

  const containerClass =
    theme === "dark" ? "text-white bg-gray-900" : "text-black bg-white";

  return (
    <div
      className={`w-full flex flex-col justify-center space-y-6 p-6 mx-auto ${containerClass}`}
    >
      {statistics && userData?.role.name === "admin" && (
        <>
          <h1 className="text-2xl font-bold">🛗 Estadísticas de clientes</h1>
          <StatisticsCards statistics={statistics} />
        </>
      )}

      <h1 className="text-2xl font-bold">📊 Dashboard del día</h1>

      <SummaryCards
        metrics={{
          total: attendances?.length || 0,
          active: activeAttendances?.length || 0,
          finished: finishedAttendances?.length || 0,
          revenue,
          totalDiscount,
          totalExtraDiscount,
          totalTips,
          organizationRevenue,
          userRevenue,
        }}
      />

      <ChartsSection
        perService={perService}
        perUser={perUser}
        perClient={perClient}
        theme={theme}
      />

      <h1 className="text-2xl font-bold mt-4">📉 Estadísticas en el tiempo</h1>
      <AttendanceSummarySection />
    </div>
  );
}
