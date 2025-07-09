import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Attendance, Attendances } from "@/types/attendance";
import { Statistics, StatisticsResponse } from "@/types/dashboard";
import { useEffect, useMemo, useState } from "react";

export function useDashboardData() {
    const { data } = useOrganization();
    const { userData } = useUser();
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const params = new URLSearchParams();
            if (data?.id !== undefined) params.set("organization_id", String(data.id));
            if (userData?.id !== undefined && userData?.role.name !== "admin") {
                params.set("branch_id", String(userData?.branch_id));
            }
            if (userData?.role.name === "agent") {
                params.set("attended_by", String(userData?.id));
            }
            const [attendancesRes, statisticsRes] = await Promise.all([
                httpInternalApi.httpGetPublic("/attendances/today", params) as Promise<Attendances>,
                httpInternalApi.httpGetPublic("/attendances/statistics", params) as Promise<StatisticsResponse>,
            ]);
            setAttendances(attendancesRes.attendances);
            setStatistics(statisticsRes.statistics);
            setLoading(false);
        };
        fetchData();
    }, [data?.id, userData]);

    const finishedAttendances = useMemo(() => attendances?.filter(a => a.status === "finished"), [attendances]);
    const activeAttendances = useMemo(() => attendances?.filter(a => ["pending", "processing", "completed"].includes(a.status)), [attendances]);

    const revenue = useMemo(() => finishedAttendances?.reduce((sum, a) => sum + (a.total_amount ?? 0), 0), [finishedAttendances]);
    const organizationRevenue = useMemo(() => finishedAttendances?.reduce((sum, a) => sum + (a.organization_amount ?? 0), 0), [finishedAttendances]);
    const userRevenue = useMemo(() => finishedAttendances?.reduce((sum, a) => sum + (a.user_amount ?? 0), 0), [finishedAttendances]);
    const totalDiscount = useMemo(() => finishedAttendances?.reduce((sum, a) => sum + (a.discount ?? 0), 0), [finishedAttendances]);
    const totalExtraDiscount = useMemo(() => finishedAttendances?.reduce((sum, a) => sum + (a.extra_discount ?? 0), 0), [finishedAttendances]);
    const totalTips = useMemo(() => finishedAttendances?.reduce((sum, a) => sum + (a.tip_amount ?? 0), 0), [finishedAttendances]);

    const perService = useMemo(() => {
        const map: Record<string, number> = {};
        attendances?.forEach((a) => {
            const services = a.services ?? [];
            if (services.length === 0) {
                map["Sin servicio"] = (map["Sin servicio"] || 0) + 1;
            } else {
                services.forEach((s) => {
                    map[s.name] = (map[s.name] || 0) + 1;
                });
            }
        });
        return Object.entries(map).map(([name, count]) => ({ name, count }));
    }, [attendances]);

    const perUser = useMemo(() => {
        const map: Record<string, number> = {};
        attendances?.forEach((a) => {
            const name = a.attended_by_user?.name || "Sin asignar";
            map[name] = (map[name] || 0) + 1;
        });
        return Object.entries(map).map(([name, count]) => ({ name, count }));
    }, [attendances]);

    const perClient = useMemo(() => {
        const map: Record<string, number> = {};
        attendances?.forEach((a) => {
            const name = a.profile?.name || "Desconocido";
            map[name] = (map[name] || 0) + 1;
        });
        return Object.entries(map).map(([name, count]) => ({ name, count }));
    }, [attendances]);

    return {
        isLoading,
        attendances,
        finishedAttendances,
        activeAttendances,
        revenue,
        organizationRevenue,
        userRevenue,
        totalDiscount,
        totalExtraDiscount,
        totalTips,
        perService,
        perUser,
        perClient,
        statistics,
    };
}