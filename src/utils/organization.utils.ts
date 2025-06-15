import { Organization } from "@/types/organization";

// eslint-disable-next-line
export const isValidOrganization = (data: any): data is Organization => {   
    return data && typeof data.name === "string" && typeof data.id === "number";
};
