import { Branch } from "@/types/branch";
import httpExternalApi from "../common/http.external.service";

class BranchesAPI {
    getBranches = async (params: URLSearchParams, token: string): Promise<Branch[]> => httpExternalApi.httpGet(`/branches`, params, token);
    updateBranch = async (body: Branch, token: string): Promise<Branch> => httpExternalApi.httpPost(`/branches/${body?.id}`, 'PUT', body, token);
    createBranch = async (body: Branch, token: string): Promise<Branch> => httpExternalApi.httpPost(`/branches`, 'POST', body, token);
    deleteBranch = async (body: Branch, token: string): Promise<Branch> => httpExternalApi.httpPost(`/branches/${body?.id}`, 'DELETE', undefined, token);
}

const branchesAPI = new BranchesAPI();
export default branchesAPI;