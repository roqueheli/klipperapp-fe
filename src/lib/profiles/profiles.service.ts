import { Profile, ProfileByNumber } from "@/types/profile";
import httpExternalApi from "../common/http.external.service";

class ProfilesAPI {
    getProfile = async (params?: URLSearchParams, token?: string): Promise<ProfileByNumber> => httpExternalApi.httpGet(`/profiles`, params, token);
    registerProfile = async (body?: object, token?: string): Promise<Profile> => httpExternalApi.httpPost(`/profiles`, 'POST', body, token);
}

const profilesAPI = new ProfilesAPI();
export default profilesAPI;