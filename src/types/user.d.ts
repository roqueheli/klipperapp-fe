import { Profile } from "./profile";
import { Role } from "./role";

export interface User {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
    birth_date?: string;
    active?: boolean;
    password?: string;
    role: Role
    organization_id?: number;
    start_working_at?: string;
    work_state?: string;
    photo_url?: string;
    skills?: Array[string];
    premium?: boolean;
    branch_id?: number;
    email_verified?: boolean;
}

export interface UserResponse {
    status: number;
    users: User[];
}

export interface MenuItem {
    label: string;
    path: string;
    allowedRoles: number[];
    icon: string;
}

export interface UserWithProfiles {
    user: User;
    profiles: Profile[];
}

export interface UserWithProfilesResponse {
    usersAttendances: UserWithProfiles[];
    status: number;
}

export interface UserCreate {
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