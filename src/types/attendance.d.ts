
export interface Attendance {
	id: number
	status: string
	date: string | null
	time: string | null
	profile_id: number
	service_id: number
	organization_id: number
	branch_id: number
	attended_by: number | null
	created_at: string
	updated_at: string
	attended_by_user: AttendedByUser
	profile: Profile
	service: Service
}

export interface AttendedByUser {
	id: number
	name: string
	email: string
	phone_number: string
	address_line1: string | null
	address_line2: string | null
	city: string | null
	state: string | null
	zip_code: string | null
	country: string | null
	active: boolean
	password_digest: string
	role_id: number
	organization_id: number
	created_at: string
	updated_at: string
	start_working_at: string | null
	work_state: string
	branch_id: number
}

export interface Profile {
	id: number
	name: string
	email: string
	birth_date: string
	phone_number: string
	organization_id: number
	branch_id: number | null
	created_at: string
	updated_at: string
}

export interface CreateAttendanceResponse {
	profile: Profile
	status: number
}

export interface Service {
	id: number
	name: string
	description: string | null
	organization_id: number
	price: string
	branch_id: number
	duration: number
	active: boolean
	created_at: string
	updated_at: string
}
export interface Attendances {
	attendances: Attendance[]
	status: number
}
