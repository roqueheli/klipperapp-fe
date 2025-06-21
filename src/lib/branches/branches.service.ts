import { Service } from "@/types/service";
import httpExternalApi from "../common/http.external.service";
import { Branch } from "@/types/branch";

class BranchesAPI {
    getBranches = async (params: URLSearchParams, token: string): Promise<Branch[]> => httpExternalApi.httpGet(`/branches`, params, token);
}

const branchesAPI = new BranchesAPI();
export default branchesAPI;