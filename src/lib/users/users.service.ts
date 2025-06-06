import { User } from "@/types/user";
import httpExternalApi from "../common/http.external.service";

class UsersAPI {
    getUsers = async (params: URLSearchParams, token: string): Promise<User> => httpExternalApi.httpGet(`/users`, params, token);
}

const usersAPI = new UsersAPI();
export default usersAPI;