import { Attendance, Attendances } from "@/types/attendance";
import httpExternalApi from "../common/http.external.service";

class AttendancesAPI {
    getAttendances = async (token: string): Promise<Attendances> => httpExternalApi.httpGet(`/attendances`, undefined, token);
    getAttendanceById = async (id: URLSearchParams, token: string): Promise<Attendances> => httpExternalApi.httpGet(`/attendances`, id, token);
    createAttendance = async (body: object, token: string): Promise<Attendance> => httpExternalApi.httpPost('/attendances', 'POST', body, token);
}

const attendancessAPI = new AttendancesAPI();
export default attendancessAPI;