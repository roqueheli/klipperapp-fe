import { Profile } from "./profile";

export interface User {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip_code?: number;
    country?: string;
    active?: boolean;
    password_digest?: string;
    role_id?: number;
    organization_id?: number;
    created_at?: string;
    updated_at?: string;
    start_working_at?: string;
    work_state?: string;
    photo_url?: string;
    skills?: Array[string];
    premium?: boolean;
    branch_id?: number;
}

export interface UserResponse {
    status: number;
    users: User[];
}

export interface MenuItem {
    label: string;
    path: string;
    allowedRoles: number[];
}

export interface UserWithProfiles {
    user: User;
    profiles: Profile[];
}

export interface UserWithProfilesResponse {
    usersAttendances: UserWithProfiles[];
    status: number;
}