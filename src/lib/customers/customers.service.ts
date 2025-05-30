import { Customer } from "@/types/customer";
import httpExternalApi from "../common/http.external.service";

class CustomersAPI {
    getCustomer = async (slug: string): Promise<Customer> => httpExternalApi.httpGet(`/customer`, undefined, slug);
}

const customersAPI = new CustomersAPI();
export default customersAPI;