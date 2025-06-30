import { ChangeFormData, LoginResponseType, RegisterData, RegisterResponseType } from "@/types/auth";
import httpExternalApi from "../common/http.external.service";

class AuthAPI {
    login = async (email: string, password: string): Promise<LoginResponseType> => httpExternalApi.httpPostPublic('/login', 'POST', { email, password });
    reset_password = async (email: string, token: string): Promise<LoginResponseType> => httpExternalApi.httpPost('/users/reset_password', 'PATCH', { email }, token);
    update_password = async (changeBody: ChangeFormData, token: string): Promise<LoginResponseType> => httpExternalApi.httpPost(`/users/update_password/${changeBody.id}`, 'PATCH', { current_password: changeBody.old_password, new_password: changeBody.new_password, new_password_confirmation: changeBody.confirm_password }, token);
    register = async (body: RegisterData): Promise<RegisterResponseType> => httpExternalApi.httpPostPublic('/register', 'POST', body);
    logout = async (token: string) => await httpExternalApi.httpPost('/logout', 'POST', undefined, token);
    me = async (token?: string) => httpExternalApi.httpGet('/me', undefined, token);
}

const authAPI = new AuthAPI();
export default authAPI;