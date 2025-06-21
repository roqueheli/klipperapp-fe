export interface Role {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface RoleResponse {
    roles: Role[];
    status: number;
}