import { LoginResponseType, RegisterResponseType } from "@/types/auth";
import httpExternalApi from "../common/http.external.service";

class AuthAPI {
    login = async (email: string, password: string): Promise<LoginResponseType> => httpExternalApi.httpPostPublic('/login', 'POST', { email, password });
    register = async (user_data: { email: string, password: string, first_name: string, last_name: string, phone: string, birth_date: Date }): Promise<RegisterResponseType> => httpExternalApi.httpPostPublic('/register', 'POST', user_data);
    logout = async (token: string) => httpExternalApi.httpPost('/logout', 'POST', undefined, token);
}

const authAPI = new AuthAPI();
export default authAPI;