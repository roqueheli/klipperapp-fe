import { UserResponse } from "@/types/user";
import httpExternalApi from "../common/http.external.service";

class UsersAPI {
    getUsers = async (params: URLSearchParams, token: string): Promise<UserResponse> => httpExternalApi.httpGet(`/users`, params, token);
    getUsersWorkingToday = async (params: URLSearchParams, token: string): Promise<UserResponse> => httpExternalApi.httpGet(`/users/working_today`, params, token);
}

const usersAPI = new UsersAPI();
export default usersAPI;