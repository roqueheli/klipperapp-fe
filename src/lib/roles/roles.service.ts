import { Role } from "@/types/role";
import httpExternalApi from "../common/http.external.service";

class RolesAPI {
    getRoles = async (params: URLSearchParams, token: string): Promise<Role[]> => httpExternalApi.httpGet(`/roles`, params, token);
}

const rolesAPI = new RolesAPI();
export default rolesAPI;