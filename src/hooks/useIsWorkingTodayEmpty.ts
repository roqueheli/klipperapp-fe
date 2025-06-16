import { useOrganization } from "@/contexts/OrganizationContext";
import { useUser } from "@/contexts/UserContext";
import httpInternalApi from "../lib/common/http.internal.service";
import { UserResponse } from "@/types/user";
import { useEffect, useState } from "react";

export const useIsWorkingTodayEmpty = () => {
    const { data } = useOrganization();
    const { userData } = useUser();
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const usersParams = new URLSearchParams();
            if (data?.id !== undefined) {
                usersParams.set("organization_id", String(data.id));
                usersParams.set("role_id", "3");
            }

            if (userData?.branch_id !== undefined) {
                usersParams.set("branch_id", String(userData.branch_id));
            }

            try {
                const workingUsers = (await httpInternalApi.httpGetPublic(
                    "/users/working_today",
                    usersParams
                )) as UserResponse;
                setIsEmpty(workingUsers.users.length === 0);
            } catch (error) {
                console.error("Error al cargar los usuarios:", error);
            }
        };

        fetchData();
    }, [data?.id, userData?.branch_id]);

    return isEmpty;
};
