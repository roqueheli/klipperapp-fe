import { ChangeFormData, LoginResponseType, RegisterData, RegisterResponseType } from "@/types/auth";
import httpExternalApi from "../common/http.external.service";

class AuthAPI {
    login = async (email: string, password: string): Promise<LoginResponseType> => httpExternalApi.httpPostPublic('/login', 'POST', { email, password });
    reset_password = async (email: string): Promise<LoginResponseType> => httpExternalApi.httpPostPublic('/users/reset_password', 'POST', { email });
    update_password = async (body: ChangeFormData): Promise<LoginResponseType> => httpExternalApi.httpPostPublic('/users/update_password', 'PATCH', { current_password: body.old_password, new_password: body.new_password, new_password_confirmation: body.confirm_password });
    register = async (body: RegisterData): Promise<RegisterResponseType> => httpExternalApi.httpPostPublic('/register', 'POST', body);
    logout = async (token: string) => await httpExternalApi.httpPost('/logout', 'POST', undefined, token);
    me = async (token?: string) => httpExternalApi.httpGet('/me', undefined, token);
}

const authAPI = new AuthAPI();
export default authAPI;