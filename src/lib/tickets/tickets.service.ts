import { Ticket } from "@/types/ticket";
import httpExternalApi from "../common/http.external.service";

class TicketsAPI {
    getTicket = async (slug: string): Promise<Ticket> => httpExternalApi.httpGet(`/ticket`, undefined, slug);
}

const ticketsAPI = new TicketsAPI();
export default ticketsAPI;