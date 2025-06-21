import { Profile } from "./profile";

export interface User {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
    birth_date?: string;
    active?: boolean;
    password_digest?: string;
    role_id?: number;
    organization_id?: number;
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