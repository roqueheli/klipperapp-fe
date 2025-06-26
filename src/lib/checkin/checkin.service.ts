import { Checkin } from "@/types/checkin";
import httpExternalApi from "../common/http.external.service";
import { Attendance } from "@/types/attendance";

class CheckinAPI {
    checkin = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/start_day', 'POST', body, token);
    start_attendance = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/start_attendance', 'POST', body, token);
    finish_attendance = async (body: Attendance, token: string): Promise<Attendance> => httpExternalApi.httpPost(`/users/finish_attendance`, 'POST', body, token);
    end_attendance = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/end_attendance', 'POST', body, token);
    cancel_attendance = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/cancel_attendance', 'POST', body, token);
    resume_attendance = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/resume_attendance', 'POST', body, token);
    postpone_attendance = async (body: object, token: string): Promise<Checkin> => httpExternalApi.httpPost('/users/postpone_attendance', 'POST', body, token);
}

const checkinAPI = new CheckinAPI();
export default checkinAPI;