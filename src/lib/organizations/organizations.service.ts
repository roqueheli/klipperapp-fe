import { Organization } from "@/types/organization";
import httpExternalApi from "../common/http.external.service";

class OrganizationsAPI {
    getOrganization = async (slug: string): Promise<Organization> => httpExternalApi.httpGet(`/organizations`, new URLSearchParams({ slug }));
}

const organizationsAPI = new OrganizationsAPI();
export default organizationsAPI;