import { User } from "@/types/user";
import httpExternalApi from "../common/http.external.service";

class UsersAPI {
    getUser = async (slug: string): Promise<User> => httpExternalApi.httpGet(`/user`, undefined, slug);
}

const usersAPI = new UsersAPI();
export default usersAPI;