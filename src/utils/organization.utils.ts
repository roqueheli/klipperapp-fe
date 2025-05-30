import { Organization } from "../types/organization";

export const isValidOrganization = (data: any): data is Organization => {
    return data && !data.error && typeof data.name === "string";
};