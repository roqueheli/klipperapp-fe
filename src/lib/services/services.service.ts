import { Service } from "@/types/service";
import httpExternalApi from "../common/http.external.service";

class ServicesAPI {
    getServices = async (params: URLSearchParams, token: string): Promise<Service> => httpExternalApi.httpGet(`/services`, params, token);
}

const servicesAPI = new ServicesAPI();
export default servicesAPI;