import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { Branch, BranchResponse } from "@/types/branch";
import { SummaryItem, SummaryResponse } from "@/types/dashboard";
import { User, UserResponse } from "@/types/user";
import { useEffect, useState } from "react";

export function useAttendanceSummary(
    startDate: string,
    endDate: string,
    status: string,
    branchId: string,
    userId: string
) {
    const { data: organization } = useOrganization();
    const { userData } = useUser();
    const [summary, setSummary] = useState<SummaryItem[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!organization?.id || !userData?.branch_id) return;

            const params = new URLSearchParams({
                start_day: startDate,
                end_day: endDate,
            });

            const branchParams = new URLSearchParams();
            const userParams = new URLSearchParams();

            if (status !== "all") {
                params.set("status", status);
            }

            if (organization?.id !== undefined) {
                params.set("organization_id", String(organization.id));
                branchParams.set("organization_id", String(organization.id));
                userParams.set("organization_id", String(organization.id));
            }

            if (userData?.role.name === "admin") {
                if (branchId && branchId !== "all") {
                    params.set("branch_id", branchId);
                }
                if (userId && userId !== "all") {
                    params.set("user_id", userId);
                }
            }

            if (userData?.role.name !== "admin") {
                params.set("branch_id", String(userData.branch_id));
                branchParams.set("id", String(userData.branch_id));
                userParams.set("branch_id", String(userData.branch_id));
            }

            if (userData?.role.name === "agent") {
                params.set("user_id", String(userData.id));
                userParams.set("id", String(userData.id));
            }

            setIsLoading(true);
            try {
                const [summaryRes, branchesRes, usersRes] = await Promise.all([
                    httpInternalApi.httpGetPublic("/attendances/summary", params) as Promise<SummaryResponse>,
                    httpInternalApi.httpGetPublic("/branches", branchParams) as Promise<BranchResponse>,
                    httpInternalApi.httpGetPublic("/users", userParams) as Promise<UserResponse>,
                ]);

                setSummary(summaryRes.summary);
                setBranches(branchesRes.branches);
                setUsers(usersRes.users);
            } catch (error) {
                console.error("Error fetching summary:", error);
                setSummary([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [
        organization?.id,
        userData?.branch_id,
        userData?.id,
        userData?.role.name,
        startDate,
        endDate,
        status,
        branchId,
        userId,
    ]);

    return {
        summary,
        branches,
        users,
        isLoading,
    };
}
