import { Attendance } from "@/types/attendance";
import { User, UserWithProfiles } from "@/types/user";
import httpExternalApi from "../common/http.external.service";

class AttendancesAPI {
    getAttendances = async (params?: URLSearchParams, token?: string): Promise<Attendance[]> => httpExternalApi.httpGet(`/attendances`, params, token);
    getTodayAttendances = async (params?: URLSearchParams, token?: string): Promise<Attendance[]> => httpExternalApi.httpGet(`/attendances/today`, params, token);
    getAttendancesHistory = async (params?: URLSearchParams, token?: string): Promise<Attendance[]> => httpExternalApi.httpGet(`/attendances/history`, params, token);
    getAttendancesByUserWorking = async (params?: URLSearchParams, token?: string): Promise<UserWithProfiles[]> => httpExternalApi.httpGet(`/attendances/by_users_working_today`, params, token);
    getUsersQueue = async (token?: string): Promise<User[]> => httpExternalApi.httpGet(`/attendances/by_users_queue`, undefined, token);
    getAttendanceById = async (id?: URLSearchParams, token?: string): Promise<Attendance[]> => httpExternalApi.httpGet(`/attendances`, id, token);
    createAttendance = async (body: object, token: string): Promise<Attendance> => httpExternalApi.httpPost('/attendances', 'POST', body, token);
    updateAttendance = async (body: Attendance, token: string): Promise<Attendance> => httpExternalApi.httpPost(`/attendances/${body?.id}`, 'PUT', body, token);
}

const attendancessAPI = new AttendancesAPI();
export default attendancessAPI;