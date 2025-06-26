import { LoginResponseType, RegisterData, RegisterResponseType } from "@/types/auth";
import httpExternalApi from "../common/http.external.service";

class AuthAPI {
    login = async (email: string, password: string): Promise<LoginResponseType> => httpExternalApi.httpPostPublic('/login', 'POST', { email, password });
    register = async (body: RegisterData): Promise<RegisterResponseType> => httpExternalApi.httpPostPublic('/register', 'POST', body);
    logout = async (token: string) => await httpExternalApi.httpPost('/logout', 'POST', undefined, token);
    me = async (token?: string) => httpExternalApi.httpGet('/me', undefined, token);
}

const authAPI = new AuthAPI();
export default authAPI;