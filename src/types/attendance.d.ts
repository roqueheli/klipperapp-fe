import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

export interface Attendance {
	id: number
	status: string,
	date?: Date | null,
	time?: Timestamp | null,
	profile_id: number,
	service_id: number,
	organization_id: number,
	branch_id: number,
	attended_by: number | null,
}

export interface Attendances {
    attendances: Attendance[]
}
