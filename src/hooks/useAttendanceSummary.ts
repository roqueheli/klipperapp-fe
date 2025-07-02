import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch, BranchResponse } from "@/types/branch";
import { SummaryItem, SummaryResponse } from "@/types/dashboard";
import { useEffect, useState } from "react";

export function useAttendanceSummary(
    startDate: string,
    endDate: string,
    status: string
) {
    const { data: organization } = useOrganization();
    const { userData } = useUser();
    const [summary, setSummary] = useState<SummaryItem[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!organization?.id || !userData?.branch_id) return;

            const params = new URLSearchParams({
                start_day: startDate,
                end_day: endDate,
                status,
            });

            if (organization?.id !== undefined) params.set("organization_id", String(organization.id));
            if (userData?.id !== undefined && userData?.role.name !== "admin") {
                params.set("branch_id", String(userData?.branch_id));
            }
            if (userData?.role.name === "agent") {
                params.set("attended_by", String(userData?.id));
            }

            setIsLoading(true);
            try {
                const [summaryRes, branchesRes] = await Promise.all([
                    httpInternalApi.httpGetPublic(
                        "/attendances/summary",
                        params
                    ) as Promise<SummaryResponse>,
                    httpInternalApi.httpGetPublic(
                        "/branches",
                        params
                    ) as Promise<BranchResponse>,
                ]);

                setSummary(summaryRes.summary);
                setBranches(branchesRes.branches);
            } catch (error) {
                console.error("Error fetching summary:", error);
                setSummary([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [organization?.id, userData?.branch_id, userData?.id, userData?.role.name, startDate, endDate, status]);

    return {
        summary,
        branches,
        isLoading,
    };
}