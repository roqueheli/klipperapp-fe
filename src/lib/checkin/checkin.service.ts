import { Checkin } from "@/types/checkin";
import httpExternalApi from "../common/http.external.service";

class CheckinAPI {
    checkin = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/start_day', 'POST', body, token);
    start_attendance = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/start_attendance', 'POST', body, token);
    finish_attendance = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/finish_attendance', 'POST', body, token);
    end_attendance = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/end_attendance', 'POST', body, token);
}

const checkinAPI = new CheckinAPI();
export default checkinAPI;