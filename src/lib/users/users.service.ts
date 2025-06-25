import { CalculatePayment, CalculatePaymentResponse } from "@/types/calculate";
import { User, UserResponse } from "@/types/user";
import httpExternalApi from "../common/http.external.service";
import { SearchParams } from "next/dist/server/request/search-params";

class UsersAPI {
    getUsers = async (params: URLSearchParams, token: string): Promise<UserResponse> => httpExternalApi.httpGet(`/users`, params, token);
    getUsersWorkingToday = async (params: URLSearchParams, token: string): Promise<UserResponse> => httpExternalApi.httpGet(`/users/working_today`, params, token);
    updateUser = async (body: User, token: string): Promise<User> => httpExternalApi.httpPost(`/users/${body?.id}`, 'PUT', body, token);
    createUser = async (body: User, token: string): Promise<User> => httpExternalApi.httpPost(`/users`, 'POST', body, token);
    deleteUser = async (body: User, token: string): Promise<User> => httpExternalApi.httpPost(`/users/${body?.id}`, 'DELETE', undefined, token);
    calculatePayments = async (params: URLSearchParams, token: string): Promise<CalculatePaymentResponse> => httpExternalApi.httpGet(`/users/calculate_payment`, params, token);
}

const usersAPI = new UsersAPI();
export default usersAPI;