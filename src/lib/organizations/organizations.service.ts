import { Organization } from "@/types/organization";
import httpExternalApi from "../common/http.external.service";

class OrganizationsAPI {
    getOrganization = async (slug: string): Promise<Organization> => httpExternalApi.httpGet(`/organizations`, new URLSearchParams({ slug }));
    updateOrganization = async (body: Organization, token: string): Promise<Organization> => httpExternalApi.httpPost(`/organizations/${body?.id}`, 'PUT', body, token);
}

const organizationsAPI = new OrganizationsAPI();
export default organizationsAPI;