import { Organization } from "@/types/organization";

// eslint-disable-next-line react-hooks/exhaustive-deps
export const isValidOrganization = (data: any): data is Organization => {   
    return data && typeof data.name === "string" && typeof data.id === "number";
};
