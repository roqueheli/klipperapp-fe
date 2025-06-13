import { Attendance } from "@/types/attendance";
import { UserWithProfiles } from "@/types/user";
import httpExternalApi from "../common/http.external.service";

class AttendancesAPI {
    getAttendances = async (params?: URLSearchParams, token?: string): Promise<Attendance[]> => httpExternalApi.httpGet(`/attendances`, params, token);
    getAttendancesByUserWorking = async (params?: URLSearchParams, token?: string): Promise<UserWithProfiles[]> => httpExternalApi.httpGet(`/attendances/by_users_working_today`, params, token);
    getAttendanceById = async (id?: URLSearchParams, token?: string): Promise<Attendance[]> => httpExternalApi.httpGet(`/attendances`, id, token);
    createAttendance = async (body: object, token: string): Promise<Attendance> => httpExternalApi.httpPost('/attendances', 'POST', body, token);
}

const attendancessAPI = new AttendancesAPI();
export default attendancessAPI;