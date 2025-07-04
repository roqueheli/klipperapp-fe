import { ChangeFormData, LoginResponseType, RegisterData, RegisterResponseType, RestoreFormData } from "@/types/auth";
import httpExternalApi from "../common/http.external.service";

class AuthAPI {
    login = async (email: string, password: string): Promise<LoginResponseType> => httpExternalApi.httpPostPublic('/login', 'POST', { email, password });
    reset_password = async (email: string): Promise<LoginResponseType> => httpExternalApi.httpPost('/users/reset_password', 'POST', { email });
    update_password = async (changeBody: ChangeFormData, token: string): Promise<LoginResponseType> => httpExternalApi.httpPost(`/users/update_password`, 'PATCH', changeBody, token);
    restore_password = async (body: RestoreFormData, token: string) => httpExternalApi.httpPost('/users/verify_email', 'POST', body, token);
    register = async (body: RegisterData): Promise<RegisterResponseType> => httpExternalApi.httpPostPublic('/register', 'POST', body);
    logout = async (token: string) => await httpExternalApi.httpPost('/logout', 'POST', undefined, token);
    me = async (token?: string) => httpExternalApi.httpGet('/me', undefined, token);
}

const authAPI = new AuthAPI();
export default authAPI;