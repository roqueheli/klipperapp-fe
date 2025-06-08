import { Checkin } from "@/types/checkin";
import httpExternalApi from "../common/http.external.service";

class CheckinAPI {
    checkin = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/start_day', 'POST', body, token);
}

const checkinAPI = new CheckinAPI();
export default checkinAPI;