import { Service } from "@/types/service";
import httpExternalApi from "../common/http.external.service";

class ServicesAPI {
    getServices = async (params: URLSearchParams, token: string): Promise<Service[]> => httpExternalApi.httpGet(`/services`, params, token);
    updateService = async (body: Service, token: string): Promise<Service> => httpExternalApi.httpPost(`/services/${body?.id}`, 'PUT', body, token);
    createService = async (body: Service, token: string): Promise<Service> => httpExternalApi.httpPost(`/services`, 'POST', body, token);
    deleteService = async (body: Service, token: string): Promise<Service> => httpExternalApi.httpPost(`/services/${body?.id}`, 'DELETE', undefined, token);

}

const servicesAPI = new ServicesAPI();
export default servicesAPI;