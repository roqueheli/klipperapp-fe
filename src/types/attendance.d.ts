import { Profile } from "./profile"
import { Service } from "./service"
import { User } from "./user"

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
	attended_by_user: User
	discount: number | null
	extra_discount: number | null
	tip_amount: number | null
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
	child_attendances: ChildAttendance[]
	error?: string | null;
}

export interface ChildAttendance {
	id: number;
	status: string;
	discount: number;
	extra_discount: number;
	user_amount: number;
	organization_amount: number;
	total_amount: number;
	tip_amount: number;
	start_attendance_at: string;
	end_attendance_at: string;
	attended_by: number;
	branch_id: number;
	organization_id: number;
	profile_id: number;
	payment_method: string;
	created_at: string;
	updated_at: string;
	attended_by_user: {
		id: number;
		name: string;
		email: string;
		phone_number: string;
		role_id: number;
		organization_id: number;
		branch_id: number;
		active: boolean;
		photo_url: string;
	},
	profile: Profile;
	services: Service[];
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
	status: "pending" | "processing" | "postponed" | "canceled" | "declined";
	clickeable: boolean | null;
}

export interface AttendanceCable {
	id: number;
	status: "pending" | "processing" | "finished" | "postponed" | "canceled" | "declined" | "completed";
	organization_id: number;
	branch_id: number;
	attended_by: number;
	profile: Profile;
}
