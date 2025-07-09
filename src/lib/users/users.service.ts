import { User, UserResponse } from "@/types/user";
import httpExternalApi from "../common/http.external.service";

class UsersAPI {
    getUsers = async (params: URLSearchParams, token: string): Promise<UserResponse> => httpExternalApi.httpGet(`/users`, params, token);
    getUsersWorkingToday = async (params: URLSearchParams, token: string): Promise<UserResponse> => httpExternalApi.httpGet(`/users/working_today`, params, token);
    updateUser = async (body: User, token: string): Promise<User> => httpExternalApi.httpPost(`/users/${body?.id}`, 'PUT', body, token);
    createUser = async (body: User, token: string): Promise<User> => httpExternalApi.httpPost(`/users`, 'POST', body, token);
    deleteUser = async (body: User, token: string): Promise<User> => httpExternalApi.httpPost(`/users/${body?.id}`, 'DELETE', undefined, token);
    setNotAvailable = async (body: User, token: string): Promise<User> => httpExternalApi.httpPost(`/users/${body?.id}/not_available`, 'PATCH', undefined, token);
    setAvailable = async (body: User, token: string): Promise<User> => httpExternalApi.httpPost(`/users/${body?.id}/available`, 'PATCH', undefined, token);
}

const usersAPI = new UsersAPI();
export default usersAPI;