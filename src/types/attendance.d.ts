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
	service: Service
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

export interface CreateAttendanceResponse {
	profile: Profile
	status: number
}

export interface Attendances {
	attendances: Attendance[]
	status: number
}
