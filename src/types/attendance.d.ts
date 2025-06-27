import { Service } from "./service"

export interface Attendance {
	id: number
	status: string
	date: string | null
	time: string | null
	profile_id: number
	organization_id: number
	branch_id: number
	attended_by: number | null
	created_at: string
	updated_at: string
	attended_by_user: AttendedByUser
	discount: number | null
	extra_discount: number | null
	user_amount: number | null
	organization_amount: number | null
	start_attendance_at: string | null
	end_attendance_at: string | null
	total_amount: number | null
	trx_number: string | null
	payment_method: string | null
	profile: Profile
	services: Service[]
	parent_attendance_id: number | null
	child_attendances: Attendance[] | []
}

export interface ServicesResponse {
	services: Service[]
	status: number
}

export interface CreateAttendanceResponse {
	profile: Profile
	status: number
}

export interface Attendances {
	attendances: Attendance[]
	status: number
}

export interface AttendanceProfile {
  id: number;
  attendance_id?: number;
  name: string;
  status: "pending" | "processing" | "finished" | "postponed" | "canceled";
}
